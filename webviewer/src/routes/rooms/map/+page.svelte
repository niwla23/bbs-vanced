<script lang="ts">
	import { page } from '$app/stores';
	import TopBar from '@/lib/TopBar.svelte';
	import UiButton from '@/lib/UiButton.svelte';
	import { formatDate } from '@/lib/exams';
	import { hasPro } from '@/routes/stores';
	import { getDatestamp } from 'bbs-parser';
	import type { TimetableLesson } from 'bbs-parser/src/types';
	import type { LayerGroup } from 'leaflet';
	import { onMount, onDestroy } from 'svelte';
	import Swal from 'sweetalert2';

	const roomsStatic = {
		E003: {
			level: 0,
			building: 'E',
			coordinates: [52.8699680413925, 9.599341466660128]
		},
		E004: {
			level: 0,
			building: 'E',
			coordinates: [52.870116098258194, 9.599385585522702]
		},
		E008: {
			level: 0,
			building: 'E',

			coordinates: [52.87021, 9.5996] // fix
		},
		E005: {
			level: 0,
			building: 'E',
			coordinates: [52.86993, 9.59953] // fix
		},

		// G

		G009: {
			level: 0,
			building: 'G',
			coordinates: [52.86982, 9.59968] // fix
		},
		G010: {
			level: 0,
			building: 'G',
			coordinates: [52.86979, 9.59979] // fix
		},
		G011: {
			level: 0,
			building: 'G',
			coordinates: [52.8698, 9.5999] // fix
		},

		// H

		H001: {
			level: 0,
			building: 'H',
			coordinates: [52.86971, 9.59762]
		},
		H002: {
			level: 0,
			building: 'H',
			coordinates: [52.86964, 9.59762]
		},

		H003: {
			level: 0,
			building: 'H',
			coordinates: [52.86954, 9.5976]
		},

		// D

		D005: {
			level: 0,
			building: 'D',
			coordinates: [52.87063, 9.59935]
		},

		D105: {
			level: 1,
			building: 'D',
			coordinates: [52.87074, 9.59918]
		},

		D106: {
			level: 1,
			building: 'D',
			coordinates: [52.87082, 9.5992]
		},

		D107: {
			level: 1,
			building: 'D',
			coordinates: [52.8709, 9.59921]
		},

		D108: {
			level: 1,
			building: 'D',
			coordinates: [52.87064, 9.59931]
		},

		D109: {
			level: 1,
			building: 'D',
			coordinates: [52.87072, 9.59933]
		},

		D110: {
			level: 1,
			building: 'D',
			coordinates: [52.87081, 9.599345]
		},

		// B

		B101: {
			level: 1,
			building: 'B',
			coordinates: [52.87059, 9.59878]
		},

		B102: {
			level: 1,
			building: 'B',
			coordinates: [52.87046, 9.5989]
		},
		B103: {
			level: 1,
			building: 'B',
			coordinates: [52.87047, 9.59874]
		},
		B104: {
			level: 1,
			building: 'B',
			coordinates: [52.87048, 9.59858]
		},
		B105: {
			level: 1,
			building: 'B',
			coordinates: [52.87072, 9.59864]
		},
		B106: {
			level: 1,
			building: 'B',
			coordinates: [52.87071, 9.59879]
		},
		B107: {
			level: 1,
			building: 'B',
			coordinates: [52.87069, 9.59896]
		},

		B201: {
			level: 2,
			building: 'B',
			coordinates: [52.87059, 9.59878]
		},

		B202: {
			level: 2,
			building: 'B',
			coordinates: [52.87046, 9.5989]
		},
		B203: {
			level: 2,
			building: 'B',
			coordinates: [52.87047, 9.59874]
		},
		B204: {
			level: 2,
			building: 'B',
			coordinates: [52.87048, 9.59858]
		},
		B205: {
			level: 2,
			building: 'B',
			coordinates: [52.87072, 9.59864]
		},
		B206: {
			level: 2,
			building: 'B',
			coordinates: [52.87071, 9.59879]
		},
		B207: {
			level: 2,
			building: 'B',
			coordinates: [52.87069, 9.59896]
		}
	};

	let allowedDates = [0, 1].map((i) => {
		let d = new Date();
		d.setDate(d.getDate() + i);
		return d;
	});

	let leaflet: typeof import('leaflet');
	let mapElement;
	let map;
	let roomMarkerGroup: LayerGroup;
	let date = new Date();
	let roomsData;
	let currentLevel = 0;
	let isLoading = true;

	// todo: use shared type with server
	type RoomMapping = {
		[room: string]: { lesson: TimetableLesson; className: string }[][];
	};
	type RoomsResponse = { rooms: RoomMapping };

	async function getRoomsForDateClient(date: Date): Promise<RoomsResponse> {
		const resp = await fetch(`/api/timetable/rooms?date=${getDatestamp(date)}`);
		const text = await resp.text();
		const parsedData = JSON.parse(text);

		return parsedData;
	}

	function roomDataToText(data: { lesson: TimetableLesson; className: string }[][]) {
		if (!data) return 'Raum nicht genutzt';
		let text = '';
		for (const [hour, slot] of data.entries()) {
			for (const lesson of slot) {
				text += `${hour}: ${lesson.className} - ${lesson.lesson.teacher}<br />`;
			}
		}
		return text;
	}

	async function loadData() {
		if (!$hasPro) {
			isLoading = false;
			return;
		}
		isLoading = true;
		roomsData = await getRoomsForDateClient(date);
		isLoading = false;
	}
	$: date, loadData();

	function drawRooms(level: number) {
		if (!leaflet) return;
		roomMarkerGroup.clearLayers();

		if (level == 0) {
			const B0PlanBounds = new leaflet.LatLngBounds([52.8708, 9.598411], [52.8704, 9.5994]);
			leaflet.imageOverlay('/roomsB0.png', B0PlanBounds, { zIndex: 400 }).addTo(roomMarkerGroup);
		}

		if (level != 0) {
			const B1_2PlanBounds = new leaflet.LatLngBounds([52.87082, 9.59829], [52.87032, 9.59956]);
			leaflet
				.imageOverlay('/roomsB1-2.png', B1_2PlanBounds, { zIndex: 400 })
				.addTo(roomMarkerGroup);
		}

		if (level == 1) {
			const D1_2PlanBounds = new leaflet.LatLngBounds([52.871, 9.59903], [52.87057, 9.59943]);
			leaflet
				.imageOverlay('/roomsD1-2.png', D1_2PlanBounds, { zIndex: 400 })
				.addTo(roomMarkerGroup);
		}

		for (const [roomName, roomProps] of Object.entries(roomsStatic)) {
			if (roomProps.level != level) continue;
			leaflet
				.marker(roomProps.coordinates, {
					icon: leaflet.divIcon({
						className: 'text-labels', // Set class for CSS styling

						html: `<span style="color:black;">${roomName}</span>`
					})
				})
				.bindPopup((layer) => roomDataToText(roomsData.rooms[roomName]), {})
				.addTo(roomMarkerGroup);
		}
	}
	$: currentLevel, drawRooms(currentLevel);

	onMount(async () => {
		leaflet = await import('leaflet');

		// 52.870370905875234, 9.599009913085602
		const mapBounds = new leaflet.LatLngBounds([52.8738, 9.59244], [52.86404, 9.60287]);
		map = leaflet.map(mapElement, { maxBounds: mapBounds }).setView([52.8703709, 9.59900991], 18);

		leaflet
			.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				minZoom: 17,
				maxZoom: 22,
				maxNativeZoom: 20,
				opacity: 0.4
			})
			.addTo(map);

		const planBound = new leaflet.LatLngBounds([52.874397, 9.59259], [52.86432, 9.605679]);
		map.fitBounds(planBound);
		const schoolPlanRes = await fetch('/schoolPlan.svg');
		const schoolPlan = await schoolPlanRes.text();

		var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		svgElement.setAttribute('viewBox', '460 -1940 50 3900');
		svgElement.innerHTML = `<g transform="rotate(-82, 0, 0)">${schoolPlan}</g>`;

		leaflet.svgOverlay(svgElement, planBound, { opacity: 0.99, interactive: true }).addTo(map);
		if (!$hasPro) {
			Swal.fire('PRO Funktion', 'Mit PRO kannst du sehen welche Klasse wann in welchem Raum ist');
			return;
		}

		roomMarkerGroup = leaflet.layerGroup();
		roomMarkerGroup.addTo(map);
		drawRooms(currentLevel);

		if ($page.url.searchParams.has('dev')) {
			// Add a draggable marker
			var marker = leaflet
				.marker([52.8703709, 9.59900991], {
					draggable: true
				})
				.addTo(map);

			// Function to update marker popup with coordinates
			const updatePopup = (e) => {
				var lat = e.latlng.lat.toFixed(5);
				var lng = e.latlng.lng.toFixed(5);
				marker.bindPopup('Coordinates: [' + lat + ', ' + lng + ']').openPopup();
				console.log('Coordinates: [' + lat + ', ' + lng + ']');
			};

			// Event listener for drag events
			marker.on('dragend', function (e) {
				var marker = e.target;
				var position = marker.getLatLng();
				updatePopup({ latlng: position });
			});

			// Initialize popup with coordinates
			updatePopup({ latlng: marker.getLatLng() });
		}
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
</script>

<main class="w-full">
	<TopBar title="Raumplan" showBack showMenuButton={false} icon="mingcute:news-line" />
	<div class="h-screen mt-16" bind:this={mapElement} />
	<div class="p-4 bg-darkest absolute bottom-0 z-[9999] w-screen flex gap-4 items-middle">
		<div class="flex-2 flex-grow">
			{isLoading ? 'Daten werden geladen...' : 'Fertig.'}
			<div class="flex gap-2">
				{#each allowedDates as dateOption, i}
					{@const isSelected = dateOption.toDateString() === date.toDateString()}
					<UiButton
						appearance={isSelected ? 'primary' : 'normal'}
						disabled={isSelected}
						class="flex-1"
						on:click={() => {
							date = dateOption;
						}}
					>
						{['Heute', 'Morgen', 'Übermorgen'][i]}
					</UiButton>
				{/each}
			</div>
		</div>
		<div>
			<p>Etage</p>

			<div class="flex gap-2">
				{#each [0, 1, 2] as level}
					<UiButton
						appearance={currentLevel == level ? 'primary' : 'normal'}
						class="flex-1"
						on:click={() => {
							currentLevel = level;
						}}
					>
						{level}
					</UiButton>
				{/each}
			</div>
		</div>
	</div>
</main>

<style>
	@import 'leaflet/dist/leaflet.css';
</style>
