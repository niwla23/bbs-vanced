<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { shareApp } from './shareApp';

	import { fly } from 'svelte/transition';
	import UiButton from './UiButton.svelte';
	import ProBadge from './ProBadge.svelte';

	const animate = (n) => fly(n, { x: -300 });

	const menuEntries = [
		{
			icon: 'mingcute:home-1-line',
			label: 'Stundenplan',
			onclick: (e) => goto('/')
		},
		{
			icon: 'mingcute:eyeglass-line',
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
			icon: 'mingcute:calendar-add-line',
			label: 'Klausur eintragen',
			onclick: (e) => goto('/addExam')
		},
		{
			icon: 'mingcute:currency-dollar-line',
			label: 'Notenumrechner',
			onclick: (e) => goto('/grades/converter')
		},
		{
			icon: 'solar:calculator-minimalistic-linear',
			label: 'Abirechner',
			isPro: true,
			onclick: (e) => goto('/grades')
		},
		{
			icon: 'mingcute:news-line',
			label: 'News',
			onclick: (e) => goto('/news')
		},
		{
			icon: 'mingcute:settings-3-line',
			label: 'Einstellungen',
			onclick: (e) => goto('/settings')
		},
		{
			icon: 'mingcute:toilet-paper-line',
			label: 'Rechtliches',
			onclick: (e) => goto('/legal')
		},
		{
			icon: 'mingcute:share-2-line',
			label: 'App teilen',
			onclick: (e) => shareApp('menu_share')
		},
		{
			icon: 'mingcute:bug-line',
			label: 'Fehler melden',
			onclick: (e) => (window.location.href = 'https://forms.gle/kRwhumz48RjZhTTe9')
		}
	];

	export let onClose: () => any;
</script>

<div
	class="fixed inset-0 p-8 h-screen w-screen flex justify-center items-center bg-darkest/90 z-[2500]"
	on:click={() => onClose()}
	on:keypress={(e) => e.key == 'Escape' && onClose()}
	role="button"
	tabindex="-100"
	transition:animate
>
	<div
		class="max-w-2xl w-full bg-dark text-brightest rounded-md border border-colborder shadow-sm shadow-black p-4 flex flex-col gap-4 text-lg h-min z-[2500]"
	>
		{#each menuEntries as entry}
			<UiButton class="flex gap-2" on:click={entry.onclick}>
				<Icon icon={entry.icon} class="h-6 w-6" />
				<p class="flex items-center gap-2">
					<span>{entry.label}</span>
					{#if entry.isPro}
						<ProBadge />
					{/if}
				</p>
			</UiButton>
		{/each}
	</div>
</div>
