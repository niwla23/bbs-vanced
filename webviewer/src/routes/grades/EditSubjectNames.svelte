<script lang="ts">
	import type { SubjectUserData } from '@/lib/grades';
	import { createEventDispatcher } from 'svelte';

	export let gradeUserData: SubjectUserData[] = [];
	export let subjectNameOptions: string[][];

	const dispatch = createEventDispatcher();

	function onClose(e: Event) {
		e.preventDefault();
		dispatch('close');
	}

	function onSubmit(e: Event) {
		e.preventDefault();
		dispatch('submit', { gradeUserData });
	}
</script>

<div class="fixed inset-0 w-full h-full flex justify-center items-center p-2 bg-darkest z-30">
	<div class="text-center p-4 max-w-lg w-full">
		<h1 class="font-bold text-xl pb-4">Kurse bearbeiten</h1>

		<div class="flex flex-col gap-2 w-full">
			{#each subjectNameOptions as subject, subjectIndex}
				{#if subject.length > 1}
					<select
						class="w-full rounded-md bg-dark p-2"
						bind:value={gradeUserData[subjectIndex].nameOption}
					>
						{#each subject as option, optionIndex}
							<option value={optionIndex}>
								{option}
							</option>
						{/each}
					</select>
				{:else}
					<p class="text-left p-2 bg-dark/80 rounded-md">{subject[0]}</p>
				{/if}
			{/each}
		</div>

		<button class="w-full bg-primary text-on-primary p-4 rounded-md mt-4" on:click={onSubmit}>
			Verstanden
		</button>
	</div>
</div>
