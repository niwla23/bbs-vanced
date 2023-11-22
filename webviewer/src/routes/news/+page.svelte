<script lang="ts">
	import TopBar from '@/lib/TopBar.svelte';
	import { formatDate } from '@/lib/exams';
	import type { NewsArticle } from '@/lib/news';
	import Icon from '@iconify/svelte';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';

	const pb = new PocketBase('https://bbs-backend.noteqr.de');

	let newsList: NewsArticle[] = [];

	onMount(async () => {
		const filterTemplate = 'showtimeStart <= {:now}';
		pb.autoCancellation(false);
		const result = await pb.collection('news').getFullList<NewsArticle>({
			sort: '-showtimeStart',
			filter: pb.filter(filterTemplate, { now: formatDate(new Date()) }),
			requestKey: null
		});
		newsList = result;
		localStorage.setItem('lastNewsId', newsList[0].id);
	});
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<!-- <h1 class="font-bold text-2xl"> -->
		<!-- 	<a href="/"><Icon icon="material-symbols:arrow-left-alt" class="inline h-12" /></a> -->
		<!-- 	News -->
		<!-- </h1> -->
		<TopBar title="News" showBack />
		<div class="flex flex-col gap-2 pt-12">
			{#each newsList as newsArticle}
				<div class="bg-dark p-2 rounded-md">
					<small class="text-primary">{newsArticle.showtimeStart.split(' ')[0]}</small>
					<h2 class="font-semibold text-xl pb-2">{newsArticle.title}</h2>
					<div>{@html newsArticle.content}</div>
				</div>
			{/each}
		</div>
	</main>
</div>
