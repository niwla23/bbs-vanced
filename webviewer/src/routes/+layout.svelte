<script>
	import '../app.css';
	import { pwaInfo } from 'virtual:pwa-info';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
	<link rel="manifest" href="/site.webmanifest?v=2" />
	<link rel="mask-icon" href="/safari-pinned-tab.svg?v=2" color="#5bbad5" />
	<link rel="shortcut icon" href="/favicon.ico?v=2" />
	<meta name="msapplication-TileColor" content="#00a300" />
	<meta name="theme-color" content="#ffffff" />

	<!--eslint-disable-next-line svelte/no-at-html-tags-->
	{@html webManifestLink}
</svelte:head>
<div class="bg-darkest text-brightest min-h-screen w-screen">
	<slot />
</div>
