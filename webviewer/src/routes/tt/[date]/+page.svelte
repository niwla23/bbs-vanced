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

	// export let data: PageServerData;
	//
	// $: settings = data.settings;
	// $: filteredTimetable = filterTimetable(settings, data.timetableMerged);
	// $: ttDate = new Date($page.params.date);
	// $: prevDay = ttDate ? getDateByDeltaDays(ttDate, -1) : new Date();
	// $: nextDay = ttDate ? getDateByDeltaDays(ttDate, 1) : new Date();
	// $: today = formatDateForApi(new Date());
</script>

<div class="w-full">
	<a href="/settings">Settings</a>
</div>
