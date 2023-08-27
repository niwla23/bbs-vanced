<script lang="ts">
	import type { TimetableTimeSlot } from 'bbs-parser/src/types';

	export let timeSlot: TimetableTimeSlot;
	export let hours: number[];
</script>

<div
	class="{timeSlot.length > 0
		? 'bg-dark'
		: 'bg-darkest'} rounded-md border border-colborder shadow-sm shadow-black flex items-center p-2"
>
	<div class="text-3xl tracking-tight w-20 font-bold flex justify-center items-center pr-2">
		<p class="w-min text-primary">{hours.join('/')}</p>
	</div>
	<div>
		{#if timeSlot.length > 0}
			{#each timeSlot as lesson}
				<p class="">{lesson.subject}</p>
				<p class="text-muted">{lesson.teacher}</p>
				<p class="text-muted">{lesson.room}</p>
			{/each}
		{:else}
			<p class="text-muted">Frei :)</p>
		{/if}
	</div>
</div>
