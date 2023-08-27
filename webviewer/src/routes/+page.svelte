<script lang="ts">
	import {
		filterTimetable,
		formatDateForApi,
		getNextMonday,
		getPreviousMonday,
		weekdayMap
	} from '@/lib/timetableHelpers';
	import type { TimetableDay } from 'bbs-parser/src/types';
	import Timeslot from '@/lib/Timeslot.svelte';
	import { getSettings, type Settings } from '@/lib/settings';
	import { onMount } from 'svelte';

	let data: [Date, TimetableDay][] = [];

	async function loadData(date: Date) {
		const resp = await fetch(`/api/timetable?date=${formatDateForApi(date)}`);
		const text = await resp.text();
		const parsedData = JSON.parse(text);
		const timetableWithDates: [Date, TimetableDay][] = parsedData.timetableMerged.map(
			([day, data]) => [new Date(day), data]
		);
		let mergedData = [...data, ...timetableWithDates];
		data = mergedData
			.filter(
				([date, _v], i, self) => self.findIndex(([d, _v]) => d.getTime() === date.getTime()) === i
			)
			.sort((a, b) => a[0].getTime() - b[0].getTime());
	}

	function loadPast() {
		const firstDate = data[0][0];
		const target = getPreviousMonday(firstDate);
		loadData(target);
	}

	function loadFuture() {
		const firstDate = data[data.length - 1][0];
		const target = getNextMonday(firstDate);
		loadData(target);
	}

	onMount(() => {
		loadData(new Date());

		const handleScroll = () => {
			if (window.scrollY === window.scrollMaxY) {
				loadFuture();
			}
		};

		document.addEventListener('scroll', handleScroll);

		return () => {
			document.removeEventListener('scroll', handleScroll);
		};
	});

	let settings = getSettings() as Settings;

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
	$: filteredTimetable = data ? (filterWeekTimetable(data) as [Date, TimetableDay][]) : [];
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-6xl w-full">
		<div class="w-full flex gap-2 justify-center">
			<button on:click={loadPast} class="border border-primary rounded-md p-2 text-xs">
				Frühere Tage laden
			</button>
			<a href="/settings" class="border border-primary rounded-md p-2 text-xs"> Einstellungen </a>
		</div>
		<div class="flex flex-col gap-2">
			{#each filteredTimetable as [day, slots] (day)}
				<div class="py-2 flex-grow">
					<a id={formatDateForApi(day)} aria-hidden="true" />
					<b class:bg-primary={day.toLocaleDateString() === new Date().toLocaleDateString()}
						>{weekdayMap[day.getDay()]} - {day.toLocaleDateString()}</b
					>
					<div class="pt-2 flex flex-col gap-2">
						{#each slots as [hours, slot]}
							<Timeslot {hours} timeSlot={slot} />
						{/each}
					</div>
				</div>
			{/each}
			<p>Loading more...</p>
		</div>
	</main>
</div>