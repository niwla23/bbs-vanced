<script lang="ts">
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';
	import PocketBase from 'pocketbase';

	let licenseKey = '';

	async function activatePro() {
		// we do some trolling
		if (licenseKey == 'XAjTGFHwaLKfcLY2NpbVdikKFCrMap') {
			location.href = 'https://media.tenor.com/Cj3sLJg6mo0AAAAi/rickroll.gif';
			Cookies.set('hasFakePro', 'true', { expires: 400 });
		}

		const response = await fetch('/api/validateLicense?key=' + licenseKey);
		const data = await response.json();
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
		<p>Gib hier deinen Lizenzschlüssel ein, den du per E-Mail erhalten hast.</p>
		<input
			class="bg-dark rounded-md p-2 w-full text-center"
			placeholder="j3iBxn8iWBNBMloRbssW0ibOfDHz3h"
			bind:value={licenseKey}
		/>
		<button class="w-full p-4 rounded-md bg-primary" on:click={activatePro}>PRO aktivieren</button>
		<a class="bg-darkest rounded-md p-4 text-center underline" href="/getPro">
			Ich habe noch keine Lizenz, jetzt kaufen
		</a>
	</div>
</div>
