export const Funeral = {
	sceneName: "Funeral",
	themeFile: 'clips/funeral/theme_80.mp3',
	themeVolume: 0.25,
	endFile: 'clips/funeral/end_80.mp3',
	firstDrawing: 'drawings/funeral/intro.json',
	firstSides: [0, 1, 2, 3, 4, 5],
	lastDrawing: 'drawings/funeral/end.json',
	lastSides: [0,1,4,5],
	dialogs: [
		{ track: "clips/funeral/0.mp3",	 anim: "drawings/funeral/bus.json", 
			sides: [0], 
			delay: 2000, end: 2000 },
		{ track: "clips/funeral/1.mp3",	 anim: "drawings/funeral/line.json", 
			sides: [0, 1, 4, 5], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/2.mp3",	 anim: "drawings/funeral/talking.json", 
			sides: [0, 4], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/3.mp3",	 anim: "drawings/funeral/option.json", 
			sides: [3], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/4.mp3",	 anim: "drawings/funeral/web.json", 
			sides: [1, 5], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/5.mp3",	 anim: "drawings/funeral/broc.json", 
			sides: [0, 1, 2, 3, 4, 5], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/6.mp3",	 anim: "drawings/funeral/hell.json", 
			sides: [0, 1, 4, 5], 
			delay: 4000, end: 2000 },
		{ track: "clips/funeral/7.mp3",	 anim: "drawings/funeral/glasses.json", 
			sides: [4, 5], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/8.mp3",	 anim: "drawings/funeral/mother.json", 
			sides: [0, 1], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/9.mp3",	 anim: "drawings/funeral/lobster.json", 
			sides: [3], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/10.mp3",	 anim: "drawings/funeral/quiet.json", 
			sides: [3], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/11.mp3",	 anim: "drawings/funeral/kill.json", 
			sides: [5], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/12.mp3",	 anim: "drawings/funeral/molecule.json", 
			sides: [0, 1, 2, 3, 4, 5], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/13.mp3",	 anim: "drawings/funeral/buttons.json", 
			sides: [0], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/14.mp3",	 anim: "drawings/funeral/casket.json", 
			sides: [1], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/15.mp3",	 anim: "drawings/funeral/face.json", 
			sides: [1], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/16.mp3",	 anim: "drawings/funeral/orbit.json", 
			sides: [0, 1, 2, 4, 5], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/17.mp3",	 anim: "drawings/funeral/pigs.json", 
			sides: [0, 1, 2, 3, 4, 5], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/18.mp3",	 anim: "drawings/funeral/mouth.json", 
			sides: [0], 
			delay: 4000, end: 4000 },
		{ track: "clips/funeral/19.mp3",	 anim: "drawings/funeral/ride.json", 
			sides: [4], 
			delay: 4000, end: 4000 }
	],
	model: "models/funeral/char_arm.gltf",
	durations: { "BDuckRoll": 44, "BRight": 30, "BTalk": 100, "BTalk3": 60, "BIdle3": 183, "BWalk": 117, "BJump": 90, "BIdle4": 53, "BTalk4": 60, "BTalk2": 60, "BNewWalkLook": 300, "BLeft": 30, "BIdle": 300, "BTalk5": 60, "BIdle2": 113, "BDeath": 300, "BIdle5": 156 },
	types: {
		idle: ['BIdle', 'BIdle2', 'BIdle3', 'BIdle4', 'BIdle5'],
		walk: ['BWalk', 'BDuckRoll', 'BRight', 'BLeft', 'BJump', 'BNewWalkLook'],
		talk: ['BTalk', 'BTalk2', 'BTalk3', 'BTalk4', 'BTalk5']
	},
	charSpeed: { min: 0.05, max: 0.1 },
	cameraSpeed: 0,
	camera: {
		speed: { x: 0, y: 0, z: 0},
		position: { x: 0, y: 0, z: 5}
	},
	charPosition: { x: 0, y: -5, z: -2 },
	androidPosition: { x: 4, y: -5, z: -4 },
	startIndex: 1,
	endAnim: [3, 6, 8],
	lookChance: 0.5
};
