<script lang="ts">
	import { formatDate } from '@/lib/exams';
	import type { NewsArticle } from '@/lib/news';
	import Icon from '@iconify/svelte';
	import PocketBase from 'pocketbase';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import UiButton from '@/lib/UiButton.svelte';

	const animate = (n) => fly(n, { y: -100 });

	const pb = new PocketBase('https://bbs-backend.noteqr.de');

	let newsArticle: NewsArticle | null = null;

	onMount(async () => {
		// do not show news on unconfigured app
		if (localStorage.getItem('settings') == null) return;

		const filterTemplate = 'showtimeStart <= {:now} && environment = {:environment}';
		pb.autoCancellation(false);
		const result = await pb.collection('news').getFirstListItem<NewsArticle>(
			pb.filter(filterTemplate, {
				now: formatDate(new Date()),
				environment: process.env.NODE_ENV
			}),
			{
				sort: '-showtimeStart',
				requestKey: null
			}
		);
		if (localStorage.getItem('lastNewsId') != result.id) {
			newsArticle = result;
		}
	});

	function markRead() {
		localStorage.setItem('lastNewsId', newsArticle.id);
		newsArticle = null;
	}

	function handleClick() {
		if (newsArticle && newsArticle.linkUrl) {
			location.href = newsArticle.linkUrl;
			markRead();
		}
	}
</script>

{#if newsArticle && !newsArticle.fullscreen}
	<div class="fixed top-0 left-0 w-full z-30 p-4" transition:animate>
		<div
			class="rounded-md flex justify-between bg-primary text-on-primary"
			role="button"
			on:click={handleClick}
		>
			<div class="p-2 rounded-md">
				<h2 class="font-semibold text-xl">{newsArticle.title}</h2>
				<div>{@html newsArticle.content}</div>
			</div>
			<button on:click={markRead}>
				<Icon icon="material-symbols:close" class="self-center text-3xl w-24" />
			</button>
		</div>
	</div>
{:else if newsArticle && newsArticle.fullscreen}
	<div
		class="fixed inset-0 z-50 bg-primary w-screen h-screen flex flex-col justify-center p-8"
		transition:animate
	>
		<div>
			<h1 class="text-3xl font-bold text-center">{newsArticle.title}</h1>
			<div class="text-center pb-4">{@html newsArticle.content}</div>
			{#if newsArticle.linkUrl}
				<UiButton class="bg-white text-primary p-4" appearance="none" on:click={handleClick}>
					Öffnen
				</UiButton>
			{/if}
		</div>
		<div class="absolute top-0 right-0 p-2">
			<UiButton
				class="bg-white text-primary rounded-full p-2 !w-10 h-10"
				appearance="none"
				on:click={markRead}
			>
				X
			</UiButton>
		</div>
	</div>
{/if}
