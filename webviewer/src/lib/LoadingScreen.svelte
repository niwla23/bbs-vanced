<script lang="ts">
	import { onMount } from 'svelte';
	import { choosenEmoji, choosenMotd } from './textRessources';
	import { fade, scale, fly } from 'svelte/transition';

	const animate = (n) => scale(n, { y: -100 });
</script>

<div class="w-full h-full flex justify-center items-center" transition:animate>
	<div class="text-center flex flex-col items-center">
		<p class="text-[10rem] md:text-[14rem] animate-spin text-center w-min">{choosenEmoji}</p>
		<p>Wird geladen ...</p>
		<small class="text-xs text-muted">
			{choosenMotd}
		</small>
	</div>
</div>
