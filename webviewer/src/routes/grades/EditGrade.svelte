<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let points = 0;
	export let isGuess = false;
	export let isRelevant = false;
	export let subject: string;
	export let index: number;

	const dispatch = createEventDispatcher();

	function onSubmit(e: Event) {
		e.preventDefault();
		dispatch('submit', { points, isGuess, isRelevant });
	}

	const gradeIndexToText = ['12.1', '12.2', '13.1', '13.2', 'Abiprüfung'];
</script>

<div
	class="fixed inset-0 w-full h-full flex justify-center items-center p-2 bg-dark/80 backdrop-blur-sm z-30"
>
	<form class="bg-darkest w-full max-w-md p-4 rounded-md" on:submit={onSubmit}>
		<h2 class="font-bold pb-2">Note {subject} - {gradeIndexToText[index]} bearbeiten</h2>
		<label class="flex justify-between items-center gap-2 pb-2">
			<span>Punkte</span>
			<input
				bind:value={points}
				type="number"
				class="bg-dark text-brightest p-1 rounded-md w-16"
				max="15"
				min="0"
			/>
		</label>
		<label class="flex justify-between items-center gap-2 pb-2">
			<span>Einbringen</span>
			<input
				bind:checked={isRelevant}
				type="checkbox"
				class="bg-dark text-brightest p-1 rounded-md w-6 h-6"
			/>
		</label>
		<label class="flex justify-between items-center gap-2 pb-2">
			<span>Nur geschätzt</span>
			<input
				bind:checked={isGuess}
				type="checkbox"
				class="bg-dark text-brightest p-1 rounded-md w-6 h-6"
			/>
		</label>
		<button class="w-full p-2 bg-primary text-on-primary rounded-md">OK</button>
	</form>
</div>
