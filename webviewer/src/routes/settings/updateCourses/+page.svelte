<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSettings, saveSettings } from '@/lib/settings';
	import TourImport from '@/routes/tour/components/TourImport.svelte';
	import { coursesString } from '@/routes/tour/stores';
	import Swal from 'sweetalert2';

	async function handleSubmit() {
		const currentSettings = await getSettings();

		await saveSettings({
			...currentSettings,
			courses: $coursesString != '' ? $coursesString.trim().split(';') : []
		});

		await Swal.fire('Import erfolgreich!');
		goto('/');
	}
</script>

<TourImport on:next={handleSubmit} showIDontWantThisBtn={false} />
