<script lang="ts">
	import TopBar from '@/lib/TopBar.svelte';
	import { formatDate } from '@/lib/exams';
	import type { NewsArticle } from '@/lib/news';
	import Icon from '@iconify/svelte';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<TopBar title="Vanced PRO" showBack />
		<div class="flex flex-col gap-2 pt-12">
			<h1>Hol dir jetzt die PRO Version!</h1>
			<div class="bg-dark p-2 rounded-md flex items-center h-24">
				<Icon icon="mdi:color" class="flex-shrink-0 w-12 text-3xl pr-2 text-primary" />
				<div>
					<p>5 Premium Themes</p>
					<small>Aqua, Pink, Pumpkin, Black and White und Mentally Ill</small>
				</div>
			</div>

			<div class="bg-dark p-2 rounded-md flex items-center h-24">
				<Icon icon="mdi:list-box" class="flex-shrink-0 w-12 text-3xl pr-2 text-primary" />
				<div>
					<p>Klausurenübersicht</p>
					<small>Alle deine Klausuren in einer übersichtlichen Liste</small>
				</div>
			</div>
			<div class="bg-dark p-2 rounded-md flex items-center h-24">
				<Icon icon="mdi:clock" class="flex-shrink-0 w-12 text-3xl pr-2 text-primary" />
				<div>
					<p>Zeiten im Stundenplan</p>
					<small>Du kannst Anfang und Ende der Stunde sehen und bekommst einen Countdown</small>
				</div>
			</div>
			<div class="bg-dark p-2 rounded-md flex items-center h-16">
				<Icon icon="mingcute:save-fill" class="flex-shrink-0 w-12 text-3xl pr-2 text-primary" />
				<p>Einmalzahlung, kein Abo</p>
			</div>
			<div class="bg-dark p-2 rounded-md flex items-center h-16">
				<Icon icon="tabler:ad-off" class="flex-shrink-0 w-12 text-3xl pr-2 text-primary" />
				<p>Keine Werbung für PRO mehr</p>
			</div>
			<div class="bg-dark p-2 rounded-md flex items-center h-16">
				<Icon
					icon="material-symbols:support"
					class="flex-shrink-0 w-12 text-3xl pr-2 text-primary"
				/>
				<p>Unterstütze die Entwicklung</p>
			</div>
			<div class="bg-dark p-2 rounded-md flex items-center h-16">
				<Icon icon="mdi:heart" class="flex-shrink-0 w-12 text-3xl pr-2 text-primary" />
				<p>Weitere Funktionen in Entwicklung</p>
			</div>
			<a
				href="https://a26377.myshopify.com/cart/47369688547653:1?channel=buy_button"
				class="bg-primary text-on-primary text-center font-bold p-4 rounded-md mt-2"
			>
				Jetzt kaufen - 4,99€
			</a>
			<a class="bg-dark rounded-md p-4 text-center" href="/activatePro">
				Ich habe gekauft, jetzt aktivieren
			</a>
		</div>
	</main>
</div>
