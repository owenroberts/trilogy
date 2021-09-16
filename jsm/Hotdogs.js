export const Hotdogs = {
	sceneName: "Hotdogs",
	themeFile: "clips/hotdogs/theme_7_80_12.mp3",
	themeVolume: 1,
	endFile: 'clips/hotdogs/end.mp3',
	firstDrawing: "drawings/hotdogs/empty.json",
	firstSides: [0,1,4,5],
	lastDrawing: "drawings/hotdogs/big_dogs.json",
	lastSides: [0,1,2,3,4,5],
	dialogs: [
		{ track: "clips/hotdogs/0.mp3",	 anim: "drawings/hotdogs/beach.json", sides: [0,1,4,5], delay: 7000, end: 4000 },
		{ track: "clips/hotdogs/1.mp3",	 anim: "drawings/hotdogs/mustard_3.json", sides: [0, 1, 4, 5], delay: 4000, end: 4000 },
		{ track: "clips/hotdogs/2.mp3",	 anim: "drawings/hotdogs/cat_jesus_windows.json", sides: [0, 1], delay: 4000, end: 3000 },
		{ track: "clips/hotdogs/3.mp3",	 anim: "drawings/hotdogs/heavenhell.json", sides: [0, 1, 4, 5], delay: 3000, end: 3000},
		{ track: "clips/hotdogs/4.mp3",	 anim: "drawings/hotdogs/liens.json", sides: [1, 2, 3], delay: 3000, end: 4000 },
		{ track: "clips/hotdogs/5.mp3",  anim: "drawings/hotdogs/moon.json", sides: [0, 1, 2, 4, 5], delay: 3000, end: 5000 },
		{ track: "clips/hotdogs/6.mp3",	 anim: "drawings/hotdogs/bite.json", sides: [0, 1, 2, 3, 4, 5], delay: 3000, end: 3000 },
		{ track: "clips/hotdogs/7.mp3",	 anim: "drawings/hotdogs/get_a_dog.json", sides: [0, 1, 4, 5], delay: 7000, end: 3000 },
		{ track: "clips/hotdogs/8.mp3",	 anim: "drawings/hotdogs/cat_hotdog_angel.json", sides: [0, 1, 3, 4, 5], delay: 3000, end: 4000 },
		{ track: "clips/hotdogs/9.mp3",	 anim: "drawings/hotdogs/big_dogs.json", sides: [0, 1, 2, 3, 4, 5], delay: 3000, end: 3000 },
		{ track: "clips/hotdogs/10.mp3", anim: "drawings/hotdogs/spinning.json", sides: [0, 1, 2, 3, 4, 5], delay: 3000, end: 3000 },
		{ track: "clips/hotdogs/11.mp3", anim: "drawings/hotdogs/cat_adam_and_eve.json", sides: [0, 1, 4, 5], delay: 5000, end: 3000 },
		{ track: "clips/hotdogs/12.mp3", anim: "drawings/hotdogs/hell_hotdog.json", sides: [0, 1, 4, 5], delay: 3000, end: 7000 },
		{ track: "clips/hotdogs/13.mp3", anim: "drawings/hotdogs/cracks_2.json", sides: [0, 1, 4, 5], delay: 3000, end: 5000 }
	],
	model: "models/hotdogs/char_toon.gltf",
	durations: { 
		'Idle - 1': 24,
		'Idle - 2 - Tought': 101,
		'Idle - 3 - Lying Down': 45,
		'Idle - 4 - Shaking': 41,
		'Idle - 5 - Get Down': 29,
		'Walk  - 1': 40,
		'Walk - 2': 40,
		'Walk - 3': 40,
		'Walk - 4': 40,
		'Talk - 1': 43,
		'Talk - 2': 54,
		'Talk - 3': 32,
		'Talk - 4': 27
	},
	types: {
		idle: ['Idle - 2 - Tought', 'Idle - 1', 'Idle - 3 - Lying Down', 'Idle - 4 - Shaking', 'Idle - 5 - Get Down'],
		walk: ['Walk  - 1', 'Walk - 2', 'Walk - 3', 'Walk - 4'],
		talk: ['Talk - 1', 'Talk - 2', 'Talk - 3', 'Talk - 4']
	},
	charSpeed: { min: 0.02, max: 0.03 },
	cameraSpeed: 0,
	camera: {
		speed: { x: 0, y: 0, z: 0},
		position: { x: 0, y: 0, z: 5}
	},
	charPosition: { x: 0, y: -3, z: -2 },
	androidPosition: { x: 4, y: -3, z: -4 },
	startIndex: 1,
	endAnim: [1,2,3,4],
	lookChance: 0
};