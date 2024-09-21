<script lang="ts">
	import TopBar from '@/lib/TopBar.svelte';
	import Icon from '@iconify/svelte';
	import { env } from '$env/dynamic/public';
</script>

<div class="w-full flex justify-center p-4">
	<main class="max-w-4xl w-full">
		<TopBar title="Vanced PRO" showBack />
		<div class="flex flex-col gap-2 pt-12">
			<h1>Hol dir jetzt die PRO Version!</h1>

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
			<div class="bg-dark p-2 rounded-md flex items-center h-24">
				<Icon icon="mdi:calculator" class="flex-shrink-0 w-12 text-3xl pr-2 text-primary" />
				<div>
					<p>Abirechner</p>
					<small>Erhalte eine Prognose deiner Abinote</small>
				</div>
			</div>
			<div class="bg-dark p-2 rounded-md flex items-center h-24">
				<Icon icon="mingcute:map-line" class="flex-shrink-0 w-12 text-3xl pr-2 text-primary" />
				<div>
					<p>Raumplan</p>
					<small>Finde leere Räume bevor es ein anderer tut</small>
				</div>
			</div>
			<div class="bg-dark p-2 rounded-md flex items-center h-24">
				<Icon
					icon="mingcute:notification-line"
					class="flex-shrink-0 w-12 text-3xl pr-2 text-primary"
				/>
				<div>
					<p>Push-Benachrichtigungen (nicht für iOS >= 17.4)</p>
					<small>
						Du bekommst sofort eine Nachricht auf dein Handy wenn sich der Stundenplan ändert
					</small>
				</div>
			</div>
			<div class="bg-dark p-2 rounded-md flex items-center h-24">
				<Icon
					icon="fluent:calendar-sync-16-regular"
					class="flex-shrink-0 w-12 text-3xl pr-2 text-primary"
				/>
				<div>
					<p>Kalendersynchronisierung</p>
					<small>
						Dein Stundenplan als ICal Kalender. Du siehst deinen Stundenplan in deiner Kalenderapp.
					</small>
				</div>
			</div>
			<div class="bg-dark p-2 rounded-md flex items-center h-24">
				<Icon icon="mdi:color" class="flex-shrink-0 w-12 text-3xl pr-2 text-primary" />
				<div>
					<p>5 Premium Themes</p>
					<small>Aqua, Pink, Pumpkin, Black and White und Mentally Ill</small>
				</div>
			</div>
			<div class="bg-dark p-2 rounded-md flex items-center h-16">
				<Icon icon="mdi:sync" class="flex-shrink-0 w-12 text-3xl pr-2 text-primary" />
				<p>Einstellungssynchonisierung</p>
			</div>
			<div class="bg-dark p-2 rounded-md flex items-center h-16">
				<Icon icon="mingcute:save-fill" class="flex-shrink-0 w-12 text-3xl pr-2 text-primary" />
				<p>Einmalzahlung, kein Abo</p>
			</div>
			<div class="bg-dark p-2 rounded-md flex items-center h-16">
				<Icon icon="tabler:ad-off" class="flex-shrink-0 w-12 text-3xl pr-2 text-primary" />
				<p>Keine Werbung für PRO mehr</p>
			</div>
			<div class="h-40" />
			<div class="flex flex-col fixed bottom-0 w-full left-0">
				<div class="h-16 bg-gradient-to-b from-transparent to-darkest" />
				<div class="bg-darkest flex flex-col gap-2 p-2 pt-0">
					<a
						href="/activatePro/buy"
						class="bg-primary text-on-primary text-center font-bold p-4 rounded-md mt-2"
					>
						Jetzt kaufen - {Number(env.PUBLIC_PRO_PRICE).toFixed(2)}€
					</a>
					<a class="bg-dark rounded-md p-4 text-center" href="/activatePro">
						Ich habe gekauft, jetzt aktivieren
					</a>
				</div>
			</div>
		</div>
	</main>
</div>
