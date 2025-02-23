<script lang="ts">
	import {
		filterTimetable,
		filterWeekTimetable,
		formatDateForApi,
		getNextMonday,
		getPreviousMonday,
		weekdayMap,
		getTimetableWithDatesClient
	} from '@/lib/timetableHelpers';
	import type { TimetableDay, TimetableTimeSlot } from 'bbs-parser/src/types';
	import Timeslot from '@/lib/Timeslot.svelte';
	import { getSettings, type Settings } from '@/lib/settings';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import LoadingScreen from '@/lib/LoadingScreen.svelte';
	import { getExamsClient, type Exam } from '@/lib/exams';
	import TopBar from '@/lib/TopBar.svelte';
	import { hasPro } from './stores';
	import { fade, scale, slide, fly } from 'svelte/transition';
	import UiButton from '@/lib/UiButton.svelte';
	import Swal from 'sweetalert2';
	import { env } from '$env/dynamic/public';
	import TempCourseSelect from './TempCourseSelect.svelte';

	let data: [Date, TimetableDay][] = [];
	let exams: Exam[] = [];
	let lastLoadTime = new Date().getTime();
	let settings: Settings;
	let showSelectPopup = false;
	let timetableName = 'Start';

	const animate = (n) => scale(n, {});

	async function loadData(date: Date, useCache = true, showAll = false) {
		//here
		const timetableWithDates = await getTimetableWithDatesClient(date, useCache, settings);
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
		console.log(data);
		const firstDate = data[data.length - 1][0];
		console.log('firstdate', firstDate);
		const target = getNextMonday(firstDate);
		await loadData(target);
	}

	async function loadNormal(useCache: boolean, settingsOverride: Partial<Settings> = {}) {
		settings = await getSettings();
		settings = { ...settings, ...settingsOverride };
		data = [];
		const today = new Date();
		let targetDate = today;
		await loadData(today, useCache);
		if (today.getDay() > 5 || today.getDay() === 0) {
			await loadFuture();
			targetDate = getNextMonday(today);
		}
		setTimeout(() => {
			const elId =
				window.location.hash == ''
					? formatDateForApi(targetDate)
					: window.location.hash.replace('#', '');
			document.getElementById(elId)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
		}, 400);

		if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
			loadFuture();
		}
	}

	async function tempCourseLoad(event: CustomEvent) {
		showSelectPopup = false;
		console.log(event.detail.userEmail, event.detail.className);
		if (event.detail.className) {
			timetableName = event.detail.className;
			loadNormal(true, { className: event.detail.className, courses: [] });
		} else if (event.detail.userEmail) {
			timetableName = event.detail.userEmail.split('@')[0];
			const response = await fetch(`/api/publicUserInfo?userEmail=${event.detail.userEmail}`);
			const data = await response.json();
			loadNormal(true, { className: data.className, courses: data.courses });
		} else {
			timetableName = 'Deins';
			loadNormal(true);
		}
	}

	function akuteUnlust(slot: TimetableTimeSlot) {
		for (const lesson of slot) {
			lesson.subject = `<del>${lesson.subject}</del>`;
			lesson.room = `<del>${lesson.room}</del>`;
			lesson.teacher = `<del>${lesson.teacher}</del> (unterrichtsfrei)`;
		}

		return slot;
	}

	onMount(() => {
		loadNormal(true);
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

		console.log(data, exams);
		return () => {
			document.removeEventListener('scroll', handleScroll);
		};
	});
	$: filteredTimetable = data
		? (filterWeekTimetable(settings, data) as [Date, TimetableDay][])
		: [];
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<TopBar title={timetableName.slice(0, 10)}>
			<UiButton on:click={() => (showSelectPopup = true)} class="px-2 text-xs">
				<Icon icon="mingcute:eye-line" class="h-6 w-6" />
			</UiButton>
			<UiButton on:click={() => loadNormal(false)} class="px-2 text-xs">
				<Icon icon="mingcute:refresh-2-line" class="h-6 w-6" />
			</UiButton>
			<UiButton on:click={loadPast} class="px-2 text-xs">
				<Icon icon="mingcute:square-arrow-up-line" class="h-6 w-6" />
			</UiButton>
		</TopBar>

		<div class="flex flex-col gap-2 pt-12">
			{#if exams}
				{#each filteredTimetable as [day, slots] (day)}
					<div class="py-2 flex-grow" transition:animate>
						<a id={formatDateForApi(day)} aria-hidden="true" class="block relative -top-16" />
						<b
							class="p-1 rounded-md"
							class:bg-primary={day.toLocaleDateString() === new Date().toLocaleDateString()}
							class:text-on-primary={day.toLocaleDateString() === new Date().toLocaleDateString()}
						>
							{weekdayMap[day.getDay()]} - {day.toLocaleDateString()}
						</b>
						<div class="component-timetable-day pt-2 flex flex-col gap-2">
							{#each slots as [hours, slot]}
								<Timeslot
									{hours}
									{exams}
									date={day}
									timeSlot={slot}
									on:press={async (e) => {
										e.preventDefault();
										const res = await Swal.fire({
											title: 'Akute Unlust?',
											text: 'Willst du das da steht das ausfällt?',
											confirmButtonText: 'Weg damit',
											cancelButtonText: 'hä nein warum',
											showCancelButton: true,
											backdrop: false,
											customClass: 'bg-dark text-brightest'
										});
										if (res.isConfirmed) {
											slot = akuteUnlust(slot);
										}
									}}
								/>
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
				Hol dir PRO! <br />
				jetzt nur {env.PUBLIC_PRO_PRICE}€
			</a>
		</div>
	{/if}
	<!-- <Menu /> -->
</div>

{#if showSelectPopup}
	<TempCourseSelect on:submit={tempCourseLoad} />
{/if}
