<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { grade, className } from '../stores';
	import Icon from '@iconify/svelte';
	const dispatch = createEventDispatcher();
	function next() {
		if ($grade == 0 || $className == '') {
			alert('Bitte fülle alle Felder aus');
			return;
		}
		dispatch('next');
	}
</script>

<div class="w-full flex justify-center p-4 h-full items-center">
	<main class="max-w-4xl w-full h-full lg:h-[80vh] flex flex-col justify-between">
		<section class="text-center flex flex-col justify-center h-full">
			<Icon icon="material-symbols:done" class="text-8xl text-primary text-center w-full" />
			<h1>Geschafft!</h1>
			<p>Du kannst jetzt mit einem Klick deinen Stundenplan sehen!</p>
		</section>
		<section>
			<button
				class="{$grade != 0 && $className != ''
					? 'bg-primary text-on-primary'
					: 'bg-dark'} p-4 rounded-md w-full font-bold"
				on:click={next}>ja zeig her jz</button
			>
		</section>
	</main>
</div>
