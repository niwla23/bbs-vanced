<script lang="ts">
	import { onMount } from 'svelte';
	import { choosenEmoji, choosenMotd } from './textRessources';
	import { fade, scale, fly } from 'svelte/transition';

	const animate = (n) => scale(n, { y: -100 });
</script>

<div class="w-full h-full flex justify-center items-center" transition:animate>
	<div class="text-center flex flex-col items-center">
		<!-- <p class="text-[10rem] md:text-[14rem] animate-spin text-center w-min">{choosenEmoji}</p> -->
		<div class="flex gap-4">
			<div class="loading-dot" id="dot1" />
			<div class="loading-dot" id="dot2" />
			<div class="loading-dot" id="dot3" />
		</div>
		<small class="text-xs text-muted pt-4">
			{choosenMotd}
		</small>
	</div>
</div>

<style>
	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
		70% {
			transform: scale(1);
		}
		100% {
			transform: scale(1);
		}
	}

	.loading-dot {
		animation: pulse 2s infinite ease-in-out;
		@apply bg-dark w-12 h-12 rounded-full;
	}

	#dot2 {
		animation-delay: 0.5s;
	}
	#dot3 {
		animation-delay: 1s;
	}
</style>
