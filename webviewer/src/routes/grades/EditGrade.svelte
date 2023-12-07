<script lang="ts">
	let points = 0;
	let isGuess = false;

	function onSubmit(e: Event) {
		e.preventDefault();
	}
</script>

<div
	class="fixed inset-0 w-full h-full flex justify-center items-center p-2 bg-dark/80 backdrop-blur-sm"
>
	<form class="bg-darkest w-full p-4 rounded-md" on:submit={onSubmit}>
		<h2 class="font-bold pb-2">Note bearbeiten</h2>
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
			<span>Nur geschätzt</span>
			<input
				bind:value={isGuess}
				type="checkbox"
				class="bg-dark text-brightest p-1 rounded-md w-6 h-6"
			/>
		</label>
		<button class="w-full p-2 bg-primary text-on-primary rounded-md">OK</button>
	</form>
</div>
