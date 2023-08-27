<script lang="ts">
	import { page } from '$app/stores';
	import {
		filterTimetable,
		getDateByDeltaDays,
		formatDateForApi,
		weekdayMap
	} from '@/lib/timetableHelpers';
	import type { PageServerData } from './$types';
	import type { TimetableDay } from 'bbs-parser/src/types';
	import Timeslot from '@/lib/Timeslot.svelte';

	export let data: PageServerData;

	$: settings = data.settings;

	function filterWeekTimetable(timetable: [Date, TimetableDay][]) {
		const all = timetable
			.map(([day, v]) => {
				const filtered = filterTimetable(settings, v);
				return [day, filtered];
			})
			// @ts-expect-error fuck ts
			.filter(([day, v]) => v.length > 0);

		return all;
	}
	$: filteredTimetable = filterWeekTimetable(data.timetableMerged) as [Date, TimetableDay][];
	// $: ttDate = new Date($page.params.date);
	// $: prevDay = ttDate ? getDateByDeltaDays(ttDate, -1) : new Date();
	// $: nextDay = ttDate ? getDateByDeltaDays(ttDate, 1) : new Date();
	// $: today = formatDateForApi(new Date());
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-6xl w-full">
		<div class="flex flex-col gap-2">
			{#each filteredTimetable as [day, slots]}
				<div class="py-2 flex-grow">
					<a id={formatDateForApi(day)} aria-hidden="true" />
					<b>{weekdayMap[day.getDay()]}</b>
					<div class="pt-2 flex flex-col gap-2">
						{#each slots as [hours, slot]}
							<Timeslot {hours} timeSlot={slot} />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</main>
</div>
