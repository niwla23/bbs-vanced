<script lang="ts">
	import Icon from '@iconify/svelte';
	import { choosenEmoji } from './textRessources';
	import Menu from './Menu.svelte';
	import UiButton from './UiButton.svelte';

	let showMenu = false;
	export let title: string;
	export let showBack = false;
	export let showMenuButton = true;
	export let icon: string | null = null;
</script>

<div
	class="component-topbar w-full flex justify-center py-2 px-4 fixed top-0 left-0 z-20 backdrop-blur bg-darkest"
>
	<div class="w-full max-w-4xl flex gap-2 justify-between">
		<div class="flex items-center">
			{#if showBack}
				<a href="/"><Icon icon="material-symbols:arrow-left-alt" class="text-2xl mr-2" /></a>
			{:else if icon}
				<Icon {icon} class="text-3xl mr-4 ml-1 text-primary" />
			{:else}
				<p class="text-2xl pr-4">{choosenEmoji}</p>
			{/if}
			<div>
				<h1 class="font-bold text-2xl">{title}</h1>
				<h2 class="text-muted text-xs">By Lea Lohrie</h2>
			</div>
		</div>
		<div class="flex gap-1">
			<slot />
			{#if showMenuButton}
				<UiButton on:click={() => (showMenu = true)} class="rounded-md px-2 text-xs">
					<Icon icon="mingcute:menu-line" class="h-6 w-6" />
				</UiButton>
			{/if}
		</div>
	</div>
	{#if showMenu}
		<Menu onClose={() => (showMenu = false)} />
	{/if}
</div>
