<script>
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	function back() {
		history.back();
	}
</script>

<div class="w-full flex justify-center">
	<div class="max-w-3xl w-full p-2">
		<nav class="text-center w-full flex justify-between">
			<button on:click={back}>
				<Icon icon="material-symbols:arrow-left-alt" class="text-2xl mr-2" />
			</button>
			<ul class="flex flex-grow font-bold justify-center gap-2 p-2">
				<a class="p-2" href="/legal/impressum">Impressum</a>
				<a class="p-2" href="/legal/privacy">Datenschutz</a>
				<a class="p-2" href="/legal/agb">AGBs</a>
			</ul>
		</nav>
		<slot />
	</div>
</div>
