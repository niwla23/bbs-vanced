<script lang="ts">
	import { getMobileOperatingSystem } from '@/lib/platformDetection';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();
	function next() {
		dispatch('next');
	}

	let platform = '';

	onMount(() => {
		platform = getMobileOperatingSystem();
	});
</script>

<div class="w-full h-full flex justify-center items-center p-4">
	<main class="max-w-4xl w-full h-screen lg:h-[80vh] max-h-screen flex flex-col">
		<section>
			<h1 class="text-xl font-bold">Bevor wir weitermachen</h1>
			<p>
				Am besten fügst du diese Website zum Homebildschirm hinzu. Dann funktioniert sie wie eine
				normale App und du findest sie immer schnell.
				{#if platform == 'iOS'}
					<b
						>Bei iOS: Bitte wechsle danach auch in die installierte Version, da die Einstellungen
						nicht synchronisiert werden</b
					>
				{/if}
			</p>
		</section>

		<section class="flex-1 min-h-0 flex flex-col justify-between h-full">
			<video class="h-5/6 w-full" autoplay muted loop>
				{#if platform == 'iOS'}
					<source src="/tour/installIos.mp4" type="video/mp4" />
				{:else}
					<source src="/tour/installAndroid.mp4" type="video/mp4" />
				{/if}
			</video>
			<button class="bg-primary p-4 rounded-md w-full font-bold" on:click={next}
				>Hab ich gemacht</button
			>
		</section>
	</main>
</div>
