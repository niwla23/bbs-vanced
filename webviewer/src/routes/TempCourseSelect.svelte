<script lang="ts">
	import ProBadge from '@/lib/ProBadge.svelte';
	import UiButton from '@/lib/UiButton.svelte';
	import { createEventDispatcher } from 'svelte';
	import { hasPro } from './stores';

	let userEmail = '';
	let className = '';

	let currentMode = 'own';
	const modes = { own: 'Eigener', className: 'Klasse', email: 'Person' };

	const dispatch = createEventDispatcher();

	function onSubmit(e: Event) {
		e.preventDefault();
		dispatch('submit', { userEmail, className });
	}
</script>

<div
	class="fixed inset-0 w-full h-full flex justify-center items-center p-2 bg-dark/80 backdrop-blur-sm z-30"
>
	<form class="bg-darkest w-full max-w-md p-4 rounded-md" on:submit={onSubmit}>
		<h2 class="font-bold pb-2">Anderen Stundenplan sehen</h2>
		<div class="flex gap-2 pb-2">
			{#each Object.entries(modes) as [mode, modeName]}
				<UiButton
					appearance={currentMode == mode ? 'primary' : 'normal'}
					on:click={(e) => {
						e.preventDefault();
						currentMode = mode;
						userEmail = '';
						className = '';
					}}
				>
					{modeName}
				</UiButton>
			{/each}
		</div>

		{#if currentMode == 'className'}
			<label class="flex justify-between items-center gap-2 pb-2">
				<span>Klasse</span>
				<input bind:value={className} class="bg-dark text-brightest p-1 rounded-md" />
			</label>
		{:else if currentMode == 'email'}
			<p class="text-muted">
				Diese Funktion funktioniert nur zwischen zwei <ProBadge /> Usern.
			</p>
			<label class="flex justify-between items-center gap-2 pb-2">
				<span>Email-Adresse</span>
				<input
					bind:value={userEmail}
					disabled={!hasPro}
					type="email"
					class="bg-dark text-brightest p-1 rounded-md"
				/>
			</label>
		{/if}

		<button class="w-full p-2 bg-primary text-on-primary rounded-md">OK</button>
	</form>
</div>
