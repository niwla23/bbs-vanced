<script lang="ts">
	import { onMount } from 'svelte';
	import { availableEmojis, availableMotd } from './textRessources';

	const choosenEmoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
	const choosenMotd = availableMotd[Math.floor(Math.random() * availableMotd.length)];
</script>

<div class="w-full h-full flex justify-center items-center">
	<div class="text-center flex flex-col items-center">
		<p class="text-[10rem] md:text-[14rem] animate-spin text-center w-min">{choosenEmoji}</p>
		<p>Wird geladen ...</p>
		<small class="text-xs text-muted">
			{choosenMotd}
		</small>
	</div>
</div>
