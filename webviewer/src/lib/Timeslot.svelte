<script lang="ts">
	import type { TimetableLesson, TimetableTimeSlot } from 'bbs-parser/src/types';
	import { isExamInTimeslot, type Exam } from './exams';
	import Icon from '@iconify/svelte';

	export let timeSlot: TimetableTimeSlot;
	export let date: Date;
	export let hours: number[];
	export let exams: Exam[];

	// let externalExam: Exam | null;

	// function getExternalExam() {
	// 	for (const exam of exams) {
	// 		if (isExamInTimeslot(timeSlot, date, hours, exam)) {
	// 			// externalExam = exam;
	// 			return exam;
	// 		}
	// 	}
	// }
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
		if (isExam()) return 'bg-red-800/40';
		return 'bg-dark';
	})();
</script>

<div
	class=" {backgroundColor} rounded-md border border-colborder shadow-sm shadow-black flex items-center p-2"
>
	<div class="text-3xl tracking-tight w-20 font-bold flex justify-center items-center pr-2">
		<p class="w-min text-primary">{hours.join('/')}</p>
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
					<p class="text-red-500">
						{externalExam.topic}
						<Icon icon="material-symbols:supervised-user-circle" class="h-6 w-6 inline" />
					</p>
				{/if}
			{/each}
		{:else}
			<p class="text-muted">Frei :)</p>
		{/if}
	</div>
</div>
