<script lang="ts">
	import ProBadge from '@/lib/ProBadge.svelte';
	import UiButton from '@/lib/UiButton.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { hasPro } from './stores';
	import { getSettings, saveSettings, type Settings } from '@/lib/settings';

	let settings: Settings | null = null;

	let userEmail = '';
	let className = '';

	let currentMode = 'own';
	const modes = { own: 'Eigener', className: 'Klasse', email: 'Person' };

	const dispatch = createEventDispatcher();

	function onSubmit(e: Event) {
		e.preventDefault();
		if (userEmail) {
			if (!settings?.recentTimetableLookupEmails?.includes(userEmail)) {
				settings?.recentTimetableLookupEmails?.push(userEmail);
			}
		} else if (className) {
			if (!settings?.recentTimetableLookupClasses?.includes(className)) {
				settings?.recentTimetableLookupClasses?.push(className);
			}
		}

		saveSettings(settings);
		dispatch('submit', { userEmail, className });
	}

	onMount(async () => {
		settings = await getSettings();
		if (!settings) return;

		if (!settings.recentTimetableLookupEmails) {
			settings.recentTimetableLookupEmails = [];
		}
		if (!settings.recentTimetableLookupClasses) {
			settings.recentTimetableLookupClasses = [];
		}
		await saveSettings(settings);
	});
</script>

<div
	class="fixed inset-0 w-full h-full flex justify-center items-center p-2 bg-dark/80 backdrop-blur-sm z-30"
>
	<div class="bg-darkest w-full max-w-md p-4 rounded-md">
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
			<div class="flex flex-col gap-2 pb-2 max-h-96 overflow-y-scroll">
				{#each (settings?.recentTimetableLookupClasses || []).reverse() as className}
					<UiButton appearance="normal" on:click={() => (className = className)}>
						{className}
					</UiButton>
				{/each}
			</div>
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
			<div class="flex flex-col gap-2 pb-2 max-h-96 overflow-y-scroll">
				{#each (settings.recentTimetableLookupEmails || []).reverse() as email}
					<UiButton appearance="normal" on:click={() => (userEmail = email)}>{email}</UiButton>
				{/each}
			</div>
		{/if}

		<button class="w-full p-2 bg-primary text-on-primary rounded-md" on:click={onSubmit}>OK</button>
	</div>
</div>
