import * as THREE from 'three';
import { FontLoader } from '/sprite/assets/jsm/loaders/FontLoader.js';
import { TextGeometry } from '/sprite/assets/jsm/geometries/TextGeometry.js';
import Stats from '/sprite/assets/js/stats.js';
import { OrbitControls } from "/sprite/assets/jsm/controls/OrbitControls.js";
import { OBJLoader } from '/sprite/assets/jsm/loaders/OBJLoader.js';  
import { MTLLoader } from '/sprite/assets/jsm/loaders/MTLLoader.js';


const stats = new Stats()
// stats.scale.x = 5;
// stats.scale.set(2, 3, 1);
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)


function createStats() {
      var stats = new Stats();
      stats.setMode(0);
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.width = '150px';
      stats.domElement.style.height = '100px';
      stats.domElement.style.left = '0';
      stats.domElement.style.top = '0';

      return stats;
}

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});

const fov = 90;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 120, -50);
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xB1E1FF);

{
    const planeSize = 50;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://thumbs.dreamstime.com/b/moon-surface-seamless-texture-background-closeup-moon-surface-texture-188679621.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 8;
    texture.repeat.set(repeats, repeats);

    // const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeGeo = new THREE.SphereGeometry( planeSize, planeSize, planeSize );
    const planeMat = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness:10.5,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
}

{
    const color = 0xF6F6F6;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 70, 0);
    light.target.position.set(40, 40, 0);
    scene.add(light);
    scene.add(light.target);
    const light1 = new THREE.DirectionalLight(color, intensity);
    light1.position.set(0, -70, 0);
    light1.target.position.set(0, 0, 0);
    // scene.add(light1);
    scene.add(light1.target);
}

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";
  
//   clock = new THREE.Clock();
  
//   scene = new THREE.Scene();
  const envMap = new THREE.CubeTextureLoader()
    .setPath(`${assetPath}skybox1_`)
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
 	scene.background = envMap;



var flyobj;
const objloader = new OBJLoader();
objloader.load(
    // resource URL
    'assets/obj/UFO.obj',
    // called when resource is loaded
function ( object ) {
    
    object.scale.set(0.3, 0.3, 0.3);
    object.position.set(0, 2, 0)
    scene.add( object );
    flyobj=object;

}
);
const x_coo =[];
const y_coo =[];
const z_coo =[];

GetPoints();
function GetPoints(){
   
    for(let i=0; i<10;i+=0.1){
        // let x = Math.sin(i*(Math.pow(Math.E,Math.cos(i))-100*Math.cos(4*i)-Math.pow(Math.sin(i/12),5)))*10;
        // let y = Math.cos(i*(Math.pow(Math.E,Math.cos(i))-100*Math.cos(4*i)-Math.pow(Math.sin(i/12),5)))*10;
        let x = Math.sqrt(i)*Math.cos(4*i)*i/2;
        let z = Math.sqrt(i)*Math.sin(4*i)*i/2;
        // let z = ;
        // console.log(x); 
        // console.log(y);   

        x_coo.push(x);
        y_coo.push(i*2);
        z_coo.push(z);
    }
    console.log(x_coo.length);
    for (let index = 100; index >= 0; index--) {
        x_coo.push(x_coo[index]);
        y_coo.push(y_coo[index]);
        z_coo.push(z_coo[index]);
        
    }
    console.log(x_coo);
    console.log(y_coo);
    
}
function chngPos(a){
    if(a==5) index=194;
    flyobj.position.set(x_coo[a],y_coo[a]+48 , z_coo[a]);
    // flyobj.rotation.x+=0.1;
    // flyobj.rotation.z+=0.1;
    // flyobj.rotation.y-=0.2 ;


}
var index=199;
let clck = new THREE.Clock();
let delay=0;

function draw() {
    requestAnimationFrame(draw);
	stats.begin();
    
    delay+=clck.getDelta();
    if(delay>=0.15){    
    delay=0;
    chngPos(index-=1);

}    
    renderer.render(scene, camera); 
	stats.end();  
}

draw();