import * as THREE from './jsm/three.module.js';
import { DeviceOrientationControls } from './jsm/DeviceOrientationControls.js';
import { OutlineEffect } from './jsm/OutlineEffect.js';
import { GLTFLoader } from './jsm/GLTFLoader.js';

const blocker = document.getElementById( 'blocker' );
const startButton = document.getElementById( 'start-button' );
const initButton = document.getElementById( 'init-button' );
const instructions = document.getElementById( 'instructions' );
let bgMusic, bgLoader;
let bgMusicLoaded = false;
const themeFile = 'clips/theme_80.mp3', endFile = 'clips/end_80.mp3';

let restart = false;

const idles = [];
const walks = [];
const talks = [];
let deathIndex;

/* sides  0 front  1 back  2 top  3 bottom  4 right  5 left*/
const firstDrawing = 'drawings/intro.json';
const lastDrawing = 'drawings/end.json';
const dialogs = [
	{ track: "clips/0.mp3",	 anim: "drawings/bus.json", 
		sides: [0], 
		delay: 2000, end: 2000 },
	{ track: "clips/1.mp3",	 anim: "drawings/line.json", 
		sides: [0, 1, 4, 5], 
		delay: 4000, end: 4000 },
	{ track: "clips/2.mp3",	 anim: "drawings/talking.json", 
		sides: [0, 4], 
		delay: 4000, end: 4000 },
	{ track: "clips/3.mp3",	 anim: "drawings/option.json", 
		sides: [3], 
		delay: 4000, end: 4000 },
	{ track: "clips/4.mp3",	 anim: "drawings/web.json", 
		sides: [1, 5], 
		delay: 4000, end: 4000 },
	{ track: "clips/5.mp3",	 anim: "drawings/broc.json", 
		sides: [0, 1, 2, 3, 4, 5], 
		delay: 4000, end: 4000 },
	{ track: "clips/6.mp3",	 anim: "drawings/hell.json", 
		sides: [0, 1, 4, 5], 
		delay: 4000, end: 2000 },
	{ track: "clips/7.mp3",	 anim: "drawings/glasses.json", 
		sides: [4, 5], 
		delay: 4000, end: 4000 },
	{ track: "clips/8.mp3",	 anim: "drawings/mother.json", 
		sides: [0, 1], 
		delay: 4000, end: 4000 },
	{ track: "clips/9.mp3",	 anim: "drawings/lobster.json", 
		sides: [3], 
		delay: 4000, end: 4000 },
	{ track: "clips/10.mp3",	 anim: "drawings/quiet.json", 
		sides: [3], 
		delay: 4000, end: 4000 },
	{ track: "clips/11.mp3",	 anim: "drawings/kill.json", 
		sides: [5], 
		delay: 4000, end: 4000 },
	{ track: "clips/12.mp3",	 anim: "drawings/molecule.json", 
		sides: [0, 1, 2, 3, 4, 5], 
		delay: 4000, end: 4000 },
	{ track: "clips/13.mp3",	 anim: "drawings/buttons.json", 
		sides: [0], 
		delay: 4000, end: 4000 },
	{ track: "clips/14.mp3",	 anim: "drawings/casket.json", 
		sides: [1], 
		delay: 4000, end: 4000 },
	{ track: "clips/15.mp3",	 anim: "drawings/face.json", 
		sides: [1], 
		delay: 4000, end: 4000 },
	{ track: "clips/16.mp3",	 anim: "drawings/orbit.json", 
		sides: [0, 1, 2, 4, 5], 
		delay: 4000, end: 4000 },
	{ track: "clips/17.mp3",	 anim: "drawings/pigs.json", 
		sides: [0, 1, 2, 3, 4, 5], 
		delay: 4000, end: 4000 },
	{ track: "clips/18.mp3",	 anim: "drawings/mouth.json", 
		sides: [0], 
		delay: 4000, end: 4000 },
	{ track: "clips/19.mp3",	 anim: "drawings/ride.json", 
		sides: [4], 
		delay: 4000, end: 4000 }
];
const startDelay = 4000;
const endDelay = 4000;

const durations = { "BDuckRoll": 44, "BRight": 30, "BTalk": 100, "BTalk3": 60, "BIdle3": 183, "BWalk": 117, "BJump": 90, "BIdle4": 53, "BTalk4": 60, "BTalk2": 60, "BNewWalkLook": 300, "BLeft": 30, "BIdle": 300, "BTalk5": 60, "BIdle2": 113, "BDeath": 300, "BIdle5": 156 };

const types = {
	idle: ['BIdle', 'BIdle2', 'BIdle3', 'BIdle4', 'BIdle5'],
	walk: ['BWalk', 'BDuckRoll', 'BRight', 'BLeft', 'BJump', 'BNewWalkLook'],
	talk: ['BTalk', 'BTalk2', 'BTalk3', 'BTalk4', 'BTalk5']
};

let currentDialog = 0;
let time;
let nextClip = true;

var lines = document.getElementById('lines');
let width = window.innerWidth, height = window.innerHeight; 
let linesPlayer = new LinesPlayer(lines);
linesPlayer.isTexture = true;
let planes = [];

let phoneLines = new LinesPlayer(document.getElementById('phone'));
phoneLines.loadAnimation('drawings/phone.json');

let camera, scene, renderer, controls, cameraOffset, origin;
let linesTexture; /* texture gets updated */
let clock, mixer;
let listener, voiceSound, voiceSource, audioLoader;
let effect;

let charAxes;
let char;
window.char = char;
const charSpeed = { min: 0.05, max: 0.1 };
const cameraSpeed = 0.0001;

/* check for touch parameter*/
document.getElementById('launch-touch').onclick = launchTouch;
let touchControls = false;
function launchTouch() {
	touchControls = true;
	launch();
}



document.getElementById('init-button').onclick = init;

// better than mobile check, includes ipad
// function onMotion( ev ) {
// 	window.removeEventListener('devicemotion', onMotion, false);
// 	if (ev.acceleration.x != null || ev.accelerationIncludingGravity.x != null) {
// 		if (!touchControls) launch();
// 	}
// }
// window.addEventListener('devicemotion', onMotion, false);
	


function launch() {

	startButton.style.display = "inline-block";
	instructions.innerHTML = "Headphones recommended." 
	if (!touchControls) instructions.innerHTML += "<br> Rotate phone to view.";
	document.getElementById('phone').style.display = 'block';
	if (document.getElementById('desktop')) document.getElementById('desktop').remove();
}

function init() {

	initButton.remove();


	clock = new THREE.Clock();
	scene = new THREE.Scene();

	// change orientation for android
	if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
		scene.rotation.set( 0, -Math.PI/2, 0 );
		// scene.position.set( 5, 0, 5 ); // match camera offset
	}

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);
	
	effect = new OutlineEffect( renderer, {
		defaultThickNess: 1,
		defaultColor: new THREE.Color( 0xffffff )
	});

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
	
	/* if device access granted, launch, else show touch controls button */
	window.onControlsGranted = function() {
		launch();
	};

	window.onControlsDenied = function() {
		document.getElementById('desktop').style.opacity = 1; 
	};

	controls = new DeviceOrientationControls( camera );

	camera.position.z = 5;
	camera.position.y = 0;
	cameraOffset = camera.position.clone();


	/* outside lines */
	lines.width =  1024;
	lines.height = 1024;
	linesTexture = new THREE.Texture(lines);
	const linesMaterial = new THREE.MeshBasicMaterial({ map:linesTexture, transparent: true, side: THREE.DoubleSide });
	const sz = 40;
	const sides = [ /* relative x,y,z pos, rotation*/
		[0, 0,-1, 0, 0, 0], /* front face */
		[0, 0, 1, 0, Math.PI, 0], /* back face */
		
		[0, 1, 0, Math.PI/2, 0, 0], /* top face */
		[0,-1, 0, -Math.PI/2, 0, 0], /*  bottom face */

		[1, 0, 0, 0, -Math.PI/2, 0], /* right face */
		[-1,0, 0, 0, Math.PI/2, 0] /* left face */
	];

	for (let i = 0; i < sides.length; i++) {
		const side = sides[i];
		const planeGeo = new THREE.PlaneGeometry( sz * 2, sz * 2, i + 1 );
		const planeMesh = new THREE.Mesh( planeGeo, linesMaterial );
		planeMesh.position.set( side[0] * sz, side[1] * sz, side[2] * sz );
		planeMesh.rotation.set( side[3], side[4], side[5] );
		scene.add( planeMesh );
		planes.push( planeMesh );
	}

	listener = new THREE.AudioListener();
	camera.add( listener );
	audioLoader = new THREE.AudioLoader();
	voiceSound = new THREE.PositionalAudio( listener );
	bgLoader = new THREE.AudioLoader();
	bgMusic = new THREE.Audio( listener );
	bgMusic.setVolume( 0.25 );

	/* blender */
	mixer = new THREE.AnimationMixer( scene );
	const loader = new GLTFLoader();
	loader.load("models/char_arm.gltf", gltf => {

		// console.log( gltf );

		char = gltf.scene.children[0];
		char.animations = gltf.animations;
		for (let i = 0; i < char.animations.length; i++) {
			const n = char.animations[i].name;
			char.animations[i].duration = 1000 / 24 * durations[n] / 1000;
			if (types.idle.indexOf( n ) != -1) {
				idles.push( i );
			} else if (types.walk.indexOf( n ) != -1) {
				walks.push( i );
			} else if (types.talk.indexOf( n ) != -1) {
				talks.push( i );
			} else {
				deathIndex = i;
			}
		}
		
		// change orientation for android
		if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
			char.position.set( 4, -5, -4 );
			// char.rotation.set( 0, -Math.PI/2, 0 );
			cameraOffset.x -= char.position.x;
			cameraOffset.z -= char.position.z;
		} else {
			char.position.set( 0, -5, -2 );
		}

		char.scale.set( 0.5, 0.5, 0.5 );
		char.xSpeed = 0;
		char.zSpeed = 0;
		char.add( voiceSound );
		mixer.clipAction( char.animations[deathIndex], char ).play();
		scene.add( char );
		origin = char.position.clone();

		let bgInterval;
		if (bgMusicLoaded) ready();
		else {
			bgInterval = setInterval(function() {
				if (bgMusicLoaded) {
					clearInterval(bgInterval);
					ready();
				}
			}, 1000 / 60);
		}

		function ready() {
			startButton.textContent = "Tap to play";
			startButton.addEventListener( 'touchend', start, false );
			startButton.addEventListener( 'click', start, false );
		}

		console.log(char);
	});

	bgLoader.load(themeFile, buffer => {
		bgMusicLoaded = true;
		bgMusic.setBuffer( buffer );
		bgMusic.setLoop( true );
	});
}

function start() {
	document.body.style.overflow = 'hidden';
	// fullscreen();
	if (document.getElementById('phone'))
		document.getElementById('phone').remove();
	if (touchControls) setupTouchControls();

	if (restart) {
		currentDialog = 0;
		dialogs.map((d) => d.start = 0);
		nextClip = true;
		bgLoader.load(themeFile, buffer => {
			bgMusic.stop();
			bgMusic.isPlaying = false;		
			bgMusic.setBuffer( buffer );
			bgMusic.setLoop( true );
			bgMusic.setVolume( 0.25 );
			if (!bgMusic.isPlaying) bgMusic.play();
		});
	} else {
		bgMusic.loop = true;
	}

	if (!bgMusic.isPlaying) {
		bgMusic.play();
		animate(); // start actual animation
		time = performance.now() + startDelay; /* beginning delay */
	}

	blocker.style.display = 'none';
	
	linesPlayer.loadAnimation(firstDrawing, () => {
		planes.map((p, i) => [0, 1, 2, 3, 4, 5].indexOf(i) != -1 ? p.visible = true : p.visible = false);
		linesPlayer.ctx.lineWidth = 2;
	});

	/* for mobile to work  */
	const source = listener.context.createBufferSource();
	source.connect(listener.context.destination);
	source.start();
}

function talk( dialog ) {
	nextClip = false;
	char.xSpeed = 0;
	char.zSpeed = 0;

	if (Math.random() > 0.5) {
		const lookVec = new THREE.Vector3( camera.position.x, char.position.y, camera.position.z );
		char.lookAt( lookVec );
	}
	
	linesPlayer.loadAnimation(dialog.anim, () => {
		// turn on dialog.sides, off others
		planes.map((p, i) => dialog.sides.indexOf(i) != -1 ? p.visible = true : p.visible = false);
		linesPlayer.ctx.lineWidth = 2;
	});
	audioLoader.load( dialog.track, function(buffer) {
		voiceSound.setBuffer(buffer);
		voiceSound.setRefDistance(20);
		voiceSound.play();
	});
	mixer.stopAllAction();
	const talk = talks[Math.floor(Math.random() * talks.length)];
	mixer.clipAction(char.animations[talk], char).play();

	voiceSound.onEnded = function() {
		voiceSound.isPlaying = false;
		time = performance.now() + dialog.end;
		walk();
		nextClip = true;
		const nextIndex = dialogs.indexOf(dialog) + 1;
		if (nextIndex < dialogs.length)
			currentDialog = nextIndex;
		else
			setTimeout(end, endDelay);
	};
}

function walk( isWalk ) {
	mixer.stopAllAction();
	if (Math.random() > 0.3 || isWalk) {
		const walk = walks[Math.floor(Math.random() * walks.length)];
		mixer.clipAction(char.animations[walk], char).play();
		if (char.position.distanceTo(origin) > 10) {
			char.xSpeed = char.position.x > origin.x ? Cool.random(-charSpeed.min, 0) : Cool.random(0, charSpeed.min);
			char.zSpeed = char.position.z > origin.z ? Cool.random(-charSpeed.min, 0) : Cool.random(0, charSpeed.min);
		} else {
			char.xSpeed = Cool.random(-charSpeed.min, charSpeed.min);
			char.zSpeed = Cool.random(-charSpeed.min, charSpeed.min);
		}
		const vec = new THREE.Vector3(
			char.position.x + char.xSpeed, 
			char.position.y,
			char.position.z + char.zSpeed
		);
		char.lookAt(vec);
	} else {
		const idle = idles[Math.floor(Math.random() * idles.length)];
		mixer.clipAction(char.animations[idle], char).play();
	}
}

function end() {
	bgLoader.load(endFile, function(buffer) {
		bgMusic.stop();
		bgMusic.isPlaying = false;
		bgMusic.setBuffer( buffer );
		bgMusic.setLoop( false );
		bgMusic.setVolume( 1 );
		bgMusic.play();
	});
	setTimeout(function() { 
		exitFullscreen();
		restart = true;
		nextClip = false;
		blocker.style.display = 'block';
		instructions.style.display = 'block';
		startButton.textContent = "Tap to play again";
		instructions.textContent = "The End";
		document.getElementById("hotdogs-link").style.display = "block";
		mixer.stopAllAction();
		const endAnim = [3, 6, 8][Cool.randomInt(0,2)];
		mixer.clipAction(char.animations[endAnim], char).play();
		char.xSpeed = 0;
		char.zSpeed = 0;
		linesPlayer.loadAnimation(lastDrawing, () => {
			// turn on dialog.sides, off others
			planes.map((p, i) => [0,1,4,5].indexOf(i) != -1 ? p.visible = true : p.visible = false);
			linesPlayer.ctx.lineWidth = 2;
		});
	}, 2000);
}

/* 0: delay, 1: play, 2: end */
function animate() {
	/* audio clips */
	if (performance.now() > time && nextClip) {
		let dialog = dialogs[currentDialog];
		if (dialog.start == 1) {
			talk( dialog );
		} else {
			if (currentDialog == 0)
				walk( true );
			dialog.start = 1;
			time += dialog.delay;
			// walk();
		}
	}

	requestAnimationFrame( animate );
	linesTexture.needsUpdate = true;
	linesPlayer.draw();
	mixer.update( clock.getDelta() );

	char.position.x += char.xSpeed;
	char.position.z += char.zSpeed;
	camera.position.x = char.position.x + cameraOffset.x;
	camera.position.z = char.position.z + cameraOffset.z;

	camera.position.y += cameraSpeed;

	if (!touchControls) controls.update();
	// renderer.render(scene, camera);
	effect.render( scene, camera );
}

function onWindowResize() { 
	width = document.documentElement.clientWidth;
	height = document.documentElement.clientHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(width, height);
}
window.addEventListener( 'resize', onWindowResize, false );

function fullscreen() {
	if (renderer.domElement.requestFullscreen) {
		renderer.domElement.requestFullscreen();
	} else if (renderer.domElement.msRequestFullscreen) {
		renderer.domElement.msRequestFullscreen();
	} else if (renderer.domElement.mozRequestFullScreen) {
		renderer.domElement.mozRequestFullScreen();
	} else if (renderer.domElement.webkitRequestFullscreen) {
		renderer.domElement.webkitRequestFullscreen();
	}
}

function exitFullscreen() {
	document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
	if (document.exitFullscreen) document.exitFullscreen();
}

function setupTouchControls() {
	renderer.domElement.addEventListener("touchstart", handleStart);
	renderer.domElement.addEventListener("touchmove", handleMove);
}

const touch = {};
function handleStart(ev) {
	ev.preventDefault();
	touch.x = ev.touches[0].clientX;
	touch.y = ev.touches[0].clientY;
}
function handleMove(ev) {
	ev.preventDefault();
	const delta = {
		x: ev.touches[0].clientX - touch.x,
		y: ev.touches[0].clientY - touch.y
	};
	camera.rotation.y += Cool.map(delta.x, -width/2, width/2, -Math.PI/4, Math.PI/4);
	camera.rotation.x += Cool.map(delta.y, -height/2, height/2, -Math.PI/4, Math.PI/4);
	touch.x = ev.touches[0].clientX;
	touch.y = ev.touches[0].clientY;
}

document.addEventListener( 'visibilitychange', ev => {
	location.reload(); // easier for now
	// if (document.hidden && !bgMusic.paused) {
	// 	bgMusic.pause();
	// 	voiceSound.pause();
	// } else if (!document.hidden && bgMusic.paused) {
	// 	bgMusic.play();
	// 	voiceSound.play();
	// }
});