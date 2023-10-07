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
	import Icon from '@iconify/svelte';
	import LoadingScreen from '@/lib/LoadingScreen.svelte';
	import { runPWAChecks } from '@/lib/pwaLogic';

	let data: [Date, TimetableDay][] = [];
	let lastLoadTime = new Date().getTime();

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

	async function loadPast() {
		const firstDate = data[0][0];
		const target = getPreviousMonday(firstDate);
		await loadData(target);
	}

	async function loadFuture() {
		const firstDate = data[data.length - 1][0];
		const target = getNextMonday(firstDate);
		await loadData(target);
	}

	async function initialLoad() {
		const today = new Date();
		await loadData(today);
		if (today.getDay() > 4 || today.getDay() === 0) {
			await loadFuture();
		}
		setTimeout(() => {
			const elId = formatDateForApi(getNextMonday(new Date()));
			document.getElementById(elId)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
		}, 200);
	}

	onMount(() => {
		initialLoad();
		runPWAChecks();
		const handleScroll = () => {
			if (
				window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
				new Date().getTime() - lastLoadTime > 300
			) {
				console.log('loading');
				lastLoadTime = new Date().getTime();
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
		const all = timetable.map(([day, v]) => {
			const filtered = filterTimetable(settings, v);
			return [day, filtered];
		});
		// @ts-expect-error fuck ts
		// .filter(([day, v]) => v.length > 0);

		return all;
	}
	$: filteredTimetable = data ? (filterWeekTimetable(data) as [Date, TimetableDay][]) : [];
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<div class="w-full flex justify-center py-2 px-4 fixed top-0 left-0 backdrop-blur bg-black">
			<div class="w-full max-w-4xl flex gap-2 justify-between">
				<div>
					<h1 class="font-bold text-2xl">Stundenplan</h1>
					<h2 class="text-gray-300 text-xs">By Alwin Lohrie</h2>
				</div>
				<div class="flex gap-2">
					<button on:click={loadPast} class="rounded-md p-2 text-xs">
						<Icon icon="material-symbols:arrow-upward" class="h-8 w-8" />
					</button>
					<a href="/settings" class="rounded-md p-2 text-xs">
						<Icon icon="material-symbols:settings" class="h-8 w-8" />
					</a>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-2 pt-12">
			{#each filteredTimetable as [day, slots] (day)}
				<div class="py-2 flex-grow">
					<a id={formatDateForApi(day)} aria-hidden="true" />
					<b
						class="p-1 rounded-md"
						class:bg-primary={day.toLocaleDateString() === new Date().toLocaleDateString()}
					>
						{weekdayMap[day.getDay()]} - {day.toLocaleDateString()}
					</b>
					<div class="pt-2 flex flex-col gap-2">
						{#each slots as [hours, slot]}
							<Timeslot {hours} timeSlot={slot} />
						{/each}
					</div>
				</div>
			{/each}
			<p>Wird geladen...</p>
			<LoadingScreen />
		</div>
	</main>
</div>
