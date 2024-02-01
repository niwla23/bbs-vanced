<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import PocketBase from 'pocketbase';
	import TopBar from '@/lib/TopBar.svelte';
	import {
		getSettings,
		saveSettings,
		settingsToJson,
		importSettingsFromJSON
	} from '@/lib/settings';
	import { shareApp } from '@/lib/shareApp';
	import Icon from '@iconify/svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import UiButton from '@/lib/UiButton.svelte';
	import { slide, fly } from 'svelte/transition';
	import { quintInOut, quintOut, sineOut } from 'svelte/easing';

	let hasPro = false;

	let courses = new Set<string>([]);
	let className = '';
	let theme = 'lime';

	function removeCourse(course: string) {
		courses.delete(course);
		courses = courses;
	}

	function addCourse(event: Event) {
		event.preventDefault();
		// @ts-expect-error i dont wanna fix it
		let course = event.currentTarget[0].value;
		// @ts-expect-error i dont wanna fix it
		event.target.reset();
		courses.add(course);
		courses = courses;
	}

	async function loadSettings() {
		let data = await getSettings();
		if (!data) return;
		className = data.className;
		courses = new Set(data.courses);

		const fetchedTheme = localStorage.getItem('theme');
		if (fetchedTheme) theme = fetchedTheme;
	}

	async function save() {
		let trimmedCourses = [...courses].map((course) => course.trim());
		await saveSettings(
			{
				courses: trimmedCourses,
				className: className.trim()
			},
			hasPro
			// true
		);
		localStorage.setItem('theme', theme);
		document.documentElement.dataset.theme = theme;
		goto('/');
	}

	function clear() {
		if (!confirm('Wirklich alle Einstellungen löschen?')) return;
		Cookies.remove('settings');
		localStorage.removeItem('settings');
		const pb = new PocketBase('https://bbs-backend.noteqr.de');
		goto('/tour');
	}

	onMount(() => {
		hasPro = localStorage.getItem('hasPro') == 'true';
		loadSettings();
		const urlParams = new URLSearchParams(window.location.search);
		const importString = urlParams.get('import');
		if (importString) {
			importSettingsFromJSON(importString);
			loadSettings();
			window.location.href = window.location.origin + window.location.pathname;
		}
	});
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full pt-12">
		<TopBar title="Einstellungen" icon="mingcute:settings-3-line">
			<button on:click={() => shareApp('settings_share')} class="rounded-md px-2 text-xs">
				<Icon icon="material-symbols:share" class="h-6 w-6" />
			</button>
		</TopBar>

		{#if hasPro}
			<p>Du verwendest BBS Vanced PRO 😀</p>
		{:else}
			<p>Du hast kein PRO 😪</p>
			<button class="w-full bg-primary p-2 rounded-md">PRO kaufen</button>
		{/if}

		<label class="block pb-2">
			<span class="font-light">Theme (PRO)</span>
			<select
				bind:value={theme}
				class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
				disabled={!hasPro}
			>
				<option value="lime">Lime</option>
				<option value="pumpkin">Pumpkin</option>
				<option value="pink">Pink</option>
				<option value="aqua">Aqua</option>
				<option value="rainbow">Rainbow</option>
				<option value="blackandwhite">Black and White</option>
				<option value="bright">I am mentally ill.</option>
			</select>
		</label>

		<label class="block pt-2 pb-2">
			<span class="font-light">Deine Klasse (z.B: BG-T-23, BG-22, ...)</span>
			<input
				class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
				placeholder="z.B.: BG-22"
				bind:value={className}
			/>
		</label>

		<h2 class="text-xl pt-2">Deine Fächer / Kurse</h2>
		<UiButton appearance="normal" class="mb-2" on:click={() => goto('/settings/updateCourses')}>
			Kurse aus Stundenplan aktualisieren
		</UiButton>
		<ul class="flex flex-col gap-2">
			<form
				class="flex justify-between items-center p-4 rounded-md bg-dark border border-colborder font-light"
				on:submit={addCourse}
			>
				<input
					class="w-full bg-dark rounded-md placeholder:text-brightest/25 placeholder:font-thin"
					placeholder="z.B.: EN-12-1B"
					required
				/>
				<button type="submit" class="bg-green-500 p-1 rounded-md">
					<Icon icon="material-symbols:add" />
				</button>
			</form>
			{#each courses as course (course)}
				<li
					transition:slide={{ axis: 'y', duration: 200 }}
					class="flex justify-between items-center p-4 rounded-md bg-dark border border-colborder font-light"
				>
					<span>{course}</span>
					<UiButton class="bg-red-500 p-1 rounded-md w-min" on:click={() => removeCourse(course)}>
						<Icon icon="material-symbols:remove" />
					</UiButton>
				</li>
			{/each}
		</ul>
		<UiButton appearance="primary" on:click={save} class="mt-2">Speichern</UiButton>
		<UiButton appearance="danger" on:click={clear} class="mt-2">Reset App</UiButton>
	</main>
</div>
