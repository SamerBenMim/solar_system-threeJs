import * as THREE from "/node_modules/three/build/three.module.js";
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";

import gsap from "../node_modules/gsap/index.js"



var showHoverEffect = true
var firstTime = true
var rotation = true
var currentObjectid=20
window.onwheel = function(event) {
  if(event.deltaY<0){
    if(firstTime){
      firstTime= false
      zoomCamera(-50)
    }else{
      zoomCamera(-20);
    }
  } 
  else zoomCamera(20)
  
};
//global declaration
let scene;
let camera;
let renderer;
const canvas = document.getElementsByTagName("canvas")[0];
scene = new THREE.Scene();
const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const explore = $(".explore");
const change = $(".change");


var explorer = false;

//camera
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 55;
camera.position.x = 0;
scene.add(camera);

//explore



explore.click(() => {
  if(!gsap.isTweening(camera.position)){
    

    
    gsap.to(camera.position,{
        duration: 1,
        z: explorer ? 30: 5 ,
        x: explorer ? 0: 0,
        y: explorer ?0:0,
        ease: "power3.inOut",
      })
      explore[0].innerHTML = explorer ? ("start exploring") : ("show menu");
      explorer = false;
      if(!explorer){
        document.querySelector(".title-container").classList.add('hidden')

      }
      
      // changeCameraToObject(planetMesh2)
    }
    //blockRotation(false)
  
});
change.click(() => {
  changeViewToObject(myObjs[getRandomIntInclusive(0,myObjs.length-1)])
});

//changeCameraToObject
const  changeCameraToObject = (object)=>{
  currentObjectid = object.id
  console.log(object)
  // changeViewToObject(object.position)
  // camera.lookAt(0,0,0)
  object.add(camera)
  
}
const  changeViewToObject = (object)=>{
  camera.lookAt( object.position );
}

//default renderer
renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
renderer.setClearColor(0x000000, 0.0);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//bloom renderer
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
  );
  bloomPass.threshold = 0;
  bloomPass.strength = 2; //intensity of glow
  bloomPass.radius = 0;
  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
  bloomComposer.renderToScreen = true;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);
  
  //sun object
  const color = new THREE.Color("#FDB813");
  const geometry = new THREE.IcosahedronGeometry(1, 15);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(-50, 20, -60);
  sphere.layers.set(1);
  scene.add(sphere);
  
  // galaxy geometry
  const starGeometry = new THREE.SphereGeometry(80, 64, 64);
  
  // galaxy material
  const starMaterial = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture("texture/galaxy1.png"),
    side: THREE.BackSide,
    transparent: true,
  });
  
  // galaxy mesh
  const starMesh = new THREE.Mesh(starGeometry, starMaterial);
  starMesh.layers.set(1);
scene.add(starMesh);

//earth geometry
const earthgeometry = new THREE.SphereGeometry(0.98, 32, 32);

//earth material
const earthMaterial = new THREE.MeshPhongMaterial({
  roughness: 1,
  metalness: 0,
  map: THREE.ImageUtils.loadTexture("texture/earthmap1.jpg"),
  bumpMap: THREE.ImageUtils.loadTexture("texture/bump.jpg"),
  bumpScale: 0.3,
});

//earthMesh
const earthMesh = new THREE.Mesh(earthgeometry, earthMaterial);
earthMesh.updateMatrixWorld();

earthMesh.name="home2"

earthMesh.receiveShadow = true;
earthMesh.castShadow = true;
earthMesh.layers.set(0);
scene.add(earthMesh);





/************************************* */


//planetMesh geometry
const planetGeometry = new THREE.SphereGeometry(.7, 32, 32);

//planetMesh material
const PlanetMaterial = new THREE.MeshPhongMaterial({
  roughness: 1,
  metalness: 0,
  map: THREE.ImageUtils.loadTexture("texture/planet.jpg"),
  bumpMap: THREE.ImageUtils.loadTexture("texture/bump.jpg"),
  bumpScale: 0.3,
});

//planetMesh
const planetMesh = new THREE.Mesh(planetGeometry, PlanetMaterial);
planetMesh.receiveShadow = true;
planetMesh.castShadow = true;
planetMesh.layers.set(0);
planetMesh.cursor = 'pointer';
planetMesh.position.set(7, 7, 7);
planetMesh.name="home2"
planetMesh.add(cameraPivot);
earthMesh.add(planetMesh)
scene.add(planetMesh);

//planetMesh geometry
const planetGeometry2 = new THREE.SphereGeometry(2, 40, 40);

//planetMesh material
const PlanetMaterial2 = new THREE.MeshPhongMaterial({
  roughness: 4,
  metalness: 0,
  map: THREE.ImageUtils.loadTexture("texture/redtexture.jpg"),
  bumpMap: THREE.ImageUtils.loadTexture("texture/bump.jpg"),
  bumpScale: 0.5,
});

//planetMesh
const planetMesh2 = new THREE.Mesh(planetGeometry2, PlanetMaterial2);
planetMesh2.receiveShadow = true;
planetMesh2.castShadow = true;
planetMesh2.layers.set(0);
planetMesh2.cursor = 'pointer';
planetMesh2.position.set(-10, 7, -4);
planetMesh2.name="home3"
planetMesh2.add(cameraPivot);
scene.add(planetMesh2);



/************************************** */






//cloud geometry
const cloudgeometry = new THREE.SphereGeometry(1, 32, 32);

//cloud material
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: THREE.ImageUtils.loadTexture("texture/earthCloud.png"),
  transparent: true,
});

//cloudMesh
const cloud = new THREE.Mesh(cloudgeometry, cloudMaterial);
// earthMesh.layers.set(0);
scene.add(cloud);

//moon geometry
const moongeometry = new THREE.SphereGeometry(.3, 32, 32);

//moon material
const moonMaterial = new THREE.MeshPhongMaterial({
  roughness: 5,
  metalness: 0,
  map: THREE.ImageUtils.loadTexture("texture/moonmap4k.jpg"),
  bumpMap: THREE.ImageUtils.loadTexture("texture/moonbump4k.jpg"),
  bumpScale: 0.02,
});

//moonMesh
const moonMesh = new THREE.Mesh(moongeometry, moonMaterial);
moonMesh.receiveShadow = true;
moonMesh.castShadow = true;
moonMesh.layers.set(0);
moonMesh.cursor = 'pointer';
moonMesh.position.x = 3;
moonMesh.updateMatrixWorld();
scene.add(moonMesh);


var moonPivot = new THREE.Object3D();
earthMesh.add(moonPivot);
moonPivot.add(moonMesh);

var cameraPivot = new THREE.Object3D();
//fix
earthMesh.add(cameraPivot);
cameraPivot.add(camera);


var planetPivot = new THREE.Object3D();

//ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientlight);

//point Light
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.castShadow = true;
pointLight.shadowCameraVisible = true;
pointLight.shadowBias = 0.00001;
pointLight.shadowDarkness = 0.2;
pointLight.shadowMapWidth = 2048;
pointLight.shadowMapHeight = 2048;
pointLight.position.set(-50, 20, -60);
scene.add(pointLight);

//resize listner
window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
  },
  false
  );
  
  //zoom
  const zoomCamera=(step)=>{
    if(!gsap.isTweening(camera.position)){
      if(camera.position.z>-80&&step<0 || step>0&&camera.position.z<80){
        gsap.to(camera.position,{
          duration: 1,
          z: camera.position.z+step,
          x:0,
          y:0,
          ease: "power3.inOut",
        })
        // explore[0].innerHTML = explorer ? "start exploring" : "go back";
        // explorer = !explorer;
      }
      
      
    }
  }
  
  
  //RotatePlanetsWithMouse
document.addEventListener('mousemove',onDocumentMouseMove)
window.addEventListener('click', onClick);
let mouseX=0;
let mouseY=0;

let targetX=0;
let targetY=0;

const windowHalfX = window.innerWidth/2;
const windowHalfY = window.innerHeight/2;

function onDocumentMouseMove(event){
  updateMouseCoords(event, mouse);
  
  latestMouseProjection = undefined;
  hoveredObj = undefined;
  handleManipulationUpdate();
  if(rotation){
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)
  }
}
function onClick(event) {
  raycaster.setFromCamera(pointer, camera);
  let intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    console.log(currentObjectid==intersects[0].object.id)
    if(currentObjectid==intersects[0].object.id){
      console.log("heeeeeereeeeeeee")
      document.querySelector(".reviews").classList.remove('hidden')
      showHoverEffect = false

    }else{
      changeCameraToObject(intersects[0].object)
      
    }
  }
}


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function pickPiece() {
  raycaster.setFromCamera(pointer, camera);
  
  const intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    // You can do anything you want here, this is just an example to make the hovered object transparent
    
    //  console.log(intersects[i])
    if (intersects.length > 0) {
      latestMouseProjection = intersects[0].point;
      hoveredObj = intersects[0].object;
    }
    const newMaterial = intersects[i].object.material.clone();
      newMaterial.transparent = true;
      newMaterial.opacity = 0.5;
      intersects[i].object.material = newMaterial;
      
      
    }
  }
  
  function resetMaterials() {
    for (let i = 0; i < scene.children.length; i++) {
      if (scene.children[i].material) {
        scene.children[i].material.opacity = 1;
      }
    }
  }
  window.addEventListener( 'pointermove', onPointerMove ,FontFaceSetLoadEvent);
  
  
  
  
  //animation loop
  const clock = new THREE.Clock()
  const animate = () => {
    
    planetMesh.rotateY(0.1)
    resetMaterials()
    pickPiece()
    requestAnimationFrame(animate);
    
    targetX=mouseX*0.001
    targetY= mouseY*0.001
    const elapsedTime = clock.getElapsedTime()
    
    animateEarth(elapsedTime,targetX,targetY)
    animatePlanet1(elapsedTime,targetX,targetY)
    animatePlanet2(elapsedTime,targetX,targetY)
    
    cloud.rotation.y -= 0.0002;
    
    
    moonPivot.rotation.y -= 0.005;
    moonPivot.rotation.x = 0.5;
    
    starMesh.rotation.y += 0.0002;
    camera.layers.set(1);
    bloomComposer.render();
    renderer.clearDepth();
    camera.layers.set(0);
  renderer.render(scene, camera);
};


const animateEarth=(elapsedTime,targetX,targetY)=>{
  earthMesh.rotation.y =.3*elapsedTime
  earthMesh.rotation.x =.7*(targetY-earthMesh.rotation.x)
  earthMesh.rotation.y =.7*(targetX-earthMesh.rotation.y)
  cameraPivot.rotation.y += 0.001;
  
}
const animatePlanet1=(elapsedTime,targetX,targetY)=>{
  planetMesh.rotation.z =0.2*elapsedTime
  planetMesh.rotation.x =.8*(targetY-planetMesh.rotation.x)
  planetMesh.rotation.y =.8*(targetX-planetMesh.rotation.y)
}
const animatePlanet2=(elapsedTime,targetX,targetY)=>{
  planetMesh.rotation.z =0.2*elapsedTime
  planetMesh.rotation.x =.8*(targetY-planetMesh.rotation.x)
  planetMesh.rotation.y =.8*(targetX-planetMesh.rotation.y)
}

const blockRotation = (x)=>{//
  rotation=x
}

animate();




// this will be 2D coordinates of the current mouse position, [0,0] is middle of the screen.
var mouse = new THREE.Vector2();

var latestMouseProjection; // this is the latest projection of the mouse on object (i.e. intersection with ray)
var hoveredObj; // this objects is hovered at the moment

// tooltip will not appear immediately. If object was hovered shortly,
// - the timer will be canceled and tooltip will not appear at all.
var tooltipDisplayTimeout;

// This will move tooltip to the current mouse position and show it by timer.
function showTooltip() {
  var divElement = $("#tooltip");
  
  if (divElement && latestMouseProjection) {
    divElement.css({
      display: "block",
      opacity: 0.0
    });
    
    var canvasHalfWidth = renderer.domElement.offsetWidth / 2;
    var canvasHalfHeight = renderer.domElement.offsetHeight / 2;
    
    var tooltipPosition = latestMouseProjection.clone().project(camera);
    tooltipPosition.x = (tooltipPosition.x * canvasHalfWidth) + canvasHalfWidth + renderer.domElement.offsetLeft;
    tooltipPosition.y = -(tooltipPosition.y * canvasHalfHeight) + canvasHalfHeight + renderer.domElement.offsetTop;
    
    var tootipWidth = divElement[0].offsetWidth;
    var tootipHeight = divElement[0].offsetHeight;
    
    divElement.css({
      left: `${tooltipPosition.x - tootipWidth/2}px`,
      top: `${tooltipPosition.y - tootipHeight - 50}px`
    });
    
    // var position = new THREE.Vector3();
    // var quaternion = new THREE.Quaternion();
    // var scale = new THREE.Vector3();
    // hoveredObj.matrix.decompose(position, quaternion, scale);
    console.log(hoveredObj)
    divElement.text(hoveredObj.name);
    
    setTimeout(function() {
      divElement.css({
        opacity: 1.0
      });
    }, 25);
  }
}

// This will immediately hide tooltip.
function hideTooltip() {
  var divElement = $("#tooltip");
  if (divElement) {
    divElement.css({
      display: "none"
    });
  }
}

// Following two functions will convert mouse coordinates
// from screen to three.js system (where [0,0] is in the middle of the screen)
function updateMouseCoords(event, coordsObj) {
  coordsObj.x = ((event.clientX - renderer.domElement.offsetLeft + 0.5) / window.innerWidth) * 2 - 1;
  coordsObj.y = -((event.clientY - renderer.domElement.offsetTop + 0.5) / window.innerHeight) * 2 + 1;
}

function handleManipulationUpdate() {
  raycaster.setFromCamera(mouse, camera); {
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      latestMouseProjection = intersects[0].point;
      hoveredObj = intersects[0].object;
    }
  }
  
  if (tooltipDisplayTimeout || !latestMouseProjection) {
    clearTimeout(tooltipDisplayTimeout);
    tooltipDisplayTimeout = undefined;
    hideTooltip();
  }
  
  if (!tooltipDisplayTimeout && latestMouseProjection) {
    tooltipDisplayTimeout = setTimeout(function() {
      tooltipDisplayTimeout = undefined;
      if(showHoverEffect)
      showTooltip();
    }, 200);
  }
}
const myObjs = [moonMesh,planetMesh2,planetMesh,earthMesh,sphere]
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

const close = $(".close");
close.click(() => {
  console.log("first")
  document.querySelector(".reviews").classList.add('hidden')
  showHoverEffect = true
})
