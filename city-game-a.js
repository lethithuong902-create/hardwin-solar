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
function mkWin(){var c=document.createElement('canvas');c.width=64;c.height=128;var x=c.getContext('2d');x.fillStyle='#2a3548';x.fillRect(0,0,64,128);
for(var y=5;y<120;y+=14)for(var u=5;u<56;u+=13){var lit=Math.random();x.fillStyle=lit>0.55?'#fef3c7':lit>0.3?'#7dd3fc':'#0f172a';x.fillRect(u,y,9,10);}
var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
var winTex=mkWin();
var ground=new THREE.Mesh(new THREE.PlaneGeometry(480,480),mat(0x3a4149));ground.rotation.x=-Math.PI/2;cityRoot.add(ground);
var i,gx,gz;
for(i=-6;i<=6;i++){
var rz=new THREE.Mesh(new THREE.PlaneGeometry(18,480),mat(0x1a1a1a));rz.rotation.x=-Math.PI/2;rz.position.set(i*42,0.04,0);cityRoot.add(rz);
var rx=new THREE.Mesh(new THREE.PlaneGeometry(480,18),mat(0x1a1a1a));rx.rotation.x=-Math.PI/2;rx.position.set(0,0.04,i*42);cityRoot.add(rx);
var ln=new THREE.Mesh(new THREE.PlaneGeometry(0.3,480),new THREE.MeshBasicMaterial({color:0xfbbf24}));ln.rotation.x=-Math.PI/2;ln.position.set(i*42,0.055,0);cityRoot.add(ln);
}
var buildings=[],enterables=[],platforms=[],loots=[];
var names=['Công ty Hardwin','Nhà ăn','Nhà hát','Khách sạn','Ngân hàng','Siêu thị','Cafe','Bệnh viện'];
for(gx=-4;gx<=4;gx++)for(gz=-4;gz<=4;gz++){
if(Math.abs(gx)+Math.abs(gz)<1)continue;if(Math.random()<0.12)continue;
var h=rnd(18,48),bw=rnd(14,20),bd=rnd(14,20);
var m=mat(new THREE.Color().setHSL(rnd(0.55,0.65),0.1,rnd(0.4,0.55)).getHex());
m.map=winTex.clone();m.map.repeat.set(Math.max(2,bw/3.2),Math.max(3,h/5.5));
var mesh=new THREE.Mesh(new THREE.BoxGeometry(bw,h,bd),m);var px=gx*42+rnd(-3,3),pz=gz*42+rnd(-3,3);
mesh.position.set(px,h/2,pz);cityRoot.add(mesh);
var roof=new THREE.Mesh(new THREE.BoxGeometry(bw*1.06,0.5,bd*1.06),mat(0x0f172a));roof.position.set(px,h+0.25,pz);cityRoot.add(roof);
var door=new THREE.Mesh(new THREE.BoxGeometry(2.4,3.2,0.35),mat(0x1e293b));door.position.set(px,1.6,pz+bd/2+0.12);cityRoot.add(door);
var steps=Math.min(5,Math.floor(h/9));
for(var s=1;s<=steps;s++){var sy=s*(h/(steps+1));var ledge=new THREE.Mesh(new THREE.BoxGeometry(bw*0.5,0.32,1.5),mat(0x475569));ledge.position.set(px,sy,pz+bd/2+0.85);cityRoot.add(ledge);platforms.push({x:px,z:pz+bd/2+0.85,y:sy+0.18,w:bw*0.5,d:1.5});}
platforms.push({x:px,z:pz,y:h+0.5,w:bw*0.85,d:bd*0.85});
var b={x:px,z:pz,w:bw,d:bd,h:h,name:names[Math.abs(gx*5+gz*3)%names.length],doorZ:pz+bd/2};buildings.push(b);if(Math.random()>0.3)enterables.push(b);
if(Math.random()>0.4){
var kinds=['smg','rifle','rail','grenade'];var kind=kinds[Math.floor(Math.random()*kinds.length)];var lg=new THREE.Group();
if(kind==='grenade'){lg.add(new THREE.Mesh(new THREE.SphereGeometry(0.26,10,8),mat(0x166534)));}
else{lg.add(new THREE.Mesh(new THREE.BoxGeometry(0.12,0.14,0.65),mat(0x1a1a1a)));var stock=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.16,0.3),mat(0x292524));stock.position.set(0,-0.04,-0.32);lg.add(stock);}
lg.position.set(px+rnd(-2,2),h+0.85,pz+rnd(-2,2));cityRoot.add(lg);loots.push({g:lg,kind:kind,taken:false,y:h+0.85});
}}
function addTree(x,z){var g=new THREE.Group();var tr=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.26,1.6,8),mat(0x6b4423));tr.position.y=0.8;g.add(tr);var lf=new THREE.Mesh(new THREE.SphereGeometry(1.35,10,8),mat(0x1f8a3c));lf.position.y=2.3;g.add(lf);g.position.set(x,0,z);cityRoot.add(g);}
for(i=0;i<25;i++)addTree(rnd(-150,150),rnd(-150,150));
function makePerson(skinHex,shirtHex,pantsHex,isP){
var g=new THREE.Group();var sk=mat(skinHex),sh=mat(shirtHex),pa=mat(pantsHex),hr=mat(isP?0x0c1a2e:0x1c100c);
var head=new THREE.Mesh(new THREE.SphereGeometry(0.22,14,12),sk);head.position.y=1.62;g.add(head);
var hair=new THREE.Mesh(new THREE.SphereGeometry(0.23,10,8),hr);hair.position.y=1.74;hair.scale.set(1.05,0.55,1.05);g.add(hair);
var neck=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.1,0.12,8),sk);neck.position.set(0,1.42,0);g.add(neck);
var torso=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.22,0.55,10),sh);torso.position.y=1.08;g.add(torso);
var hips=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.18,0.22,10),pa);hips.position.y=0.7;g.add(hips);
var legL=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.08,0.58,8),pa);legL.position.set(-0.1,0.3,0);g.add(legL);
var legR=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.08,0.58,8),pa);legR.position.set(0.1,0.3,0);g.add(legR);
var shoeL=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.08,0.22),mat(0x1a1a1a));shoeL.position.set(-0.1,0.04,0.04);g.add(shoeL);
var shoeR=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.08,0.22),mat(0x1a1a1a));shoeR.position.set(0.1,0.04,0.04);g.add(shoeR);
var armL=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.06,0.5,8),sh);armL.position.set(-0.3,1.05,0);g.add(armL);
var armR=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.06,0.5,8),sh);armR.position.set(0.3,1.05,0);g.add(armR);
var gunM=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.1,0.42),mat(0x222222));gunM.position.set(0.32,0.95,0.28);g.add(gunM);
g.userData={legL:legL,legR:legR,armL:armL,armR:armR};return g;}
function walkAnim(g,t,mv){var a=mv?Math.sin(t*10)*0.55:0;g.userData.legL.rotation.x=a;g.userData.legR.rotation.x=-a;g.userData.armL.rotation.x=-a*0.7;g.userData.armR.rotation.x=a*0.7;}
var cars=[];
function addCar(x,z,kind){
var g=new THREE.Group();var cols=kind==='lambo'?[0xffd700,0xe11d48,0x0a0a0a,0x06b6d4]:[0xdc2626,0x2563eb,0x16a34a,0xf8fafc,0x7c3aed];
var col=cols[Math.floor(Math.random()*cols.length)];
if(kind==='lambo'){var body=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.38,4.6),mat(col));body.position.y=0.48;g.add(body);
var slope=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.32,2.2),mat(col));slope.position.set(0,0.72,-0.4);g.add(slope);}
else{var body=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.48,4.0),mat(col));body.position.y=0.5;g.add(body);
var cab=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.48,2.0),mat(0x87ceeb));cab.position.set(0,1.0,-0.1);cab.material.transparent=true;cab.material.opacity=0.7;g.add(cab);}
var wMat=mat(0x111111);
[[-0.95,0.28,1.25],[0.95,0.28,1.25],[-0.95,0.28,-1.25],[0.95,0.28,-1.25]].forEach(function(p){var w=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.22,10),wMat);w.rotation.z=Math.PI/2;w.position.set(p[0],p[1],p[2]);g.add(w);});
g.position.set(x,0,z);cityRoot.add(g);cars.push({g:g,spd:kind==='lambo'?rnd(9,14):rnd(5,10),dir:Math.random()>0.5?1:-1,ax:Math.random()>0.5?'x':'z',kind:kind});}
for(i=0;i<10;i++)addCar(rnd(-130,130),rnd(-130,130),'sedan');
for(i=0;i<5;i++)addCar(rnd(-130,130),rnd(-130,130),'lambo');
var npcs=[],skins=[0xf5c6a0,0xe0ac69,0xc68642,0x8d5524],shirts=[0x3b82f6,0xef4444,0x22c55e,0xa855f7,0xf59e0b],pants=[0x1e3a5f,0x374151];
var HERO_TYPES=['soldier','spider','iron'];
for(i=0;i<10;i++){var p=makePerson(skins[i%4],shirts[i%5],pants[i%2],false);p.position.set(rnd(-90,90),0,rnd(-90,90));cityRoot.add(p);npcs.push({g:p,a:rnd(0,6.28),s:rnd(1.1,2.2),hp:100,dead:false,aggroT:0,shootCD:0,face:0,hero:HERO_TYPES[i%3],flyY:0});}
var player=makePerson(0xf5c6a0,0x38bdf8,0x0f2744,true);player.position.set(0,0,16);scene.add(player);
var intFloor=new THREE.Mesh(new THREE.BoxGeometry(18,0.4,18),mat(0x8b6914));intFloor.position.y=0.2;interior.add(intFloor);
var wallMat=mat(0xe8eef6);
[[0,3,-9,18,6,0.5],[0,3,9,18,6,0.5],[-9,3,0,0.5,6,18],[9,3,0,0.5,6,18]].forEach(function(w){var m=new THREE.Mesh(new THREE.BoxGeometry(w[3],w[4],w[5]),wallMat);m.position.set(w[0],w[1],w[2]);interior.add(m);});
var pl=new THREE.PointLight(0xfff4e0,1.3,28);pl.position.set(0,5,0);interior.add(pl);
var GUNS={pistol:{name:'Súng nhỏ',dmg:14,cd:0.35,spd:48,color:0xffee88,spread:0.04},smg:{name:'SMG Plasma',dmg:11,cd:0.1,spd:52,color:0x44ffaa,spread:0.07},rifle:{name:'Rifle Sniper',dmg:48,cd:0.75,spd:95,color:0xff6666,spread:0.008},rail:{name:'Railgun Nova',dmg:85,cd:1.15,spd:125,color:0xaa66ff,spread:0}};
var unlocked={pistol:true,smg:false,rifle:false,rail:false},grenades=0,gun='pistol',bullets=[],grenadeObjs=[],shootCD=0,grenCD=0;
var hero='soldier',flying=false,webPull=null,webLine=null,ironFlyT=0,lastShootTap=0;
var hp=100,maxHp=100,dead=false,inCar=false,carRef=null,vy=0,onGround=true,standY=0;
var inside=false,outsidePos=new THREE.Vector3();
var joy={x:0,y:0,active:false},keys={},camYaw=0,pitch=0.45,faceYaw=0,walkT=0;
