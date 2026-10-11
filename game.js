(function boot(n){
if(typeof THREE==='undefined'||!THREE.OrbitControls){if(n<90)return setTimeout(function(){boot(n+1)},200);return;}
var box=document.getElementById('canvas3d');
function size(){return {w:box.clientWidth||window.innerWidth,h:box.clientHeight||window.innerHeight};}
var s0=size(),renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));renderer.setSize(s0.w,s0.h);box.appendChild(renderer.domElement);
var scene=new THREE.Scene();scene.background=new THREE.Color(0x02040a);
var camera=new THREE.PerspectiveCamera(55,s0.w/s0.h,0.1,8000);
var CAM0=new THREE.Vector3(0,70,160),TGT0=new THREE.Vector3(0,0,0);
camera.position.copy(CAM0);
var controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=0.08;
controls.rotateSpeed=0.55;controls.zoomSpeed=1.15;controls.panSpeed=0.9;
controls.enablePan=true;controls.screenSpacePanning=true;
controls.minDistance=4;controls.maxDistance=2800;controls.target.copy(TGT0);
controls.touches={ONE:THREE.TOUCH.ROTATE,TWO:THREE.TOUCH.DOLLY_PAN};
window.addEventListener('keydown',function(e){
if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;
var k=e.key.toLowerCase();
if(k==='q'){camera.position.applyAxisAngle(new THREE.Vector3(0,1,0),0.08);controls.update();}
if(k==='e'){camera.position.applyAxisAngle(new THREE.Vector3(0,1,0),-0.08);controls.update();}
if(k==='='||k==='+'){var d=new THREE.Vector3().subVectors(camera.position,controls.target);d.multiplyScalar(0.92);camera.position.copy(controls.target).add(d);}
if(k==='-'||k==='_'){var d2=new THREE.Vector3().subVectors(camera.position,controls.target);d2.multiplyScalar(1.08);camera.position.copy(controls.target).add(d2);}
if(k==='r'&&!e.ctrlKey&&!e.metaKey){if(typeof resetCamera==='function')resetCamera();}
});
scene.add(new THREE.PointLight(0xfff0c8,2.4,0,0));scene.add(new THREE.AmbientLight(0x2a3548,.5));
function rnd(a,b){return a+Math.random()*(b-a)}
function mkTex(w,h,fn){var c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);var t=new THREE.CanvasTexture(c);t.needsUpdate=true;return t;}
function rocky(base,dark){return mkTex(512,256,function(x,w,h){x.fillStyle=base;x.fillRect(0,0,w,h);for(var i=0;i<520;i++){x.beginPath();x.arc(rnd(0,w),rnd(0,h),rnd(1,14),0,6.28);x.fillStyle=dark;x.globalAlpha=rnd(.2,.55);x.fill();}x.globalAlpha=1;});}
function gas(bands,spot){return mkTex(512,256,function(x,w,h){var y=0,bi=0;while(y<h){var bh=rnd(6,22);x.fillStyle=bands[bi++%bands.length];x.fillRect(0,y,w,bh);y+=bh;}if(spot){x.beginPath();x.ellipse(w*.68,h*.55,28,14,0,0,6.28);x.fillStyle='#c24528';x.fill();}})}
var sunTex=mkTex(512,256,function(x,w,h){var g=x.createRadialGradient(w/2,h/2,8,w/2,h/2,w/2);g.addColorStop(0,'#fff6c8');g.addColorStop(.4,'#ffcc44');g.addColorStop(1,'#e85a10');x.fillStyle=g;x.fillRect(0,0,w,h);});
var earthTex=mkTex(1024,512,function(x,w,h){x.fillStyle='#0c4a8c';x.fillRect(0,0,w,h);[[.18,.42,.14],[.28,.38,.1],[.55,.45,.16],[.72,.35,.12],[.48,.62,.09],[.22,.55,.08],[.65,.58,.1]].forEach(function(L){x.fillStyle='#2d8a4a';x.beginPath();x.ellipse(L[0]*w,L[1]*h,L[2]*w,L[2]*h*.55,rnd(-.3,.3),0,6.28);x.fill();});x.fillStyle='#e8f4ff';x.fillRect(0,0,w,h*.08);x.fillRect(0,h*.92,w,h*.08);});
var moonTex=rocky('#c8c4b8','rgba(80,80,80,.55)');
var sp=[],sc=[],cols=[0xffffff,0xaaccff,0xffddaa,0xffaaaa,0xccffcc,0xddaaff,0xffe0a0];
for(var i=0;i<4200;i++){var r=rnd(1100,3200),th=rnd(0,6.28),ph=Math.acos(rnd(-1,1));sp.push(r*Math.sin(ph)*Math.cos(th),r*Math.cos(ph),r*Math.sin(ph)*Math.sin(th));var c=cols[i%cols.length];sc.push((c>>16&255)/255,(c>>8&255)/255,(c&255)/255);}
var stars=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({size:2.2,vertexColors:true,sizeAttenuation:true}));
stars.geometry.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));
stars.geometry.setAttribute('color',new THREE.Float32BufferAttribute(sc,3));scene.add(stars);
var sun=new THREE.Mesh(new THREE.SphereGeometry(8,48,48),new THREE.MeshBasicMaterial({map:sunTex}));scene.add(sun);
var corona=new THREE.Mesh(new THREE.SphereGeometry(10.8,32,32),new THREE.MeshBasicMaterial({color:0xffaa33,transparent:true,opacity:.16}));scene.add(corona);
var TEX={mercury:rocky('#9c8f80','rgba(60,50,40,.55)'),venus:rocky('#e0b878','rgba(160,110,50,.5)'),earth:earthTex,mars:rocky('#c25a38','rgba(100,40,20,.55)'),jupiter:gas(['#c9a06a','#e3c9a0','#b07d4e'],true),saturn:gas(['#d8c08a','#e8d8a8','#c4a868'],false),uranus:gas(['#a8e0e8','#8fd0dc'],false),neptune:gas(['#3a5fc8','#4a72d8'],false),ceres:rocky('#a8a090','rgba(50,45,40,.5)'),pluto:rocky('#d4b896','rgba(90,70,50,.5)'),haumea:rocky('#e8dcc8','rgba(120,100,80,.45)'),makemake:rocky('#c47848','rgba(80,40,20,.5)'),eris:rocky('#d8e0e8','rgba(90,100,110,.5)')};
var PD=[{id:'sun',vi:'Mặt Trời',radius:8,dist:0,speed:0,rot:.002},{id:'mercury',vi:'Sao Thủy',radius:1.15,dist:18,speed:.045,rot:.004},{id:'venus',vi:'Sao Kim',radius:1.85,dist:26,speed:.035,rot:.002},{id:'earth',vi:'Trái Đất',radius:2,dist:36,speed:.028,rot:.02,moons:[{id:'moon',vi:'Mặt Trăng',r:.55,d:3.6,sp:.05}]},{id:'mars',vi:'Sao Hỏa',radius:1.45,dist:48,speed:.022,rot:.018,moons:[{id:'phobos',vi:'Phobos',r:.22,d:2.4,sp:.09}]},{id:'jupiter',vi:'Sao Mộc',radius:4.6,dist:72,speed:.011,rot:.04,moons:[{id:'io',vi:'Io',r:.38,d:6.2,sp:.08},{id:'europa',vi:'Europa',r:.36,d:7.8,sp:.06},{id:'ganymede',vi:'Ganymede',r:.48,d:9.6,sp:.045},{id:'callisto',vi:'Callisto',r:.44,d:11.5,sp:.03}]},{id:'saturn',vi:'Sao Thổ',radius:3.9,dist:100,speed:.0075,rot:.038,ring:true,moons:[{id:'titan',vi:'Titan',r:.42,d:8.5,sp:.04}]},{id:'uranus',vi:'Thiên Vương',radius:2.85,dist:128,speed:.0052,rot:.03,ring:true,ringColor:0x9ad4e0},{id:'neptune',vi:'Hải Vương',radius:2.75,dist:154,speed:.004,rot:.032,moons:[{id:'triton',vi:'Triton',r:.36,d:5.2,sp:.035}]},{id:'ceres',vi:'Ceres',radius:.9,dist:58,speed:.016,rot:.01,dwarf:true},{id:'pluto',vi:'Sao Diêm Vương',radius:1.05,dist:178,speed:.0028,rot:.008,dwarf:true,moons:[{id:'charon',vi:'Charon',r:.4,d:2.8,sp:.04}]},{id:'haumea',vi:'Haumea',radius:.95,dist:195,speed:.0024,rot:.012,dwarf:true},{id:'makemake',vi:'Makemake',radius:.92,dist:210,speed:.0021,rot:.009,dwarf:true},{id:'eris',vi:'Eris',radius:1.0,dist:235,speed:.0017,rot:.007,dwarf:true}];
var planets=[],orbits=[],clickables=[],projectiles=[],effects=[],comets=[],passers=[],labels=document.getElementById('labels');
/* INFO from /info-data.js */
