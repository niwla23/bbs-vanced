<script lang="ts">
	import { goto } from '$app/navigation';
	import TopBar from '@/lib/TopBar.svelte';
	import { formatDate } from '@/lib/exams';
	import { getSettings } from '@/lib/settings';
	import Icon from '@iconify/svelte';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';

	let subject = '';
	let examType = 'klausur';
	let dateString: string | null = null;
	let startHour: number | null = null;
	let endHour: number | null = null;
	let topic = 'Klausur';

	let appSettings;

	async function save() {
		if (subject == '' || !dateString || !startHour || !endHour || topic == '') {
			alert('Bitte alle Felder ausfüllen');
			return;
		}

		const date = new Date(dateString);

		if (endHour < startHour) {
			alert('Stunde Ende muss größer als Stunde Start sein');
			return;
		}

		if (new Date().getTime() > date.getTime()) {
			alert('Klausur liegt in der Vergangenheit');
			return;
		}

		if (date.getTime() - new Date().getTime() > 1000 * 60 * 60 * 24 * 365) {
			alert('Klausur liegt mehr als ein Jahr in der Zukunft');
			return;
		}

		const pb = new PocketBase('https://bbs-backend.noteqr.de');

		let w = window.open();
		await pb.collection('users').authWithOAuth2({
			provider: 'google',
			urlCallback: (url) => {
				w.location.href = url;
			}
		});

		if (!pb.authStore.model) {
			console.log('no user logged in');
			return;
		}

		const data = {
			subject,
			startHour,
			endHour,
			topic,
			date: formatDate(date),
			schoolUsername: 'bbs-walsrode',
			course: appSettings?.className,
			type: examType,
			createdBy: pb.authStore.model.id
		};

		await pb.collection('exams').create(data);
		goto('/');
	}

	onMount(async () => {
		appSettings = await getSettings();
	});
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<!-- <h1 class="font-bold text-2xl"> -->
		<!-- 	<a href="/"><Icon icon="material-symbols:arrow-left-alt" class="inline h-12" /></a> -->
		<!-- 	Klausur hinzufügen -->
		<!-- </h1> -->

		<TopBar title="Klausur eintragen" icon="mingcute:calendar-add-line" />

		{#if appSettings}
			<div class="pt-12">
				<label class="block pb-2">
					<span class="font-light">Fach</span>

					<select
						bind:value={subject}
						class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
					>
						{#each appSettings?.courses as subject}
							<option value={subject}>
								{subject}
							</option>
						{/each}
						<option value="-all-">Alle Kurse / Fächer</option>
					</select>
				</label>
				<label class="block pb-2">
					<span class="font-light">Datum</span>
					<input
						class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
						type="date"
						bind:value={dateString}
					/>
				</label>
				<div class="w-full flex gap-2">
					<label class="block pb-2 w-full">
						<span class="font-light">Stunde Start</span>
						<input
							class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
							placeholder="3"
							type="number"
							bind:value={startHour}
						/>
					</label>
					<label class="block pb-2 w-full">
						<span class="font-light">Stunde Ende</span>
						<input
							class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
							placeholder="4"
							type="number"
							bind:value={endHour}
						/>
					</label>
				</div>

				<label class="block pb-2">
					<span class="font-light">Thema</span>
					<input
						class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
						placeholder="Klausur"
						bind:value={topic}
					/>
				</label>

				<select
					bind:value={examType}
					class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
				>
					<option value="klausur">Typ: Klausur</option>
					<option value="termin">Typ: Anderer Termin</option>
				</select>
				<button
					class="bg-primary p-4 w-full rounded-md border border-colborder mt-2"
					on:click={save}
				>
					Mit Google anmelden und speichern
				</button>
			</div>
		{/if}
	</main>
</div>
