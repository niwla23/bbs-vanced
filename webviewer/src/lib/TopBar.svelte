<script lang="ts">
	import Icon from '@iconify/svelte';
	import { choosenEmoji } from './textRessources';
	import Menu from './Menu.svelte';

	let showMenu = false;

	export let title: string;
	export let showBack = false;
</script>

<div class="w-full flex justify-center py-2 px-4 fixed top-0 left-0 backdrop-blur bg-darkest">
	<div class="w-full max-w-4xl flex gap-2 justify-between">
		<div class="flex items-center">
			{#if showBack}
				<a href="/"><Icon icon="material-symbols:arrow-left-alt" class="text-2xl mr-2" /></a>
			{:else}
				<p class="text-2xl pr-4">{choosenEmoji}</p>
			{/if}
			<div>
				<h1 class="font-bold text-2xl">{title}</h1>
				<h2 class="text-muted text-xs">By Alwin Lohrie</h2>
			</div>
		</div>
		<div class="flex gap-1">
			<slot />
			<button on:click={() => (showMenu = true)} class="rounded-md px-2 text-xs">
				<Icon icon="material-symbols:menu" class="h-6 w-6" />
			</button>
		</div>
	</div>
	{#if showMenu}
		<Menu onClose={() => (showMenu = false)} />
	{/if}
</div>
