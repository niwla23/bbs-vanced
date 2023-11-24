<script lang="ts">
	import Icon from '@iconify/svelte';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	import TourWelcome from './components/TourWelcome.svelte';
	import TourImport from './components/TourImport.svelte';
	import TourInstall from './components/TourInstall.svelte';
	import { className, coursesString, grade } from './stores';
	import TourDone from './components/TourDone.svelte';
	import { goto } from '$app/navigation';
	import { saveSettings } from '@/lib/settings';

	const pb = new PocketBase('https://bbs-backend.noteqr.de');
	let currentStep: 'install' | 'welcome' | 'import' | 'done' = 'install';

	function apply() {
		saveSettings({
			courses: $coursesString != '' ? $coursesString.trim().split(';') : [],
			className: $className
		});
		goto('/');
	}
</script>

{#if currentStep == 'install'}
	<TourInstall on:next={() => (currentStep = 'welcome')} />
{:else if currentStep == 'welcome'}
	<TourWelcome on:next={() => (currentStep = $grade == 11 ? 'done' : 'import')} />
{:else if currentStep == 'import'}
	<TourImport on:next={() => (currentStep = 'done')} />
{:else if currentStep == 'done'}
	<TourDone on:next={apply} />
{/if}
