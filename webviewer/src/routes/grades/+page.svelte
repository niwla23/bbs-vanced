<script lang="ts">
	import TopBar from '@/lib/TopBar.svelte';
	import EditGrade from './EditGrade.svelte';

	let grades = [
		[14, 13, 14, 12, 10],
		[14, 13, 14, 12, 9],
		[14, 13, 14, 12, 9],
		[14, 13, 14, 12, 9],
		[14, 13, 14, 12, 9],
		[14, 13, 14, 12, 9],
		[14, 13, 14, 12, 9],
		[14, 13, 14, 12, 9],
		[14, 13, 14, 12, 9],
		[14, 13, 14, 12, 9]
	];

	let subjectNames = [
		'IT',
		'Mathe',
		'Englisch',
		'BUV',
		'IV',
		'Deutsch',
		'Sport',
		'Chemie',
		'Geschichte',
		'Praxis'
	];

	let isGradeGuess = [
		[false, true, true, true, true],
		[false, true, true, true, true],
		[false, true, true, true, true],
		[false, true, true, true, true],
		[false, true, true, true, true],
		[false, true, true, true, true],
		[false, true, true, true, true],
		[false, true, true, true, true],
		[false, true, true, true, true],
		[false, true, true, true, true]
	];

	let isGradeRelevant = [
		[true, true, true, true, true],
		[true, true, true, true, true],
		[true, true, true, true, true],
		[true, true, true, true, true],
		[true, true, true, true, true],
		[true, true, true, true, true],
		[true, true, true, true, true],
		[true, true, true, true, true],
		[true, true, false, true, true],
		[true, true, false, false, true]
	];

	let currentlyEditing: [number, number] = [0, 0];
	let editDialogOpen = false;

	function openEditDialog(subjectIndex: number, index: number) {
		currentlyEditing = [subjectIndex, index];
		editDialogOpen = true;
	}

	function handleEditSubmit(event) {
		editDialogOpen = false;
		grades[currentlyEditing[0]][currentlyEditing[1]] = event.detail.points;
		isGradeGuess[currentlyEditing[0]][currentlyEditing[1]] = event.detail.isGuess;
		grades = grades;
	}
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
						{#each subjectNames as subject, subjectIndex}
							<tr>
								<td>{subject}</td>
								{#each [0, 1, 2, 3] as i}
									<td class=" text-center">
										<button
											class="w-full h-full p-2 bg-dark rounded-md"
											class:font-bold={!isGradeGuess[subjectIndex][i]}
											class:text-primary={!isGradeGuess[subjectIndex][i]}
											class:bg-darkest={!isGradeRelevant[subjectIndex][i]}
											class:text-muted={!isGradeRelevant[subjectIndex][i]}
											on:click={() => openEditDialog(subjectIndex, i)}
											>{grades[subjectIndex][i]}</button
										>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>

				<h2 class="text-lg font-bold pt-4">Abiprüfungen</h2>
				<div class="w-full grid grid-rows-3 grid-flow-col gap-2 gap-x-4">
					{#each [0, 1, 2, 3, 5] as subjectIndex}
						<div class="flex-1 flex items-center">
							<p class="flex-[2]">{subjectNames[subjectIndex]}</p>
							<button
								class="w-full h-full flex-1 p-2 bg-dark rounded-md"
								class:font-bold={!isGradeGuess[subjectIndex][4]}
								class:text-primary={!isGradeGuess[subjectIndex][4]}
								on:click={() => openEditDialog(subjectIndex, 4)}>{grades[subjectIndex][4]}</button
							>
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
{#if editDialogOpen}
	<EditGrade
		on:submit={handleEditSubmit}
		subject={subjectNames[currentlyEditing[0]]}
		index={currentlyEditing[1]}
		points={grades[currentlyEditing[0]][currentlyEditing[1]]}
		isGuess={isGradeGuess[currentlyEditing[0]][currentlyEditing[1]]}
	/>
{/if}
