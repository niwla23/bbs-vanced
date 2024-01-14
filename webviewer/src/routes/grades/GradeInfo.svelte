<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hasPro } from '../stores';

	const dispatch = createEventDispatcher();

	function onClose(e: Event) {
		e.preventDefault();
		dispatch('close');
	}
</script>

<div
	class="fixed inset-0 w-full h-full flex justify-center items-center p-2 bg-dark/80 backdrop-blur-md z-30"
>
	<div class="text-center p-4 max-w-lg">
		<h1 class="font-bold text-xl">Willkommen beim Abirechner</h1>
		{#if !$hasPro}
			<h2 class="font-bold pt-4">PRO Funktion</h2>
			<p class="text-red-600">
				Achtung: Du hast kein PRO, deine eingetragenen Noten werden nicht gespeichert. Mit PRO
				werden deine Noten automatisch in deinem Account gesichert und du kannst sie auf jedem Gerät
				sehen.
			</p>
		{/if}
		<h2 class="font-bold pt-4">Keine Haftung</h2>
		<p>
			Es wird keine Haftung für die berechneten Ergebnisse übernommen. Verwendung auf eigene Gefahr.
		</p>
		<h2 class="font-bold pt-4">Beta</h2>
		<p>
			Diese Funktion ist noch recht neu. Es können wichtige Details fehlen oder das Ergebnis ist
			komplett falsch oder es funktioniert nicht. Sende gerne Feedback über Instagram an <a
				href="https://instagram.com/bbsvanced"
				class="underline"
			>
				@bbsvanced
			</a>
		</p>
		<button class="w-full bg-primary text-on-primary p-4 rounded-md mt-4" on:click={onClose}>
			Verstanden
		</button>
	</div>
</div>
