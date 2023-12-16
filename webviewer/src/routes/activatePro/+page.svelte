<script lang="ts">
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';
	import PocketBase from 'pocketbase';

	let licenseKey = '';

	async function loginAndCheck() {
		const pb = new PocketBase('https://bbs-backend.noteqr.de');
		await pb.collection('users').authWithOAuth2({
			provider: 'google',
			urlCallback: (url) => {
				window.location.href = url;
			}
		});

		if (!pb.authStore.model) {
			console.log('no user logged in');
			return;
		}
		console.log(pb.authStore.model.hasPro);
		if (pb.authStore.model.proKey != '') {
			localStorage.setItem('hasPro', 'true');
			Cookies.set('hasPro', 'true', { expires: 400 });
			alert(
				'Die PRO Version wurde aktiviert! Starte die App neu um alle Funktionen nutzen zu können.'
			);
			goto('/');
		} else {
			goto('/activatePro/key');
		}
	}
</script>

<div class="w-full h-full grid justify-center items-center">
	<div class="text-center flex flex-col gap-2 p-4">
		<p>
			Bitte melde dich an. Wenn du schon PRO aktivierst hast, wird es auch auf diesem Gerät
			freigeschaltet. Sonst musst du den Lizenzschlüssel eingeben
		</p>
		<button class="w-full p-4 rounded-md bg-primary text-on-primary" on:click={loginAndCheck}>
			Mit Google anmelden
		</button>
		<a class="bg-darkest rounded-md px-4 pt-4 text-center underline" href="/getPro">
			Ich habe noch keine Lizenz, jetzt kaufen
		</a>
		<a
			class="bg-darkest rounded-md px-4 text-center underline text-muted"
			href="mailto:bbs-vanced@noteqr.de"
		>
			Ich habe ein Problem
		</a>
	</div>
</div>
