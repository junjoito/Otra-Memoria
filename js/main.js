import * as THREE from './THREEJS/three.module.js';

import { FirstPersonControls } from './THREEJS/FirstPersonControls.js';

let camera, orbit, controls, scene, renderer, light;

let cube1, cube2, cube3;

let control;

let analyser1, analyser2, analyser3;

const clock = new THREE.Clock();

const startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );

function init() {

    const overlay = document.getElementById( 'overlay' );
	overlay.remove();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 35, 0 );

	const listener = new THREE.AudioListener();
	camera.add( listener );

	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2( 0x161616, 0.0005 );

	const loader = new THREE.TextureLoader();
    loader.load("img/backgraund.jpg",function(texture){
        scene.background = texture;
    });

				//light = new THREE.DirectionalLight( 0x161616 );
				//light.position.set( 0, 0.5, 1 ).normalize();
				//scene.add( light );

	const sphere = new THREE.BoxGeometry( 60, 60, 60 );

	const orbe = new THREE.SphereGeometry(2, 16, 16);
	//Texturas de cada geometria

	const imagePrefix = "img/scenario_01/iglesia_";
	const directions  = ["ft", "bk", "up", "dn", "rt", "lf"];
	const imageSuffix = ".jpg";

	const materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
		side: THREE.BackSide
	}));
	const skyMaterial = new THREE.MeshFaceMaterial( materialArray );

	const imagePrefix2 = "img/scenario_02/interior-casa_";
	const directions2  = ["ft", "bk", "up", "dn", "rt", "lf"];
	const imageSuffix2 = ".png";

	const materialArray2 = [];
	for (var i = 0; i < 6; i++)
		materialArray2.push( new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture( imagePrefix2 + directions2[i] + imageSuffix2 ),
		side: THREE.BackSide
	}));
	const skyMaterial2 = new THREE.MeshFaceMaterial( materialArray2 );

	const imagePrefix3 = "img/scenario_03/barranco_";
	const directions3  = ["ft", "bk", "up", "dn", "rt", "lf"];
	const imageSuffix3 = ".jpg";

	const materialArray3 = [];
	for (var i = 0; i < 6; i++)
		materialArray3.push( new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture( imagePrefix3 + directions3[i] + imageSuffix3 ),
		side: THREE.BackSide
	}));
	const skyMaterial3 = new THREE.MeshFaceMaterial( materialArray3 );


	const logoTexture = new THREE.TextureLoader().load('img/logo/La Otra Memoria.png');
		
	const moonTexture = new THREE.TextureLoader().load('img/moon.jpg');
	const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
	// Efectos de Sonido para cada geometria
	control = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshBasicMaterial({ map: logoTexture }));
	control.position.set( 0, 40, - 50 );
	scene.add( control );

	const audioLoader = new THREE.AudioLoader();

	cube1 = new THREE.Mesh( sphere, skyMaterial );
	cube1.position.set( - 250, 40, 0 );
	scene.add( cube1 );

	const moon= new THREE.Mesh( orbe, moonMaterial);
	moon.position.set( - 250, 30, 0 );
	scene.add( moon);
	const sound1 = new THREE.PositionalAudio( listener );
	audioLoader.load( 'sounds/Misa.mp3', function ( buffer ) {
		sound1.setBuffer( buffer );
		sound1.setLoop( true );
		sound1.setVolume(2);
		sound1.setRefDistance( 20 )
		sound1.play();	
	} );
	cube1.add( sound1 );
			
	cube2 = new THREE.Mesh( sphere, skyMaterial2 );
	cube2.position.set( 0, 40, - 250 );				
	scene.add( cube2 );

	const sound2 = new THREE.PositionalAudio( listener );
	audioLoader.load( '', function ( buffer ) {

		sound2.setBuffer( buffer );
		sound2.setLoop( true );
		sound2.setRefDistance( 20 );
		sound2.setVolume(2.5);
		sound2.play();

	} );
	cube2.add( sound2 );

	cube3 = new THREE.Mesh( sphere, skyMaterial3 );
	cube3.position.set( 250, 40, 0 );
	scene.add( cube3 );

	const sound3 = new THREE.PositionalAudio( listener );
	audioLoader.load( 'sounds/Llamado.mp3', function ( buffer ) {

		sound3.setBuffer( buffer );
		sound3.setLoop( true );
		sound3.setRefDistance( 20 );
		sound3.setVolume(2.5);
		sound3.play();

	} );
	cube3.add( sound3 );
				/*const sound3 = new THREE.PositionalAudio( listener );
				const oscillator = listener.context.createOscillator();
				oscillator.type = 'sine';
				oscillator.frequency.setValueAtTime( 144, sound3.context.currentTime );
				oscillator.start( 0 );
				sound3.setNodeSource( oscillator );
				sound3.setRefDistance( 20 );
				sound3.setVolume( 0.5 );
				mesh3.add( sound3 );*/

	// Analizadores

	analyser1 = new THREE.AudioAnalyser( sound1, 32 );
	analyser2 = new THREE.AudioAnalyser( sound2, 32 );
	analyser3 = new THREE.AudioAnalyser( sound3, 32 );

	// Sonido de Ambientacion

	const sound4 = new THREE.Audio( listener );
	audioLoader.load( 'sounds/Project_Utopia.ogg', function ( buffer ) {

		sound4.setBuffer( buffer );
		sound4.setLoop( true );
		sound4.setVolume( 1 );
		sound4.play();

	} );

	// Helper o Graund

	const helper = new THREE.GridHelper( 1000, 40, 0xc5c0b2, 0xc5c0b2 );
	helper.position.y = 0.1;
	scene.add( helper );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//Controles

	controls = new FirstPersonControls( camera, renderer.domElement );

	controls.movementSpeed = 70;
	controls.lookSpeed = 0.05;
	controls.noFly = true;
	controls.lookVertical = false;

	//

	window.addEventListener( 'resize', onWindowResize );
	animate();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	controls.handleResize();

}


function animate() {

	requestAnimationFrame( animate );
	cube1.rotation.y += 0.001;
	cube2.rotation.y += 0.001;
				
	control.rotation.x += 0.01;
	control.rotation.y += 0.01;
	control.rotation.z += 0.01;

	cube3.rotation.y += 0.001;
	render();

}

function render() {

	const delta = clock.getDelta();
	controls.update( delta );
	renderer.render( scene, camera );

}