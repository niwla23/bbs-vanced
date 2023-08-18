<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSettings, type Settings } from '@/lib/settings';
	import Icon from '@iconify/svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';

	let courses = new Set<string>([]);
	let username = '';
	let password = '';
	let className = '';

	function removeCourse(course: string) {
		courses.delete(course);
		courses = courses;
	}

	function addCourse(event: Event) {
		// @ts-expect-error i dont wanna fix it
		let course = event.currentTarget[0].value;
		// @ts-expect-error i dont wanna fix it
		event.target.reset();
		courses.add(course);
		courses = courses;
	}

	function loadSettings() {
		let data = getSettings();
		if (!data) return;
		username = data.username;
		password = data.password;
		className = data.className;
		courses = new Set(data.courses);
	}

	function saveSettings() {
		let settings: Settings = { courses: [...courses], className, username, password };
		console.log('saving:', settings);
		let expiryDate = new Date();
		expiryDate.setFullYear(expiryDate.getFullYear() + 10);
		Cookies.set('settings', JSON.stringify(settings), {
			expires: expiryDate,
			secure: true,
			sameSite: 'strict'
		});
		goto('/');
	}

	onMount(() => {
		console.log('loading settings from cookie');
		loadSettings();
	});
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<h1 class="text-2xl">Einstellungen</h1>
		<label class="block pb-2">
			<span class="font-light">Benutzername</span>
			<input
				class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
				placeholder="bbs-musterstadt"
				bind:value={username}
			/>
		</label>
		<label class="block pb-2">
			<span class="font-light">Passwort</span>
			<input
				class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
				placeholder="123"
				type="password"
				bind:value={password}
			/>
		</label>
		<label class="block pb-2">
			<span class="font-light">Deine Klasse (z.B: BG-T-23, BG-22, ...)</span>
			<input
				class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
				placeholder="z.B.: BG-22"
				bind:value={className}
			/>
		</label>
		<h2 class="text-xl pt-2">Deine Fächer</h2>
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
			{#each courses as course}
				<li
					class="flex justify-between items-center p-4 rounded-md bg-dark border border-colborder font-light"
				>
					<span>{course}</span>
					<button class="bg-red-500 p-1 rounded-md" on:click={() => removeCourse(course)}>
						<Icon icon="material-symbols:remove" />
					</button>
				</li>
			{/each}
		</ul>
		<button
			class="bg-primary mt-4 p-4 w-full rounded-md border border-colborder"
			on:click={saveSettings}
		>
			Speichern
		</button>
	</main>
</div>
