import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js"
import getStarfield from "./getStarfield.js";
import {getFresnelMat} from "./getFresnelMat.js"

const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(width,height);

document.body.appendChild(renderer.domElement);

const field_of_view = 75;
const aspect =width /height;
const near = 0.1;
const far= 80;
const camera = new THREE.PerspectiveCamera(field_of_view,aspect,near,far);
camera.position.z = 4;
const scene = new THREE.Scene();

const controls =new OrbitControls(camera,renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const loader =new THREE.TextureLoader()
const geo =new THREE.IcosahedronGeometry(1.0, 12);
const mat = new THREE.MeshStandardMaterial({
    // color:0xccff,
    // flatShading:true
    map: loader.load("../assets/textures/earthmap1k.jpg"),

});
const earth = new THREE.Mesh(geo,mat);
scene.add(earth);


const earthMesh = new THREE.Mesh(geo,mat);
earthMesh.scale.setScalar(1.001);
earth.add(earthMesh)

const lightMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent:true,
    opacity:0.8,
})
const lightMesh = new THREE.Mesh(geo,lightMat);
scene.add(lightMesh)

// stars 
const stars = getStarfield({numStars:10000});
scene.add(stars);

//clouds
const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("../assets/textures/earthcloudmap.jpg"), // The cloud texture
    // alphaMap: loader.load("../assets/textures/earthcloudmaptrans.jpg"), // Transparency map
    transparent: true, 
    opacity: 0.3, 
    side: THREE.DoubleSide, // Render clouds on both sides
});

  const cloudsMesh = new THREE.Mesh(geo, cloudsMat);
  cloudsMesh.scale.setScalar(1.01);
  earth.add(cloudsMesh);

// atmospher aura
const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geo, fresnelMat);
glowMesh.scale.setScalar(1.01);
earth.add(glowMesh);


const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1); // Bright white light
scene.add(hemiLight);





function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y +=0.002;
    lightMesh.rotation.y +=0.002;
    cloudsMesh.rotation.y +=0.001;
    renderer.render(scene,camera);
    controls.update();
}

animate();
