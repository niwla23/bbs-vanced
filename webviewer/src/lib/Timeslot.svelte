<script lang="ts">
	import type { TimetableLesson, TimetableTimeSlot } from 'bbs-parser/src/types';
	import { isExamInTimeslot, type Exam } from './exams';
	import Icon from '@iconify/svelte';
	import { hourTimes } from './textRessources';
	import {
		convertTimeToDate,
		getRelativeTime,
		isTimeslotActive,
		isTimeslotUpNext
	} from './timetableHelpers';
	import { hasPro } from '@/routes/stores';

	export let timeSlot: TimetableTimeSlot;
	export let date: Date;
	export let hours: number[];
	export let exams: Exam[];

	$: externalExam = (function () {
		for (const exam of exams) {
			if (isExamInTimeslot(timeSlot, date, hours, exam)) {
				return exam;
			}
		}
		return null;
	})();

	function isLessonFree(lesson: TimetableLesson) {
		if (!lesson.subject) return true;
		const regex = /^<del>.*<\/del>$/g;
		const isFree = regex.test(lesson.subject);
		return isFree;
	}

	const isFree = function () {
		if (timeSlot.length === 0) return true;
		for (const lesson of timeSlot) {
			const x = isLessonFree(lesson);
			return x;
		}
		if (timeSlot.find((l) => !isLessonFree(l))) return false;
		return true;
	};
	const isExam = function () {
		if (timeSlot.find((l) => l.exam)) return true;
		if (externalExam) return true;
		return false;
	};

	$: backgroundColor = (function () {
		exams; // this exists so svelte knows that there is a dependency on exams
		if (isFree()) return 'bg-darkest';
		// if (isExam()) return 'bg-red-800/40';
		if (externalExam && externalExam.type == 'klausur')
			return 'bg-red-800/40 component-timeslot-exam';
		if (externalExam && externalExam.type == 'termin')
			return 'bg-blue-800/40 component-timeslot-event';
		return 'bg-dark';
	})();

	$: startTime = hourTimes.start[hours[0]];
	$: endTime = hourTimes.end[hours[hours.length - 1]];
	$: startDate = convertTimeToDate(startTime, date);
	$: endDate = convertTimeToDate(endTime, date);
</script>

<div
	class="component-timeslot {backgroundColor} rounded-md border border-colborder shadow-sm shadow-black flex items-center p-2 relative"
>
	<div class="self-stretch w-20 flex flex-col justify-between items-center pr-2">
		<p class="text-muted text-xs">{$hasPro ? startTime : ''}</p>
		<p class="w-min text-primary text-3xl tracking-tight font-bold">{hours.join('/')}</p>
		<p class="text-muted text-xs">{$hasPro ? endTime : ''}</p>
	</div>
	<div>
		{#if timeSlot.length > 0}
			{#each timeSlot as lesson}
				<p class="">{@html lesson.subject}</p>
				<p class="text-muted">{@html lesson.teacher}</p>
				<p class="text-muted">{@html lesson.room}</p>
				{#if lesson.exam}<p class="text-red-500">
						{@html lesson.exam}
						<Icon icon="material-symbols:verified" class="h-6 w-6 inline" />
					</p>{/if}
				{#if externalExam}
					<p class={externalExam.type == 'klausur' ? 'text-red-500' : 'text-blue-500'}>
						{externalExam.topic}
						<Icon icon="material-symbols:supervised-user-circle" class="h-6 w-6 inline" />
					</p>
				{/if}
			{/each}
		{:else}
			<p class="text-muted">Frei :)</p>
		{/if}
	</div>
	{#if $hasPro && isTimeslotActive(startDate, endDate)}
		<div
			class="absolute bottom-0 right-0 p-1 px-4 rounded-tl-lg flex items-center gap-1 text-sm border-t border-l border-colborder"
		>
			<Icon icon="material-symbols:alarm" class="" />
			<p>Endet {getRelativeTime(endDate)}</p>
		</div>
	{/if}
	{#if $hasPro && isTimeslotUpNext(startDate, endDate, hours)}
		<div
			class="absolute top-0 right-0 p-1 px-4 rounded-bl-lg flex items-center gap-1 text-sm border-b border-l border-colborder"
		>
			<Icon icon="material-symbols:alarm" class="" />
			<p>{getRelativeTime(startDate)}</p>
		</div>
	{/if}
</div>
