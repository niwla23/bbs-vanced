<script lang="ts">
	import type { PageServerData } from './$types';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import {
		filterTimetable,
		formatDateForApi,
		getDateByDeltaDays,
		weekdayMap
	} from '@/lib/timetableHelpers';
	import Timeslot from '@/lib/Timeslot.svelte';

	export let data: PageServerData;

	$: settings = data.settings;
	$: filteredTimetable = filterTimetable(settings, data.timetableMerged);
	$: ttDate = new Date($page.params.date);
	$: prevDay = ttDate ? getDateByDeltaDays(ttDate, -1) : new Date();
	$: nextDay = ttDate ? getDateByDeltaDays(ttDate, 1) : new Date();
	$: today = formatDateForApi(new Date());
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<header class="flex gap-2 justify-between items-center mb-4">
			<h1 class="text-white text-2xl">
				{weekdayMap[ttDate.getDay()]},
				{ttDate.toLocaleDateString()}
			</h1>
			<div class="flex gap-2">
				<a class="hover:bg-secondary rounded-md" href="/tt/{prevDay}">
					<Icon icon="material-symbols:chevron-left" width="40" />
				</a>
				<a class="hover:bg-secondary rounded-md" href="/tt/{today}">
					<Icon icon="material-symbols:today" width="40" />
				</a>
				<a class="hover:bg-secondary rounded-md" href="/tt/{nextDay}">
					<Icon icon="material-symbols:chevron-right" width="40" />
				</a>
			</div>
		</header>
		<div class="flex flex-col gap-2 text-white">
			{#each filteredTimetable as [hours, timeSlot]}
				<!---->
				<Timeslot {timeSlot} {hours} />
			{/each}
			<a class="text-muted font-light text-center underline pt-4" href="/settings">Einstellungen</a>
		</div>
	</main>
</div>
