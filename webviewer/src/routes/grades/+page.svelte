<script lang="ts">
	import TopBar from '@/lib/TopBar.svelte';
	import EditGrade from './EditGrade.svelte';
	import EditSubjectNames from './EditSubjectNames.svelte';
	import GradeInfo from './GradeInfo.svelte';
	import {
		countRelevantGrades,
		checkSubjectsForNeededRelevantGrades,
		totalPointsBlockI,
		totalPointsBlockII,
		totalPointsToGrade,
		gradeUserDataTemplate,
		saveDataOnline,
		subscribeOnlineData,
		type SubjectUserData,
		subjectNameOptions
	} from '@/lib/grades';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { hasPro } from '../stores';

	let loadingComplete = false;
	let subjectNames = [
		'IT',
		'Mathe',
		'Englisch',
		'BUV',
		'IV',
		'Deutsch',
		'Chemie',
		'Geschichte',
		'Religion',
		'Praxis',
		'SP/PRA/Span'
	];

	let gradeUserData = gradeUserDataTemplate;

	let currentlyEditing: [number, number] = [0, 0];
	let editDialogOpen = false;
	let infoDialogOpen = true;
	let editSubjectNamesOpen = false;

	function addSignToNumber(n: number) {
		return (n < 0 ? '' : '+') + n;
	}

	function getCurrentlyEditingData(x: [number, number]) {
		return gradeUserData[x[0]].grades[x[1]];
	}

	function openEditDialog(subjectIndex: number, index: number) {
		currentlyEditing = [subjectIndex, index];
		editDialogOpen = true;
	}

	function handleEditSubmit(event) {
		editDialogOpen = false;
		let gradeToEdit = gradeUserData[currentlyEditing[0]].grades[currentlyEditing[1]];
		gradeToEdit.grade = event.detail.points;
		gradeToEdit.isGuess = event.detail.isGuess;
		gradeToEdit.relevant = event.detail.isRelevant;
		gradeUserData = gradeUserData;
	}

	$: pointsBlockI = totalPointsBlockI(gradeUserData);
	$: pointsBlockII = totalPointsBlockII(gradeUserData);
	$: numRelevantGrades = countRelevantGrades(gradeUserData);
	$: areRelevantGradesOk = checkSubjectsForNeededRelevantGrades(gradeUserData);

	function saveIfPro() {
		if (hasPro && loadingComplete) saveDataOnline(gradeUserData);
	}
	$: gradeUserData, saveIfPro();
	onMount(async () => {
		if ($hasPro) {
			let temp = await subscribeOnlineData((data) => {
				if (JSON.stringify(data.record.gradesData.userData) != JSON.stringify(gradeUserData)) {
					gradeUserData = data.record.gradesData.userData;
					localStorage.setItem('gradesLastUpdate', new Date().getTime().toString());
				}
			});
			gradeUserData = temp;
			loadingComplete = true;
		}
	});
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<TopBar title="Abinotenrechner" />
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
						{#each gradeUserData as subject, subjectIndex}
							<tr>
								<td
									class="w-0 whitespace-nowrap pr-2 md:pr-12 lg:pr-32 cursor-pointer"
									on:click={() => (editSubjectNamesOpen = true)}
								>
									{#if subjectIndex < 5}
										<span class="font-bold">
											P{subjectIndex + 1}:
											{subjectNameOptions[subjectIndex][subject.nameOption]}
										</span>
									{:else}
										{subjectNameOptions[subjectIndex][subject.nameOption]}
									{/if}
									{#if areRelevantGradesOk[subjectIndex] == 0}
										<Icon icon="mdi:check" class="inline text-green-400" />
									{:else}
										<span class="text-red-400 font-bold">
											{addSignToNumber(areRelevantGradesOk[subjectIndex])}
										</span>
									{/if}
								</td>
								{#each [0, 1, 2, 3] as i}
									<td class=" text-center">
										<button
											class="w-full h-full p-2 bg-dark rounded-md"
											class:font-bold={!gradeUserData[subjectIndex].grades[i].isGuess}
											class:text-primary={!gradeUserData[subjectIndex].grades[i].isGuess}
											class:bg-darkest={!gradeUserData[subjectIndex].grades[i].relevant}
											class:text-muted={!gradeUserData[subjectIndex].grades[i].relevant}
											on:click={() => openEditDialog(subjectIndex, i)}
										>
											{gradeUserData[subjectIndex].grades[i].grade}
										</button>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
				<p class="text-muted">
					<span class="inline-block transform rotate-180">↴</span>
					Tippe auf die Fachnamen, um sie zu ändern
				</p>

				<h2 class="text-lg font-bold pt-4">Abiprüfungen</h2>
				<div class="w-full grid grid-rows-3 grid-flow-col gap-2 gap-x-4">
					{#each [0, 1, 2, 3, 4] as subjectIndex}
						<div class="flex-1 flex items-center">
							<p class="flex-[2]">
								P{subjectIndex + 1}:
								{subjectNameOptions[subjectIndex][gradeUserData[subjectIndex].nameOption]}
							</p>
							<button
								class="w-full h-full flex-1 p-2 bg-dark rounded-md"
								class:font-bold={!gradeUserData[subjectIndex].grades[4].isGuess}
								class:text-primary={!gradeUserData[subjectIndex].grades[4].isGuess}
								on:click={() => openEditDialog(subjectIndex, 4)}
							>
								{gradeUserData[subjectIndex].grades[4].grade}
							</button>
						</div>
					{/each}
				</div>

				<h2 class="text-lg font-bold pt-4">Berechnung</h2>
				<table class="w-full">
					<tbody>
						<tr>
							<td>Eingebrachte Semesternoten</td>
							<td class={`text-right ${numRelevantGrades == 36 ? 'text-primary' : 'text-red-500'}`}>
								{numRelevantGrades}
							</td>
						</tr>
						<tr>
							<td>Punkte Block I</td>
							<td class="text-right">{pointsBlockI.toFixed(0)}</td>
						</tr>
						<tr>
							<td>Punkte Block II</td>
							<td class="text-right">{pointsBlockII.toFixed(0)}</td>
						</tr>
						<tr>
							<td>Punkte Gesamt</td>
							<td class="text-right">{(pointsBlockI + pointsBlockII).toFixed(0)}</td>
						</tr>
						<tr>
							<td>Note</td>
							<td class="text-right font-bold text-xl text-primary">
								{totalPointsToGrade(pointsBlockI + pointsBlockII).toFixed(2)}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</main>
</div>

<!-- this is probably the worst way to do this but it kinda works well -->
{#if editDialogOpen}
	<EditGrade
		on:submit={handleEditSubmit}
		subject={subjectNames[currentlyEditing[0]]}
		index={currentlyEditing[1]}
		points={getCurrentlyEditingData(currentlyEditing).grade}
		isGuess={getCurrentlyEditingData(currentlyEditing).isGuess}
		isRelevant={getCurrentlyEditingData(currentlyEditing).relevant}
	/>
{/if}

{#if infoDialogOpen}
	<GradeInfo on:close={() => (infoDialogOpen = false)} />
{/if}

{#if editSubjectNamesOpen}
	<EditSubjectNames
		{subjectNameOptions}
		{gradeUserData}
		on:close={() => (editSubjectNamesOpen = false)}
		on:submit={(event) => {
			gradeUserData = event.detail.gradeUserData;
			editSubjectNamesOpen = false;
		}}
	/>
{/if}
