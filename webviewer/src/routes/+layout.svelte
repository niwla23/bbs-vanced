<script>
	import '../app.css';
	import { navigating } from '$app/stores';
	import LoadingScreen from '@/lib/LoadingScreen.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Cookies from 'js-cookie';
	import { hasPro } from './stores';
	import NewsBanner from '@/lib/NewsBanner.svelte';
	import { fly } from 'svelte/transition';
	import { subscribeNotificationsClient } from '@/lib/notifications';
	import { get } from 'svelte/store';

	let proEvaluationDone = false;
	export let data;

	onMount(() => {
		const settingsLocal = localStorage.getItem('settings');
		if (settingsLocal != null) Cookies.set('settings', settingsLocal, { expires: 400 });

		if (browser && localStorage.getItem('hasPro') == 'true') {
			Cookies.set('hasPro', 'true', { expires: 400 });
			hasPro.set(true);
		} else {
			Cookies.set('hasPro', 'false', { expires: 400 });
		}
		if (Cookies.get('hasPro') == 'true') {
			hasPro.set(true);
		}
		proEvaluationDone = true;

		if (get(hasPro)) {
			subscribeNotificationsClient();
		}
	});
</script>

<svelte:head>
	<title>BBS Vanced</title>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
	<link rel="manifest" href="/manifest.json" />
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
	<link rel="shortcut icon" href="/favicon.ico" />
</svelte:head>

{#key data.url}
	<div
		class="scroll-smooth bg-darkest main-background text-brightest min-h-screen h-full w-full flex select-none bg-fixed bg-cover"
	>
		<div class="flex-grow">
			{#if $navigating || !proEvaluationDone}
				<!-- <LoadingScreen /> -->
			{:else}
				<NewsBanner />
				<div class="h-full w-full" out:fly={{ x: 200, duration: 300 }}>
					<slot />
				</div>
			{/if}
		</div>
	</div>
{/key}
