<script lang="ts">
	import TopBar from '@/lib/TopBar.svelte';
	import { getExamsClient, type Exam } from '@/lib/exams';
	import { getSettings } from '@/lib/settings';
	import { onMount } from 'svelte';

	let exams: Exam[] = [];

	onMount(async () => {
		const data: Exam[] = await getExamsClient();
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - 1);
		const settings = getSettings();
		exams = data
			.filter((v) => new Date(v.date).getTime() > cutoffDate.getTime())
			.filter((v) => settings?.courses.includes(v.subject));
	});

	function backgroundColor(exam: Exam) {
		const examDate = new Date(exam.date);
		const dangerDate = new Date();
		dangerDate.setDate(dangerDate.getDate() + 1);
		return examDate.getTime() < dangerDate.getTime() ? 'bg-red-800/40' : 'bg-dark';
	}
</script>

<TopBar title="Klausuren" />
<div class="pt-16 w-full flex justify-center p-4">
	<main class="max-w-4xl w-full flex flex-col gap-2">
		{#each exams as exam}
			<div
				class="{backgroundColor(
					exam
				)} flex-grow rounded-md border border-colborder shadow-sm shadow-black p-2 flex items-center"
			>
				<div class="text-3xl tracking-tight w-20 font-bold flex justify-center items-center pr-2">
					<p class="text-primary">{exam.startHour}-{exam.endHour}</p>
				</div>
				<div class="">
					<p>
						<b>{exam.topic}</b>
						{exam.subject}
					</p>
					{new Date(exam.date).toLocaleDateString()}
				</div>
			</div>
		{/each}

		<div class="flex-grow rounded-md border border-colborder shadow-sm shadow-black p-2">
			ACHTUNG: Hier werden nur Klausuren angezeigt, die von Schülern eingetragen worden sind! Du
			kannst weitere über Menü > Klausur eintragen hinzuügen.
		</div>
	</main>
</div>
