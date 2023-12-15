<script>
	import '../app.css';
	import { navigating } from '$app/stores';
	import LoadingScreen from '@/lib/LoadingScreen.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Cookies from 'js-cookie';
	import { hasPro } from './stores';
	// import { pwaInfo } from 'virtual:pwa-info';

	let proEvaluationDone = false;

	onMount(() => {
		if (browser && localStorage.getItem('hasPro') == 'true') {
			Cookies.set('hasPro', 'true', { expires: 400 });
			hasPro.set(true);
		}
		if (Cookies.get('hasPro') == 'true') {
			hasPro.set(true);
		}
		proEvaluationDone = true;
	});

	// $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
	<link rel="shortcut icon" href="/favicon.ico" />

	<script>
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker.register('/sw.js', { scope: '/' });
			});
		}
	</script>
</svelte:head>
<div class="scroll-smooth bg-darkest text-brightest min-h-screen h-full w-screen flex select-none">
	<div class="flex-grow">
		{#if $navigating || !proEvaluationDone}
			<LoadingScreen />
		{:else}
			<slot />
		{/if}
	</div>
</div>
