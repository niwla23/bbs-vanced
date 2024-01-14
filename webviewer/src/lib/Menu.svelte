<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { shareApp } from './shareApp';

	const menuEntries = [
		{
			icon: 'material-symbols:home',
			label: 'Stundenplan',
			onclick: (e) => goto('/')
		},
		{
			icon: 'material-symbols:eyeglasses',
			label: 'Klausurenübersicht (PRO)',
			onclick: (e) => goto('/exams')
		},
		{
			icon: 'material-symbols:calendar-add-on',
			label: 'Klausur eintragen',
			onclick: (e) => goto('/addExam')
		},
		{
			icon: 'material-symbols:question-exchange',
			label: 'Notenumrechner',
			onclick: (e) => goto('/grades/converter')
		},
		{
			icon: 'mdi:calculator',
			label: 'Abirechner',
			onclick: (e) => goto('/grades')
		},
		{
			icon: 'material-symbols:newspaper',
			label: 'News',
			onclick: (e) => goto('/news')
		},
		{
			icon: 'material-symbols:settings',
			label: 'Einstellungen',
			onclick: (e) => goto('/settings')
		},
		{
			icon: 'material-symbols:share',
			label: 'App teilen',
			onclick: (e) => shareApp('menu_share')
		}
	];

	export let onClose: () => any;
</script>

<div
	class="fixed inset-0 p-8 h-screen w-screen flex justify-center items-center bg-darkest/90"
	on:click={() => onClose()}
	on:keypress={(e) => e.key == 'Escape' && onClose()}
	role="button"
	tabindex="-100"
>
	<div
		class="max-w-2xl w-full bg-dark text-brightest rounded-md border border-colborder shadow-sm shadow-black p-4 flex flex-col gap-4 text-lg h-min"
	>
		{#each menuEntries as entry}
			<button class="flex gap-2" on:click={entry.onclick}>
				<Icon icon={entry.icon} class="h-6 w-6" />
				<p>{entry.label}</p>
			</button>
		{/each}
	</div>
</div>
