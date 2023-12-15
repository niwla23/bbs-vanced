<script lang="ts">
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';
	import PocketBase from 'pocketbase';

	let licenseKey = '';

	async function validateLicenseServer(licenseKey: string, userId: string) {
		const endpointUrl = new URL('/api/validateLicense', window.location.origin);
		endpointUrl.searchParams.set('key', licenseKey);
		endpointUrl.searchParams.set('accountId', userId);

		const response = await fetch(endpointUrl);
		const data = await response.json();
		return data;
	}

	async function activatePro() {
		const pb = new PocketBase('https://bbs-backend.noteqr.de');

		if (!pb.authStore.model) {
			alert('you are not logged in.');
			goto('/activatePro');
			return;
		}

		// we do some trolling
		if (licenseKey == 'XAjTGFHwaLKfcLY2NpbVdikKFCrMap') {
			location.href = 'https://media.tenor.com/Cj3sLJg6mo0AAAAi/rickroll.gif';
			Cookies.set('hasFakePro', 'true', { expires: 400 });
		}

		const data = await validateLicenseServer(licenseKey, pb.authStore.model.id);
		if (data.valid) {
			localStorage.setItem('hasPro', 'true');
			Cookies.set('hasPro', 'true', { expires: 400 });
			alert(
				'Die PRO Version wurde aktiviert! Starte die App neu um alle Funktionen nutzen zu können.'
			);
			goto('/');
		} else {
			alert(
				'Der Lizenzschlüssel ist nicht korrekt. Bitte versuche es erneut oder schreibe eine email an bbs-vanced@noteqr.de'
			);
		}
	}
</script>

<div class="w-full h-full grid justify-center items-center">
	<div class="text-center flex flex-col gap-2 p-4">
		<p>
			Dein Account ist noch nicht mit deinem Lizenzschlüssel verbunden. Bitte gib den
			Lizenzschlüssel, den du per Email bekommen hast hier ein.
		</p>
		<input
			class="bg-dark rounded-md p-2 w-full text-center"
			placeholder="j3iBxn8iWBNBMloRbssW0ibOfDHz3h"
			bind:value={licenseKey}
		/>
		<button class="w-full p-4 rounded-md bg-primary text-on-primary" on:click={activatePro}>
			Jetzt mit Account verbinden
		</button>
		<a class="bg-darkest rounded-md p-4 text-center underline" href="/getPro">
			Ich habe noch keine Lizenz, jetzt kaufen
		</a>
	</div>
</div>
