(function(){
function wait(n){if(typeof THREE!=='undefined'){try{boot();}catch(e){var el=document.getElementById('load');if(el)el.innerHTML='<div style="padding:24px;text-align:center">Lỗi: '+(e.message||e)+'<br><br><a href="/" style="color:#38bdf8">← Hardwin</a></div>';console.error(e);}return;}if(n>150){var el=document.getElementById('load');if(el)el.innerHTML='<div>Không tải Three.js — thử Chrome</div>';return;}setTimeout(function(){wait(n+1);},80);}
function boot(){
var canvas=document.getElementById('c'),W=innerWidth,H=innerHeight;
var renderer;
try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,powerPreference:'default',failIfMajorPerformanceCaveat:false});}
catch(e){throw new Error('Máy không hỗ trợ WebGL 3D. Mở Chrome/Edge, bật tăng tốc phần cứng.');}
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(W,H);
if(renderer.outputEncoding!==undefined&&THREE.sRGBEncoding!==undefined)renderer.outputEncoding=THREE.sRGBEncoding;
renderer.shadowMap.enabled=false;
var scene=new THREE.Scene();scene.background=new THREE.Color(0x87b8dc);scene.fog=new THREE.Fog(0x87b8dc,120,400);
var camera=new THREE.PerspectiveCamera(58,W/H,0.15,500);camera.position.set(0,14,22);
scene.add(new THREE.HemisphereLight(0xd8ecff,0x4a5568,0.7));
var sun=new THREE.DirectionalLight(0xfff0d4,1.1);sun.position.set(70,100,40);scene.add(sun);
scene.add(new THREE.AmbientLight(0x6a7a8a,0.5));
var cityRoot=new THREE.Group();scene.add(cityRoot);
var interior=new THREE.Group();interior.visible=false;scene.add(interior);
function rnd(a,b){return a+Math.random()*(b-a);}
function mat(c){return new THREE.MeshLambertMaterial({color:c});}
/* PART_A_CONTINUES_IN_NEXT_COMMIT - temporary stub to keep deployable */
console.log('part a loading');
window.__cityPartA=true;
}
wait(0);
})();
