<script lang="ts">
	import { fade, blur, fly, slide, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
</script>

<div
	class="w-full h-full flex justify-center items-center"
	transition:scale={{ delay: 250, duration: 300 }}
>
	<div class="text-center flex flex-col items-center">
		<p class="text-[10rem] md:text-[14rem] animate-spin text-center w-min">😱</p>
		<p>Ich suche deinen Stundenplan...</p>
		<small class="text-xs text-gray-300"
			>(Dieser Loader wurde in 5 Minuten um 3 Uhr nachts gebaut)</small
		>
	</div>
</div>
