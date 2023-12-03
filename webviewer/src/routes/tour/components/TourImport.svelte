<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { coursesString } from '../stores';
	const dispatch = createEventDispatcher();
	function next(importCourses: boolean) {
		if ($coursesString == '' && importCourses) {
			alert('bitte füge deine kurse in das scheiß textfeld ein.');
			return;
		}
		dispatch('next');
	}
</script>

<div class="w-full flex justify-center p-4 h-full items-center">
	<main class="max-w-4xl w-full h-full flex flex-col justify-between md:justify-center">
		<section>
			<p>Sehr gut!</p>
			<p class="pb-4">
				Jetzt können wir deine Kurse aus virtueller-stundenplan.org importieren. Logge dich dort ein
				und geh auf <b>Meine Anwesenheiten. Kopiere den Text unter "Kurse" und füge ihn hier ein.</b
				>
			</p>
			<div class="flex flex-col gap-2 bg-dark p-2 rounded-md">
				<div class="flex">
					<p class="font-bold text-3xl w-12">1.</p>
					<a
						class="p-2 w-full bg-primary rounded-md block text-center"
						href="https://virtueller-stundenplan.org/page2/page-2/index.php?ref=../index.php"
						target="_blank"
					>
						Virtuellen Stundenplan öffnen
					</a>
				</div>

				<div class="flex">
					<p class="font-bold text-3xl w-12">2.</p>
					<input
						class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
						placeholder="MA-12-1A;GE-12-1A;DE-12-1D;..."
						bind:value={$coursesString}
					/>
				</div>

				<div class="flex w-full justify-center">
					<div class="w-full flex max-w-2xl">
						<img
							src="/tour/import1.png"
							class="flex-1 w-1/2 rounded-l-md"
							alt="Import Anleitung 1"
						/>
						<img
							src="/tour/import2.png"
							class="flex-1 w-1/2 rounded-r-md"
							alt="Import Anleitung 2"
						/>
					</div>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-2 pt-4">
			<button class="bg-dark p-4 rounded-md w-full" on:click={() => next(false)}>
				Ich habe keine Kurse oder möchte sie selbst eintragen.
			</button>
			<button class="bg-primary p-4 rounded-md w-full font-bold" on:click={() => next(true)}
				>Weiter</button
			>
		</section>
	</main>
</div>
