<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { formatDate } from '@/lib/exams';
	import type { NewsArticle } from '@/lib/news';
	import Icon from '@iconify/svelte';
	import PocketBase from 'pocketbase';
	import { fade, scale, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	const animate = (n) => fly(n, { y: -100 });

	const pb = new PocketBase('https://bbs-backend.noteqr.de');

	let newsArticle: NewsArticle | null = null;

	onMount(async () => {
		const filterTemplate = 'showtimeStart <= {:now}';
		pb.autoCancellation(false);
		const result = await pb
			.collection('news')
			.getFirstListItem<NewsArticle>(pb.filter(filterTemplate, { now: formatDate(new Date()) }), {
				sort: '-showtimeStart',
				requestKey: null
			});
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

{#if newsArticle}
	<div class="fixed top-0 left-0 w-full z-30 p-4" transition:animate>
		<div class="rounded-md flex justify-between bg-primary text-on-primary" on:click={handleClick}>
			<div class="p-2 rounded-md">
				<h2 class="font-semibold text-xl">{newsArticle.title}</h2>
				<div>{@html newsArticle.content}</div>
			</div>
			<button on:click={markRead}>
				<Icon icon="material-symbols:close" class="self-center text-3xl w-24" />
			</button>
		</div>
	</div>
{/if}
