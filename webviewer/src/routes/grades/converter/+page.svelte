<script lang="ts">
	import TopBar from '@/lib/TopBar.svelte';
	import { pointsToGrade, pointsToGradePlusMinus } from '@/lib/grades';

	let inputValue: number | null = null;

	function convert(x: number | null) {
		if (x == null) return 'Bitte Punktzahl eingeben.';
		if (x > 15 || x < 0) return 'Die Punktzahl muss zwischen 1 und 15 liegen.';
		const dec = pointsToGrade(x).toFixed(2);
		return `${dec} ⇒ ${pointsToGradePlusMinus(x)}`;
	}
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<!-- <h1 class="font-bold text-2xl"> -->
		<!-- 	<a href="/"><Icon icon="material-symbols:arrow-left-alt" class="inline h-12" /></a> -->
		<!-- 	News -->
		<!-- </h1> -->
		<TopBar title="Notenumrechner" />
		<div class="flex flex-col gap-2 pt-12">
			<label class="block">
				<span class="font-light">Notenpunkte</span>
				<input
					class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
					placeholder="1-15"
					type="number"
					bind:value={inputValue}
				/>
			</label>
			<p
				class="text-2xl text-center font-bold {inputValue && inputValue < 5 ? 'text-red-400' : ''}"
			>
				{convert(inputValue)}
			</p>
		</div>
	</main>
</div>
