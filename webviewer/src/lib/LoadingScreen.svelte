<script lang="ts">
	import { fade, blur, fly, slide, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
</script>

<div
	class="w-full h-screen flex justify-center items-center"
	transition:scale={{ delay: 250, duration: 300 }}
>
	<div>
		<p class="text-[14rem] animate-spin text-center">😱</p>
		<p>Wir sammeln die neusten Daten, nur für dich!</p>
		<small class="text-gray-300">(Dieser Loader wurde in 5 Minuten um 3 Uhr nachts gebaut)</small>
	</div>
</div>
