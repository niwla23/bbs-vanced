<script lang="ts">
	import { onMount } from 'svelte';

	const availableEmojis = ['🤮', '😭', '😳', '🥲', '🥱', '🥺', '🫤'];
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
		'Tipp: Die NPCs können dir behilflich sein. Frage sie zum Beispiel nach Hausaufgaben.'
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
