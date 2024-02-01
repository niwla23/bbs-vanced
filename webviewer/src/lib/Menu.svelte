<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { shareApp } from './shareApp';

	import { fade, scale, fly, slide } from 'svelte/transition';
	import UiButton from './UiButton.svelte';

	const animate = (n) => fly(n, { x: -300 });

	const menuEntries = [
		{
			icon: 'material-symbols:home',
			label: 'Stundenplan',
			onclick: (e) => goto('/')
		},
		{
			icon: 'material-symbols:eyeglasses',
			label: 'Klausurenübersicht',
			isPro: true,
			onclick: (e) => goto('/exams')
		},
		// {
		// 	icon: 'material-symbols:eyeglasses',
		// 	label: 'Andere Stundenpläne',
		// 	isPro: true,
		// 	onclick: (e) => goto('/exams')
		// },
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
			isPro: true,
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
			icon: 'mdi:legal',
			label: 'Rechtliches',
			onclick: (e) => goto('/legal')
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
	transition:animate
>
	<div
		class="max-w-2xl w-full bg-dark text-brightest rounded-md border border-colborder shadow-sm shadow-black p-4 flex flex-col gap-4 text-lg h-min"
	>
		{#each menuEntries as entry}
			<UiButton class="flex gap-2" on:click={entry.onclick}>
				<Icon icon={entry.icon} class="h-6 w-6" />
				<p class="flex items-center gap-2">
					<span>{entry.label}</span>
					{#if entry.isPro}
						<span class="bg-primary/30 p-1 rounded-lg text-xs text-on-primary">PRO</span>
					{/if}
				</p>
			</UiButton>
		{/each}
	</div>
</div>
