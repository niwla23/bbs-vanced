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
	import { getExamsClient, type Exam } from '@/lib/exams';
	import { goto } from '$app/navigation';
	import { areNewNewsAvailable } from '@/lib/news';
	import TopBar from '@/lib/TopBar.svelte';
	import { hasPro } from '@/routes/stores';
	import { fade, scale, slide, fly } from 'svelte/transition';

	let data: [Date, TimetableDay][] = [];
	let exams: Exam[] = [];
	let lastLoadTime = new Date().getTime();
	let settings: Settings;

	const animate = (n) => scale(n, {});

	async function loadData(date: Date, useCache = true) {
		const resp = await fetch(
			`/api/timetable?date=${formatDateForApi(date)}${useCache ? '' : '&nocache'}&className=${
				settings.className
			}`
		);
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

		exams = await getExamsClient(settings.className);
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

	async function initialLoad(useCache: boolean) {
		settings = await getSettings();
		data = [];
		const today = new Date();
		let targetDate = today;
		await loadData(today, useCache);
		if (today.getDay() > 5 || today.getDay() === 0) {
			await loadFuture();
			targetDate = getNextMonday(today);
		}
	}

	onMount(() => {
		initialLoad(true);
	});

	function filterWeekTimetable(timetable: [Date, TimetableDay][]) {
		const all = timetable.map(([day, v]) => {
			const filtered = filterTimetable(settings, v);
			return [day, filtered];
		});

		return all;
	}
	$: filteredTimetable = data ? (filterWeekTimetable(data) as [Date, TimetableDay][]) : [];
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<TopBar title="Wochenansicht">
			<button on:click={() => initialLoad(false)} class="rounded-md px-2 text-xs">
				<Icon icon="material-symbols:refresh" class="h-6 w-6" />
			</button>
			<button on:click={loadPast} class="rounded-md px-2 text-xs">
				<Icon icon="material-symbols:arrow-upward" class="h-6 w-6" />
			</button>
		</TopBar>

		<div class="flex gap-2 pt-12">
			{#if exams}
				{#each filteredTimetable as [day, slots] (day)}
					<div class="py-2 flex-grow" transition:animate>
						<b
							class="p-1 rounded-md"
							class:bg-primary={day.toLocaleDateString() === new Date().toLocaleDateString()}
							class:text-on-primary={day.toLocaleDateString() === new Date().toLocaleDateString()}
						>
							{weekdayMap[day.getDay()]}
							<br />
							{day.toLocaleDateString()}
						</b>

						<div class="component-timetable-day pt-2 flex flex-col gap-2">
							{#each slots as [hours, slot]}
								<Timeslot {hours} {exams} date={day} timeSlot={slot} weekView={true} />
							{/each}
						</div>
					</div>
				{/each}
			{/if}
			<p>Wird geladen...</p>
			<LoadingScreen />
		</div>
	</main>
	{#if !$hasPro}
		<div class="fixed bottom-0 left-0 right-0 p-4 w-full flex">
			<a href="/getPro" class="w-full bg-primary p-4 rounded-md text-center font-bold text-3xl">
				Hol dir PRO!
			</a>
		</div>
	{/if}
	<!-- <Menu /> -->
</div>
