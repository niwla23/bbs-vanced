<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { grade, className } from '../stores';
	const dispatch = createEventDispatcher();
	function next() {
		if ($grade == 0 || $className == '') {
			alert('Bitte fülle alle Felder aus');
			return;
		}

		if (new RegExp('BG-.*-(22|21)').test($className)) {
			alert(
				'thats not a thing.\ndu hast wahrscheinlich deine Klasse falsch geschriben. z.B. heißt BG-T-22 ab der 12 BG-22'
			);
			return;
		}
		dispatch('next');
	}
</script>

<div class="w-full flex justify-center p-4 h-full">
	<main class="max-w-4xl w-full h-full lg:h-[80vh] flex flex-col justify-between items-center">
		<div class="w-full flex justify-center h-full items-center">
			<img src="/android-chrome-512x512.png" alt="logo" class="w-64 h-64" />
		</div>

		<section>
			<h1 class="text-xl font-bold">Willkommen bei BBS Vanced!</h1>
			<label class="block pt-2 pb-1">
				<span class="font-light">Welches Level bist du?</span>
				<div class="w-full flex gap-2">
					{#each [11, 12, 13] as g}
						<button
							class="p-3 font-bold text-2xl {$grade == g
								? 'bg-primary'
								: 'bg-dark'} rounded-md w-full"
							on:click={() => grade.set(g)}>{g}</button
						>
					{/each}
				</div>
			</label>
			<label class="block pb-4">
				<span class="font-light">Wie heißt deine Klasse?</span>
				<input
					class="w-full bg-dark border border-colborder p-2 rounded-md placeholder:text-brightest/25 placeholder:font-thin"
					placeholder="z.B. BG-T-23 oder BG-22"
					bind:value={$className}
				/>
			</label>
			<button
				class="{$grade != 0 && $className != ''
					? 'bg-primary'
					: 'bg-dark'} p-4 rounded-md w-full font-bold"
				on:click={next}>Let's go</button
			>
		</section>
	</main>
</div>
