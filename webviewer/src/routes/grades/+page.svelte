<script lang="ts">
	import TopBar from '@/lib/TopBar.svelte';
	import { formatDate } from '@/lib/exams';
	import type { NewsArticle } from '@/lib/news';
	import Icon from '@iconify/svelte';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	import EditGrade from './EditGrade.svelte';

	let grades = {
		IT: [14, 13, 14, 12, 10],
		MATHE: [14, 13, 14, 12, 9],
		ENGLISCH: [14, 13, 14, 12, 9],
		BUV: [14, 13, 14, 12, 9],
		IV: [14, 13, 14, 12, 9],
		Deutsch: [14, 13, 14, 12, 9],
		Sport: [14, 13, 14, 12, 9],
		Chemie: [14, 13, 14, 12, 9],
		Geschichte: [14, 13, 14, 12, 9]
	};
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<TopBar title="Noten" />
		<div class="flex flex-col gap-2 pt-12">
			<div>
				<h2 class="text-lg font-bold">Semesternoten</h2>
				<table class="w-full border-separate border-spacing-1">
					<tbody>
						<tr>
							<td>Fach</td>
							<td class="text-center">12.1</td>
							<td class="text-center">12.2</td>
							<td class="text-center">13.1</td>
							<td class="text-center">13.2</td>
						</tr>
						{#each Object.entries(grades) as [subject, gradeList]}
							<tr>
								<td>{subject}</td>
								{#each [0, 1, 2, 3] as i}
									<td class=" text-center">
										<button class="w-full h-full p-2 bg-dark rounded-md">{gradeList[i]}</button>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>

				<h2 class="text-lg font-bold pt-4">Abiprüfungen</h2>
				<div class="w-full grid grid-rows-3 grid-flow-col gap-2 gap-x-4">
					{#each ['IT', 'MATHE', 'ENGLISCH', 'BUV', 'IV'] as i}
						<div class="flex-1 flex items-center">
							<p class="flex-[2]">{i}</p>
							<button class="w-full h-full flex-1 p-2 bg-dark rounded-md">{grades[i][4]}</button>
						</div>
					{/each}
				</div>

				<h2 class="text-lg font-bold pt-4">Berechnung</h2>
				<table class="w-full">
					<tbody>
						<tr>
							<td>Punkte Block I</td>
							<td class="text-right">400</td>
						</tr>
						<tr>
							<td>Punkte Block II</td>
							<td class="text-right">400</td>
						</tr>
						<tr>
							<td>Punkte Gesamt</td>
							<td class="text-right">520</td>
						</tr>
						<tr>
							<td>Note</td>
							<td class="text-right font-bold text-xl text-primary">1,80</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</main>
</div>
<EditGrade />
