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
	import { availableEmojis } from '@/lib/textRessources';
	import { getExamsClient, type Exam } from '@/lib/exams';
	import { goto } from '$app/navigation';
	import { areNewNewsAvailable } from '@/lib/news';

	let data: [Date, TimetableDay][] = [];
	let exams: Exam[] = [];
	let lastLoadTime = new Date().getTime();

	const choosenEmoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];

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

		exams = await getExamsClient();
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
		let targetDate = today;
		await loadData(today);
		if (today.getDay() > 5 || today.getDay() === 0) {
			await loadFuture();
			targetDate = getNextMonday(today);
		}
		setTimeout(() => {
			const elId = formatDateForApi(targetDate);
			document.getElementById(elId)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
		}, 200);

		// check for news
		if (await areNewNewsAvailable()) {
			goto('/news');
		}
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

		return all;
	}
	$: filteredTimetable = data ? (filterWeekTimetable(data) as [Date, TimetableDay][]) : [];
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<div class="w-full flex justify-center py-2 px-4 fixed top-0 left-0 backdrop-blur bg-darkest">
			<div class="w-full max-w-4xl flex gap-2 justify-between">
				<div class="flex items-center">
					<p class="text-2xl pr-4">{choosenEmoji}</p>
					<div>
						<h1 class="font-bold text-2xl">Stundenplan</h1>
						<h2 class="text-gray-300 text-xs">By Alwin Lohrie</h2>
					</div>
				</div>
				<div class="flex gap-1">
					<a href="/addExam" class="flex flex-col justify-center rounded-md px-2 text-xs">
						<Icon icon="material-symbols:calendar-add-on-rounded" class="h-6 w-6" />
					</a>
					<button on:click={loadPast} class="rounded-md px-2 text-xs">
						<Icon icon="material-symbols:arrow-upward" class="h-6 w-6" />
					</button>
					<a href="/settings" class="flex flex-col justify-center rounded-md px-2 text-xs">
						<Icon icon="material-symbols:settings" class="h-6 w-6" />
					</a>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-2 pt-12">
			{#if exams}
				{#each filteredTimetable as [day, slots] (day)}
					<div class="py-2 flex-grow">
						<a id={formatDateForApi(day)} aria-hidden="true" class="block relative -top-16" />
						<b
							class="p-1 rounded-md"
							class:bg-primary={day.toLocaleDateString() === new Date().toLocaleDateString()}
						>
							{weekdayMap[day.getDay()]} - {day.toLocaleDateString()}
						</b>
						<div class="pt-2 flex flex-col gap-2">
							{#each slots as [hours, slot]}
								<Timeslot {hours} {exams} date={day} timeSlot={slot} />
							{/each}
						</div>
					</div>
				{/each}
			{/if}
			<p>Wird geladen...</p>
			<LoadingScreen />
		</div>
	</main>
</div>
