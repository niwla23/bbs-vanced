<script lang="ts">
	import { onMount } from 'svelte';

	const availableEmojis = ['🤮', '😭', '😳', '🥲', '🥱', '🥺', '🫤', '😥', '😑'];
	const availableMotd = [
		'Heute wird wieder ein Kacktag.',
		'Tipp: Bis zum dritten Tag gibt es keine Attestpflicht',
		'Steigere deine mündliche Note durch Nicken und Sounds',
		'Manchmal hört ein Schultag auch früher auf als im Stundenplan',
		'Pass auf! Schulprojekte sind oft Zeitverschwendung',
		'Nicht alle DLCs bringen dich weiter. Wähle sie weise.',
		'Setze deine Energiepunkte sinnvoll ein.',
		'Hinweis: Taktisches Überspringen von Stunden wirkt sich positiv auf dein HP aus',
		'Achtung! Hausaufgaben sind Side Quests. Verschwende nicht zu viel Zeit mit ihnen.',
		'Tipp: Die NPCs können dir behilflich sein. Frage sie zum Beispiel nach Hausaufgaben.',
		'Tipp: Du kannst den Raum währrend des Unterrichts jederzeit verlassen',
		'Hinweis: Der Schülerladen öffnet nur selten. Verpasse es nicht!',
		'Tip: Sleep in class to save energy',
		"You can't carry anything after your backpack is full.",
		'Forgot to study for a test? Call in a bomb threat!',
		'every 60 seconds in Africa, a minute passes.',
		'A rubber band can be used to fire small projectiles to ward of attackers',
		'Enemies can’t see or shoot through walls.',
		"Remember, the rule isn't to not do it, the rule is to not get caught",
		'I don’t know, can you use the bathroom?',
		'Achtung: Ab Level 25 endet die Low-Level-Protection und du musst du deine Krankenversicherungsbeiträge selbst bezahlen.',
		'Wenn du die ganze Woche grinden willst, caste mit einem Heiler den Zauber "gelber Schein".',
		'Die Enten im Park sind kostenlos.',
		'Kranstellplätze müssen verdichtet werden.',
		'Trete aus der Kirche aus, um Kirchensteuer zu sparen',
		'Durch Handtücher können jegliche Sitzflächen reserviert werden.',
		'Die Gelbe Tonne ist nur für Verpackungsmaterial',
		'Es bleibt alles hier so wie es ist.',
		'Das geht vorbei, doch was ist wenn nicht?',
		'Nett hier. aber waren sie schon mal in Baden-Württenberg?',
		'Ein Gefängnisausbruch ist straffrei.',
		'Schaun wa ma was wird... [Dein Einsatz]',
		'FCK AFD',
		'Du willst nach Hause? Geh. Morgen ist auch noch ein Tag.',
		'Schlaf > Schule.',
		'Der Unterricht ist zum Essen und auf Klo gehen. Flasche auffüllen auch. Verschwende nicht die Pause damit.',
		'Antworten ausdenken > Lernen'
	];
	const choosenEmoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
	const choosenMotd = availableMotd[Math.floor(Math.random() * availableMotd.length)];
</script>

<div class="w-full h-full flex justify-center items-center">
	<div class="text-center flex flex-col items-center">
		<p class="text-[10rem] md:text-[14rem] animate-spin text-center w-min">{choosenEmoji}</p>
		<p>Wird geladen ...</p>
		<small class="text-xs text-gray-300">
			{choosenMotd}
		</small>
	</div>
</div>
