import * as THREE from './jsm/three.module.js';
import { DeviceOrientationControls } from './jsm/DeviceOrientationControls.js';
import { OutlineEffect } from './jsm/OutlineEffect.js';
import { GLTFLoader } from './jsm/GLTFLoader.js';

import { Funeral } from './jsm/Funeral.js';
import { Hotdogs } from './jsm/Hotdogs.js';
import { Trampoline } from './jsm/Trampoline.js';

let currentScene;

const blocker = document.getElementById( 'blocker' );
const startButton = document.getElementById( 'start-button' );
const instructions = document.getElementById( 'instructions' );
const scenes = document.getElementById( 'scenes' );
const loading = document.getElementById( 'loading' );
const tap = document.getElementById( 'tap' );
const theEnd = document.getElementById( 'the-end' );
const part1Button = document.getElementById( 'part1-button' );
const part2Button = document.getElementById( 'part2-button' );
const part3Button = document.getElementById( 'part3-button' );

part1Button.addEventListener( 'touchend', chooseScene, false );
part1Button.addEventListener( 'click', chooseScene, false );
part2Button.addEventListener( 'touchend', chooseScene, false );
part2Button.addEventListener( 'click', chooseScene, false );
part3Button.addEventListener( 'touchend', chooseScene, false );
part3Button.addEventListener( 'click', chooseScene, false );

tap.addEventListener( 'touchend', start, false );
tap.addEventListener( 'click', start, false );

startButton.onclick = init;


let bgMusic, bgLoader;
let bgMusicLoaded = false;
let restart = false;
let firstChapter = true;

// this is part of data
let idles = [];
let walks = [];
let talks = [];

/* sides  0 front  1 back  2 top  3 bottom  4 right  5 left*/
const startDelay = 4000;
const endDelay = 4000;

let currentDialog = 0;
let time;
let nextClip = true;

var lines = document.getElementById('lines');
let width = window.innerWidth, height = window.innerHeight; 
let linesPlayer = new LinesPlayer(lines);
linesPlayer.isTexture = true;
let planes = [];

let phoneLines = new LinesPlayer(document.getElementById('phone'), 'drawings/phone.json');

let camera, scene, renderer, controls, cameraOffset, origin;
let linesTexture; /* texture gets updated */
let clock, mixer;
let listener, voiceSound, voiceSource, audioLoader;
let effect;
let loader;

let char, model;

let fuckingAndroid = navigator.userAgent.toLowerCase().includes("android");

document.getElementById('launch-touch').onclick = launchTouch;
let touchControls = false;
function launchTouch() {
	touchControls = true;
	launch();
}

function launch() {
	scenes.classList.remove('hidden');
	instructions.innerHTML = "Headphones recommended." 
	if (!touchControls) instructions.innerHTML += "<br> Rotate phone to view.";
	if (document.getElementById('phone')) document.getElementById('phone').style.display = 'block';
	if (document.getElementById('desktop')) document.getElementById('desktop').remove();
}

function init() {

	startButton.remove();

	clock = new THREE.Clock();
	scene = new THREE.Scene();

	

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);
	
	effect = new OutlineEffect( renderer, {
		defaultThickNess: 1,
		defaultColor: new THREE.Color( 0xffffff )
	});

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
	cameraOffset = camera.position.clone();
	/* if device access granted, launch, else show touch controls button */
	const events = {
		onControlsGranted() {
			launch();
		},
		onControlsDenied() {
			document.getElementById('desktop').style.opacity = 1;
		},
		onCheckDevice() {
			document.getElementById('desktop').style.opacity = 1;

			function onMotion(ev) {
				window.removeEventListener('devicemotion', onMotion, false);
				if (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma) {
					if (document.getElementById('desktop')) 
						document.getElementById('desktop').style.opacity = 0;
					launch();
				}
			}
			window.addEventListener('devicemotion', onMotion, false);
		}
	}

	controls = new DeviceOrientationControls( camera, events );

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
	

	/* blender */
	mixer = new THREE.AnimationMixer( scene );
	loader = new GLTFLoader();
}

function loadModel(callback) {
	loader.load(currentScene.model, gltf => {

		// console.log( gltf );
		idles = [];
		walks = [];
		talks = [];

		model = gltf.scene.children[0];
		model.animations = gltf.animations;
		for (let i = 0; i < model.animations.length; i++) {
			const n = model.animations[i].name;
			model.animations[i].duration = 1000 / 24 * currentScene.durations[n] / 1000;
			if (currentScene.types.idle.includes( n )) {
				idles.push( i );
			} else if (currentScene.types.walk.includes( n )) {
				walks.push( i );
			} else if (currentScene.types.talk.includes( n )) {
				talks.push( i );
			}
		}

		

		model.position.set( 
			currentScene.charPosition.x, 
			currentScene.charPosition.y,
			currentScene.charPosition.z 
		);
		model.scale.set( 0.5, 0.5, 0.5 );
		model.xSpeed = 0;
		model.zSpeed = 0;
		model.add( voiceSound );
		callback();
	});
}

function chooseScene(ev) {
	theEnd.style.display = 'none';

	if (ev.target.dataset.part == 1) currentScene = Hotdogs;
	if (ev.target.dataset.part == 2) currentScene = Trampoline;
	if (ev.target.dataset.part == 3) currentScene = Funeral;

	bgMusic.setVolume( currentScene.themeVolume );
	bgLoader.load(currentScene.themeFile, buffer => {
		bgMusicLoaded = true;
		bgMusic.setBuffer( buffer );
		bgMusic.setLoop( true );
	});

	loading.style.display = 'block';
	scenes.classList.add('hidden');
	// set current scene
	loadModel(startScene);
}

function startScene() {
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
		// startButton.textContent = "Tap to play";
		loading.style.display = 'none';
		tap.style.display = 'inline-block';
	}
}

/* start scene after loading or restart */
function start() {

	scene.remove( char );
	char = model;
	scene.add( char );
	origin = char.position.clone();
	mixer.clipAction( model.animations[currentScene.startIndex], model ).play();

	tap.style.display = 'none';
	document.body.style.overflow = 'hidden';
	// fullscreen();
	
	camera.position.x = currentScene.camera.position.x;
	camera.position.y = currentScene.camera.position.y;
	camera.position.z = currentScene.camera.position.z;
	cameraOffset = camera.position.clone();
	
	// change orientation for android
	if (fuckingAndroid) {
		scene.rotation.set( 0, -Math.PI/2, 0 );
		char.position.set( 
			currentScene.androidPosition.x, 
			currentScene.androidPosition.y, 
			currentScene.androidPosition.z 
		);
		cameraOffset.x -= char.position.x;
		cameraOffset.z -= char.position.z;
	} else {
		camera.rotation.set( 0, 0, 0 );
	}

	currentDialog = 0;
	currentScene.dialogs.map(d => d.start = 0);
	
	if (bgMusic.isPlaying) bgMusic.stop();

	bgLoader.load(currentScene.themeFile, buffer => {
		// bgMusic.stop();
		bgMusic.isPlaying = false;		
		bgMusic.setBuffer( buffer );
		bgMusic.setLoop( true );
		bgMusic.setVolume( currentScene.themeVolume );
		if (!bgMusic.isPlaying) bgMusic.play();
	});

	nextClip = true;
	time = performance.now() + startDelay; /* beginning delay */

	blocker.style.display = 'none';
	blocker.style.opacity = 0;
	
	linesPlayer.load(currentScene.firstDrawing, () => {
		planes.map((p, i) => p.visible = currentScene.firstSides.includes(i));
		linesPlayer.ctx.lineWidth = 2;
	});

	
	if (firstChapter) {
		if (touchControls) setupTouchControls();
		animate();

		/* for mobile audio  to work  */
		const source = listener.context.createBufferSource();
		source.connect(listener.context.destination);
		source.start();
		if (document.getElementById('phone'))
			document.getElementById('phone').remove();
	}
	firstChapter = false;
}

function talk( dialog ) {
	nextClip = false;
	char.xSpeed = 0;
	char.zSpeed = 0;

	camera.ySpeed = Cool.random(-currentScene.cameraSpeed, currentScene.cameraSpeed);

	if (Math.random() < currentScene.lookChance) {
		const lookVec = new THREE.Vector3( camera.position.x, char.position.y, camera.position.z );
		char.lookAt( lookVec );
	}
	
	linesPlayer.load(dialog.anim, () => {
		// turn on dialog.sides, off others
		planes.map((p, i) => p.visible = dialog.sides.includes(i));
		linesPlayer.ctx.lineWidth = 2;
	});
	audioLoader.load( dialog.track, function(buffer) {
		voiceSound.setBuffer(buffer);
		voiceSound.setRefDistance(20);
		voiceSound.play();
	});
	mixer.stopAllAction();
	const talk = Cool.random(talks); //  talks[Math.floor(Math.random() * talks.length)];
	mixer.clipAction(char.animations[talk], char).play();

	voiceSound.onEnded = function() {
		voiceSound.isPlaying = false;
		time = performance.now() + dialog.end;
		walk();
		const nextIndex = currentScene.dialogs.indexOf(dialog) + 1;
		if (nextIndex < currentScene.dialogs.length ) {
			currentDialog = nextIndex;
			nextClip = true;
		} else {
			setTimeout(end, endDelay);
		}
	};
}

function walk( isWalk ) {
	mixer.stopAllAction();
	if (Math.random() > 0.3 || isWalk) {
		const walk = Cool.random(walks); // walks[Math.floor(Math.random() * walks.length)];
		mixer.clipAction(char.animations[walk], char).play();
		if (char.position.distanceTo(origin) > 10) {
			char.xSpeed = char.position.x > origin.x ? Cool.random(-currentScene.charSpeed.min, 0) : Cool.random(0, currentScene.charSpeed.min);
			char.zSpeed = char.position.z > origin.z ? Cool.random(-currentScene.charSpeed.min, 0) : Cool.random(0, currentScene.charSpeed.min);
		} else {
			char.xSpeed = Cool.random(-currentScene.charSpeed.min, currentScene.charSpeed.min);
			char.zSpeed = Cool.random(-currentScene.charSpeed.min, currentScene.charSpeed.min);
		}
		camera.ySpeed = 0;
		const vec = new THREE.Vector3(
			char.position.x + char.xSpeed, 
			char.position.y,
			char.position.z + char.zSpeed
		);
		char.lookAt(vec);
	} else {
		const idle = Cool.random(idles); // idles[Math.floor(Math.random() * idles.length)];
		mixer.clipAction(char.animations[idle], char).play();
	}
}

function end() {
	bgLoader.load(currentScene.endFile, function(buffer) {
		bgMusic.stop();
		bgMusic.isPlaying = false;
		bgMusic.setBuffer( buffer );
		bgMusic.setLoop( false );
		bgMusic.setVolume( 1 );
		bgMusic.play();
	});
	setTimeout(function() { 
		// exitFullscreen();
		restart = true;
		nextClip = false;

		blocker.style.display = 'block';
		blocker.style.opacity = 1;
		scenes.classList.remove('hidden');
		theEnd.style.display = 'block';
		
		mixer.stopAllAction();
		
		const endAnim = Cool.random(currentScene.endAnim); // what do these map to?
		mixer.clipAction(char.animations[endAnim], char).play();
		char.xSpeed = 0;
		char.zSpeed = 0;
		linesPlayer.load(currentScene.lastDrawing, () => {
			// turn on dialog.sides, off others
			planes.map((p, i) => p.visible = currentScene.lastSides.includes(i));
			linesPlayer.ctx.lineWidth = 2;
		});
	}, 4000);
}

/* 0: delay, 1: play, 2: end */
function animate() {
	/* audio clips */
	// console.log(nextClip);
	if (performance.now() > time && nextClip) {
		let dialog = currentScene.dialogs[currentDialog];
		if (dialog.start == 1) {
			talk( dialog );
		} else {
			if (currentDialog == 0)
				walk( true );
			dialog.start = 1;
			time += dialog.delay;
			// walk();
		}
		// console.log(dialog);
	}

	requestAnimationFrame( animate );
	linesTexture.needsUpdate = true;
	linesPlayer.draw();
	mixer.update( clock.getDelta() );

	char.position.x += char.xSpeed;
	char.position.z += char.zSpeed;

	camera.position.x = char.position.x + cameraOffset.x;
	camera.position.z = char.position.z + cameraOffset.z;

	camera.position.y += currentScene.cameraSpeed;

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
	// location.reload(); // easier for now
	// if (document.hidden && !bgMusic.paused) {
	// 	bgMusic.pause();
	// 	voiceSound.pause();
	// } else if (!document.hidden && bgMusic.paused) {
	// 	bgMusic.play();
	// 	voiceSound.play();
	// }
});