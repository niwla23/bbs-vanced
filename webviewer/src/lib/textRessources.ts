export const availableEmojis = ['🤮', '😭', '😳', '🥲', '🥱', '🥺', '🫤', '😥', '😑'];
export const availableMotd = [
  'Heute wird wieder ein Kacktag.',
  'Tipp: Bis zum dritten Tag gibt es keine Attestpflicht',
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
  'Enemies can’t see or shoot through walls.',
  "Remember, the rule isn't to not do it, the rule is to not get caught",
  'I don’t know, can you use the bathroom?',
  'Achtung: Ab Level 25 endet die Low-Level-Protection und du musst du deine Krankenversicherungsbeiträge selbst bezahlen.',
  'Wenn du die ganze Woche grinden willst, caste mit einem Heiler den Zauber "gelber Schein".',
  'Die Enten im Park sind kostenlos.',
  'Kranplätze müssen verdichtet sein.',
  'Trete aus der Kirche aus, um Kirchensteuer zu sparen',
  'Durch Handtücher können jegliche Sitzflächen reserviert werden.',
  'Die Gelbe Tonne ist nur für Verpackungsmaterial',
  'Es bleibt alles hier so wie es ist.',
  'Das geht vorbei, doch was ist wenn nicht?',
  'Nett hier. aber waren sie schon mal in Baden-Württenberg?',
  'Ein Gefängnisausbruch ist straffrei.',
  'FCK AFD',
  'Du willst nach Hause? Geh. Morgen ist auch noch ein Tag.',
  'Schlaf > Schule.',
  'Der Unterricht ist zum Essen und auf Klo gehen. Flasche auffüllen auch. Verschwende nicht die Pause damit.',
  'Antworten ausdenken > Lernen',
  'Ach mein, dein... Das sind doch bürgerliche Kategorien',
  'Wer anderen eine Grube gräbt, braucht eine Baugenehmigung',
  'We don’t make Mistakes, we have Happy Accident’s. - Bob Ross',
  'Es jibt sone und solche, und dann jibt es noch janz andre, aba dit sind die Schlimmstn - Herta',
  'Warum liegt hier überhaupt Stroh?',
  '"Was ist das? - Das ist blaues Licht - und was macht es? - Es leuchtet blau" - Deutsche Hochschule der Polizei.',
  'I dont wanna live in a world were Kindness is a sign of weakness',
  'europäische Blauhaarkatze',
  'Niemand will an dein Schnitzel, Alice',
  'gLaUben kAnnst dU IN DEr kiRCHE',
  'Dit is ‘ne freundliche Diktatur hier.',
  'I just keep trying things and it keeps working somehow',
  'Frühstück!',
  '🏳️‍⚧️🏳️‍⚧️🏳️‍⚧️',
  '🏳️‍🌈🏳️‍🌈🏳️‍🌈',
];
export const hourTimes = {
  start: ["-", "7:55", "8:40", "9:45", "10:30", "11:35", "12:20", "13:25", "14:10", "15:05", "15:50"],
  end: ["-", "8:40", "9:25", "10:30", "11:15", "12:20", "13:05", "14:10", "14:55", "15:50", "16:35"]
}

export const hourStartTimesRaw = [
  [5, 0],
  [7, 55],
  [8, 40],
  [9, 45],
  [10, 30],
  [11, 35],
  [12, 20],
  [13, 25],
  [14, 10],
  [15, 5],
  [15, 50]
]

export const hourEndTimesRaw = [
  [6, 0],
  [8, 40],
  [9, 25],
  [10, 30],
  [11, 15],
  [12, 20],
  [13, 5],
  [14, 10],
  [14, 55],
  [15, 50],
  [16, 35]
]

export const choosenEmoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
export const choosenMotd = availableMotd[Math.floor(Math.random() * availableMotd.length)];

