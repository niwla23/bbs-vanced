<script lang="ts">
	import type { PageServerData } from './$types';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import type { TimetableTimeSlot, TimetableDay } from 'bbs-parser/src/types';

	const weekdayMap = [
		'Sonntag',
		'Montag',
		'Dienstag',
		'Mittwoch',
		'Donnerstag',
		'Freitag',
		'Samstag'
	];

	export let data: PageServerData;
	/* let courseWhitelist = [
		'CH-12-1A',
		'IV-12-1A',
		'IV-12-1B',
		'DE-12-1D',
		'GE-12-1A',
		'MA-12-1A',
		'EN-12-1B',
		'BUV-12-1A'
	]; */

	$: settings = data.settings;

	function getLastIndex(timetable: TimetableDay) {
		let lastIndex = timetable.length;
		while (lastIndex--) {
			let [hours, currentTimeslot] = timetable[lastIndex];
			if (currentTimeslot && currentTimeslot.length != 0) {
				return lastIndex;
			}
		}
	}

	function filterTimetable(timetable: TimetableDay): TimetableDay {
		let showAllCourses = !settings?.courses || settings.courses.length == 0;
		let filtered: TimetableDay = [];
		for (const [hours, slot] of timetable) {
			const filteredSlot = slot.filter(
				(lesson) => lesson.subject && (settings?.courses.includes(lesson.subject) || showAllCourses)
			);
			filtered.push([hours, filteredSlot]);
		}

		let lastIndex = getLastIndex(filtered);
		return filtered.splice(1).splice(0, lastIndex); // we don't want hour 0
	}

	$: filteredTimetable = filterTimetable(data.timetableMerged);

	function formatDateForApi(date: Date) {
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
	}

	function getDateByDeltaDays(delta: number) {
		let newDate = new Date(ttDate.getTime());
		newDate.setDate(ttDate.getDate() + delta);
		return formatDateForApi(newDate);
	}

	$: ttDate = new Date($page.params.date);
	$: prevDay = ttDate ? getDateByDeltaDays(-1) : new Date();
	$: nextDay = ttDate ? getDateByDeltaDays(1) : new Date();
	$: today = formatDateForApi(new Date());
	// parseTimetable();
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
			{/each}
			<a class="text-muted font-light text-center underline pt-4" href="/settings">Einstellungen</a>
		</div>
	</main>
</div>
