<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		getSettings,
		saveSettings,
		settingsToJson,
		importSettingsFromJSON
	} from '@/lib/settings';
	import Icon from '@iconify/svelte';
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
		event.preventDefault();
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

	function save() {
		let trimmedCourses = [...courses].map((course) => course.trim());
		saveSettings({
			courses: trimmedCourses,
			className: className.trim(),
			username: username.trim(),
			password
		});
		goto('/');
	}

	function exportSettings() {
		const jsonSettings = settingsToJson();
		const urlSafeSettings = encodeURIComponent(jsonSettings);
		const exportUrl = `${window.location.origin}/settings?import=${urlSafeSettings}`;

		if (navigator.share) {
			navigator.share({
				title: 'BBS Stundenplan App',
				text: 'Mit diesem Link kannst du die BBS Viewer app mit meinen Einstellungen nutzen',
				url: exportUrl
			});
		} else if (navigator.clipboard) {
			navigator.clipboard.writeText(exportUrl);
			alert(
				'Der Link mit deinen Einstellungen wurde kopiert! Schick ihn jemandem oder dir selbst als Backup.'
			);
		} else {
			prompt(
				'Mit diesem Link aknnst du die aktuellen Einstellungen auf einem anderen Gerät verwenden',
				exportUrl
			);
		}

		// prompt(
		// 	'Füge den folgenden text auf einem anderen Gerät ein, um die Einstellungen dort zu importieren',
		// 	exportUrl
		// );
	}

	function importSettings() {
		const inputString = prompt('Füge den Link mit den Einstellungen hier ein');
		if (!inputString) {
			alert('no link');
			return;
		}
		const urlParams = new URLSearchParams(new URL(inputString).search);
		console.log(urlParams);
		const importString = urlParams.get('import');
		console.log(importString);
		if (!importString) {
			alert('kein link');
			return;
		}
		importSettingsFromJSON(importString);
		loadSettings();
	}

	onMount(() => {
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
		<button class="bg-primary p-4 w-full rounded-md border border-colborder mt-2" on:click={save}>
			Speichern
		</button>
		<div class="flex gap-2 pt-2">
			<button
				class="bg-blue-400 p-4 w-full rounded-md border border-colborder"
				on:click={exportSettings}>Einstellungen teilen</button
			>
			<button
				class="bg-blue-400 p-4 w-full rounded-md border border-colborder"
				on:click={importSettings}>Aus Link laden</button
			>
		</div>
	</main>
</div>
