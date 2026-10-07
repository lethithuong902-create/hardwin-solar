(function(){
function wait(n){if(typeof THREE!=='undefined'){try{boot();}catch(e){var el=document.getElementById('load');if(el)el.innerHTML='<div>Lỗi: '+(e.message||e)+'</div>';console.error(e);}return;}if(n>150){var el=document.getElementById('load');if(el)el.innerHTML='<div>Không tải Three.js</div>';return;}setTimeout(function(){wait(n+1);},80);}
function boot(){
var canvas=document.getElementById('c'),W=innerWidth,H=innerHeight;
var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setSize(W,H);
renderer.outputEncoding=THREE.sRGBEncoding;renderer.shadowMap.enabled=true;
var scene=new THREE.Scene();scene.background=new THREE.Color(0x87b8dc);scene.fog=new THREE.Fog(0x87b8dc,120,400);
var camera=new THREE.PerspectiveCamera(58,W/H,0.15,500);camera.position.set(0,14,22);
scene.add(new THREE.HemisphereLight(0xd8ecff,0x4a5568,0.55));
var sun=new THREE.DirectionalLight(0xfff0d4,1.2);sun.position.set(70,100,40);sun.castShadow=true;scene.add(sun);
scene.add(new THREE.AmbientLight(0x6a7a8a,0.45));
var cityRoot=new THREE.Group();scene.add(cityRoot);
var interior=new THREE.Group();interior.visible=false;scene.add(interior);
function rnd(a,b){return a+Math.random()*(b-a);}
function mat(c,r,m){return new THREE.MeshStandardMaterial({color:c,roughness:r==null?0.7:r,metalness:m||0});}
function mkWin(){var c=document.createElement('canvas');c.width=64;c.height=128;var x=c.getContext('2d');x.fillStyle='#2a3548';x.fillRect(0,0,64,128);
for(var y=5;y<120;y+=14)for(var u=5;u<56;u+=13){var lit=Math.random();x.fillStyle=lit>0.55?'#fef3c7':lit>0.3?'#7dd3fc':'#0f172a';x.fillRect(u,y,9,10);}
var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
var winTex=mkWin();
var ground=new THREE.Mesh(new THREE.PlaneGeometry(480,480),mat(0x3a4149,0.95));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;cityRoot.add(ground);
var i,gx,gz;
for(i=-6;i<=6;i++){
var rz=new THREE.Mesh(new THREE.PlaneGeometry(18,480),mat(0x1a1a1a,0.9));rz.rotation.x=-Math.PI/2;rz.position.set(i*42,0.04,0);cityRoot.add(rz);
var rx=new THREE.Mesh(new THREE.PlaneGeometry(480,18),mat(0x1a1a1a,0.9));rx.rotation.x=-Math.PI/2;rx.position.set(0,0.04,i*42);cityRoot.add(rx);
var ln=new THREE.Mesh(new THREE.PlaneGeometry(0.3,480),new THREE.MeshBasicMaterial({color:0xfbbf24}));ln.rotation.x=-Math.PI/2;ln.position.set(i*42,0.055,0);cityRoot.add(ln);
}
var buildings=[],enterables=[],platforms=[],loots=[];
var names=['Công ty Hardwin','Nhà ăn','Nhà hát','Khách sạn','Ngân hàng','Siêu thị','Cafe','Bệnh viện'];
for(gx=-4;gx<=4;gx++)for(gz=-4;gz<=4;gz++){
if(Math.abs(gx)+Math.abs(gz)<1)continue;if(Math.random()<0.12)continue;
var h=rnd(18,48),bw=rnd(14,20),bd=rnd(14,20);
var m=mat(new THREE.Color().setHSL(rnd(0.55,0.65),0.1,rnd(0.4,0.55)).getHex(),0.65,0.15);
m.map=winTex.clone();m.map.repeat.set(Math.max(2,bw/3.2),Math.max(3,h/5.5));
var mesh=new THREE.Mesh(new THREE.BoxGeometry(bw,h,bd),m);var px=gx*42+rnd(-3,3),pz=gz*42+rnd(-3,3);
mesh.position.set(px,h/2,pz);mesh.castShadow=true;cityRoot.add(mesh);
var roof=new THREE.Mesh(new THREE.BoxGeometry(bw*1.06,0.5,bd*1.06),mat(0x0f172a,0.85));roof.position.set(px,h+0.25,pz);cityRoot.add(roof);
var door=new THREE.Mesh(new THREE.BoxGeometry(2.4,3.2,0.35),mat(0x1e293b,0.6,0.2));door.position.set(px,1.6,pz+bd/2+0.12);cityRoot.add(door);
var steps=Math.min(5,Math.floor(h/9));
for(var s=1;s<=steps;s++){var sy=s*(h/(steps+1));var ledge=new THREE.Mesh(new THREE.BoxGeometry(bw*0.5,0.32,1.5),mat(0x475569,0.8));ledge.position.set(px,sy,pz+bd/2+0.85);cityRoot.add(ledge);platforms.push({x:px,z:pz+bd/2+0.85,y:sy+0.18,w:bw*0.5,d:1.5});}
platforms.push({x:px,z:pz,y:h+0.5,w:bw*0.85,d:bd*0.85});
var b={x:px,z:pz,w:bw,d:bd,h:h,name:names[Math.abs(gx*5+gz*3)%names.length],doorZ:pz+bd/2};buildings.push(b);if(Math.random()>0.3)enterables.push(b);
if(Math.random()>0.4){
var kinds=['smg','rifle','rail','grenade'];var kind=kinds[Math.floor(Math.random()*kinds.length)];var lg=new THREE.Group();
if(kind==='grenade'){lg.add(new THREE.Mesh(new THREE.SphereGeometry(0.26,10,8),mat(0x166534,0.4,0.3)));}
else{lg.add(new THREE.Mesh(new THREE.BoxGeometry(0.12,0.14,0.65),mat(0x1a1a1a,0.35,0.7)));lg.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.1,0.16,0.3),mat(0x292524,0.6)),{position:new THREE.Vector3(0,-0.04,-0.32)}));}
lg.position.set(px+rnd(-2,2),h+0.85,pz+rnd(-2,2));cityRoot.add(lg);loots.push({g:lg,kind:kind,taken:false,y:h+0.85});
}}
function addTree(x,z){var g=new THREE.Group();var tr=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.26,1.6,8),mat(0x6b4423,0.9));tr.position.y=0.8;g.add(tr);var lf=new THREE.Mesh(new THREE.SphereGeometry(1.35,10,8),mat(0x1f8a3c,0.85));lf.position.y=2.3;g.add(lf);g.position.set(x,0,z);cityRoot.add(g);}
for(i=0;i<40;i++)addTree(rnd(-150,150),rnd(-150,150));
function makePerson(skinHex,shirtHex,pantsHex,isP){
var g=new THREE.Group();var sk=mat(skinHex,0.75),sh=mat(shirtHex,0.7),pa=mat(pantsHex,0.8),hr=mat(isP?0x0c1a2e:0x1c100c,0.9);
var head=new THREE.Mesh(new THREE.SphereGeometry(0.22,14,12),sk);head.position.y=1.62;head.castShadow=true;g.add(head);
var hair=new THREE.Mesh(new THREE.SphereGeometry(0.23,10,8),hr);hair.position.y=1.74;hair.scale.set(1.05,0.55,1.05);g.add(hair);
g.add(Object.assign(new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.1,0.12,8),sk),{position:new THREE.Vector3(0,1.42,0)}));
var torso=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.22,0.55,10),sh);torso.position.y=1.08;torso.castShadow=true;g.add(torso);
var hips=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.18,0.22,10),pa);hips.position.y=0.7;g.add(hips);
var legL=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.08,0.58,8),pa);legL.position.set(-0.1,0.3,0);g.add(legL);
var legR=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.08,0.58,8),pa);legR.position.set(0.1,0.3,0);g.add(legR);
g.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.12,0.08,0.22),mat(0x1a1a1a,0.5)),{position:new THREE.Vector3(-0.1,0.04,0.04)}));
g.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.12,0.08,0.22),mat(0x1a1a1a,0.5)),{position:new THREE.Vector3(0.1,0.04,0.04)}));
var armL=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.06,0.5,8),sh);armL.position.set(-0.3,1.05,0);g.add(armL);
var armR=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.06,0.5,8),sh);armR.position.set(0.3,1.05,0);g.add(armR);
var gunM=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.1,0.42),mat(0x222,0.35,0.8));gunM.position.set(0.32,0.95,0.28);g.add(gunM);
g.userData={legL:legL,legR:legR,armL:armL,armR:armR};return g;}
function walkAnim(g,t,mv){var a=mv?Math.sin(t*10)*0.55:0;g.userData.legL.rotation.x=a;g.userData.legR.rotation.x=-a;g.userData.armL.rotation.x=-a*0.7;g.userData.armR.rotation.x=a*0.7;}
var cars=[];
function addCar(x,z,kind){
var g=new THREE.Group();var cols=kind==='lambo'?[0xffd700,0xe11d48,0x0a0a0a,0x06b6d4]:[0xdc2626,0x2563eb,0x16a34a,0xf8fafc,0x7c3aed];
var col=cols[Math.floor(Math.random()*cols.length)];
if(kind==='lambo'){var body=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.38,4.6),mat(col,0.35,0.65));body.position.y=0.48;body.castShadow=true;g.add(body);
var slope=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.32,2.2),mat(col,0.35,0.65));slope.position.set(0,0.72,-0.4);g.add(slope);}
else{var body=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.48,4.0),mat(col,0.45,0.4));body.position.y=0.5;body.castShadow=true;g.add(body);
var cab=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.48,2.0),mat(0x87ceeb,0.25,0.3));cab.position.set(0,1.0,-0.1);cab.material.transparent=true;cab.material.opacity=0.7;g.add(cab);}
var wMat=mat(0x111,0.6,0.3);
[[-0.95,0.28,1.25],[0.95,0.28,1.25],[-0.95,0.28,-1.25],[0.95,0.28,-1.25]].forEach(function(p){var w=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.22,10),wMat);w.rotation.z=Math.PI/2;w.position.set(p[0],p[1],p[2]);g.add(w);});
g.position.set(x,0,z);cityRoot.add(g);cars.push({g:g,spd:kind==='lambo'?rnd(9,14):rnd(5,10),dir:Math.random()>0.5?1:-1,ax:Math.random()>0.5?'x':'z',kind:kind});}
for(i=0;i<10;i++)addCar(rnd(-130,130),rnd(-130,130),'sedan');
for(i=0;i<5;i++)addCar(rnd(-130,130),rnd(-130,130),'lambo');
var npcs=[],skins=[0xf5c6a0,0xe0ac69,0xc68642,0x8d5524],shirts=[0x3b82f6,0xef4444,0x22c55e,0xa855f7,0xf59e0b],pants=[0x1e3a5f,0x374151];
for(i=0;i<10;i++){var p=makePerson(skins[i%4],shirts[i%5],pants[i%2],false);p.position.set(rnd(-90,90),0,rnd(-90,90));cityRoot.add(p);npcs.push({g:p,a:rnd(0,6.28),s:rnd(1.1,2.2),hp:100,dead:false,aggroT:0,shootCD:0,face:0});}
var player=makePerson(0xf5c6a0,0x38bdf8,0x0f2744,true);player.position.set(0,0,16);scene.add(player);
var intFloor=new THREE.Mesh(new THREE.BoxGeometry(18,0.4,18),mat(0x8b6914,0.85));intFloor.position.y=0.2;interior.add(intFloor);
var wallMat=mat(0xe8eef6,0.9);
[[0,3,-9,18,6,0.5],[0,3,9,18,6,0.5],[-9,3,0,0.5,6,18],[9,3,0,0.5,6,18]].forEach(function(w){var m=new THREE.Mesh(new THREE.BoxGeometry(w[3],w[4],w[5]),wallMat);m.position.set(w[0],w[1],w[2]);interior.add(m);});
interior.add(Object.assign(new THREE.PointLight(0xfff4e0,1.3,28),{position:new THREE.Vector3(0,5,0)}));
var GUNS={pistol:{name:'Súng nhỏ',dmg:14,cd:0.35,spd:48,color:0xffee88,spread:0.04},smg:{name:'SMG Plasma',dmg:11,cd:0.1,spd:52,color:0x44ffaa,spread:0.07},rifle:{name:'Rifle Sniper',dmg:48,cd:0.75,spd:95,color:0xff6666,spread:0.008},rail:{name:'Railgun Nova',dmg:85,cd:1.15,spd:125,color:0xaa66ff,spread:0}};
var unlocked={pistol:true,smg:false,rifle:false,rail:false},grenades=0,gun='pistol',bullets=[],grenadeObjs=[],shootCD=0,grenCD=0;
var hp=100,maxHp=100,dead=false,inCar=false,carRef=null,vy=0,onGround=true,standY=0;
var inside=false,outsidePos=new THREE.Vector3();
var joy={x:0,y:0,active:false},keys={},camYaw=0,pitch=0.45,faceYaw=0,walkT=0;
function setKey(c,o){keys[c]=!!o;}
window.addEventListener('keydown',function(e){setKey(e.code,true);if(e.code==='Space'||e.code.indexOf('Arrow')===0)e.preventDefault();if(e.code==='KeyF')toggleCar();if(e.code==='KeyE'){if(!tryLoot())tryEnter();}if(e.code==='KeyG')throwGrenade();});
window.addEventListener('keyup',function(e){setKey(e.code,false);});
function refreshMenu(){document.querySelectorAll('#menu .w').forEach(function(b){var k=b.dataset.gun;if(!unlocked[k]){b.style.opacity='0.35';}else{b.style.opacity='1';}});var gl=document.getElementById('gunLabel');if(gl)gl.textContent='🔫 '+GUNS[gun].name+(grenades?' · 💣×'+grenades:'');}
document.getElementById('menuBtn').onclick=function(){document.getElementById('menu').classList.toggle('open');refreshMenu();};
document.querySelectorAll('#menu .w').forEach(function(b){b.onclick=function(){var k=b.dataset.gun;if(!unlocked[k]){toast('Lên nóc nhà nhặt loot');return;}gun=k;document.querySelectorAll('#menu .w').forEach(function(x){x.classList.toggle('on',x===b);});document.getElementById('menu').classList.remove('open');refreshMenu();toast(GUNS[gun].name);};});
var joyBase=document.getElementById('joyBase'),joyKnob=document.getElementById('joyKnob'),joyZone=document.getElementById('joyZone');
function joyUpd(cx,cy){var r=joyBase.getBoundingClientRect();var mx=cx-(r.left+r.width/2),my=cy-(r.top+r.height/2);var max=52,len=Math.sqrt(mx*mx+my*my)||1;if(len>max){mx*=max/len;my*=max/len;}joyKnob.style.left=(44+mx)+'px';joyKnob.style.top=(44+my)+'px';joy.x=mx/max;joy.y=-my/max;}
function joyEnd(){joy.active=false;joy.x=0;joy.y=0;joyKnob.style.left='44px';joyKnob.style.top='44px';}
joyZone.addEventListener('pointerdown',function(e){joy.active=true;joyUpd(e.clientX,e.clientY);joyZone.setPointerCapture(e.pointerId);e.preventDefault();});
joyZone.addEventListener('pointermove',function(e){if(joy.active)joyUpd(e.clientX,e.clientY);});
joyZone.addEventListener('pointerup',joyEnd);joyZone.addEventListener('pointercancel',joyEnd);
document.getElementById('btnJump').addEventListener('pointerdown',function(e){e.preventDefault();setKey('Space',true);});
document.getElementById('btnJump').addEventListener('pointerup',function(){setKey('Space',false);});
document.getElementById('btnCar').onclick=function(e){e.preventDefault();toggleCar();};
document.getElementById('btnEnter').onclick=function(e){e.preventDefault();if(!tryLoot())tryEnter();};
document.getElementById('btnShoot').addEventListener('pointerdown',function(e){e.preventDefault();setKey('Shoot',true);});
document.getElementById('btnShoot').addEventListener('pointerup',function(){setKey('Shoot',false);});
window.addEventListener('mousedown',function(e){if(e.button===0&&e.target===canvas)setKey('Shoot',true);});
window.addEventListener('mouseup',function(){setKey('Shoot',false);});
var dragging=false,lx=0,ly=0;
canvas.addEventListener('pointerdown',function(e){dragging=true;lx=e.clientX;ly=e.clientY;try{canvas.setPointerCapture(e.pointerId);}catch(err){}});
canvas.addEventListener('pointerup',function(){dragging=false;});
canvas.addEventListener('pointermove',function(e){if(!dragging)return;var dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;camYaw-=dx*0.005;pitch=Math.max(0.15,Math.min(1.3,pitch+dy*0.004));});
function toast(m){var t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(function(){t.classList.remove('show');},2200);}
function updHp(){var bar=document.getElementById('hpBar'),pct=Math.max(0,hp/maxHp*100);bar.style.width=pct+'%';bar.className=pct<35?'low':pct<65?'mid':'';}
function clearAggro(){for(var i=0;i<npcs.length;i++)npcs[i].aggroT=0;}
function hurt(amt){if(dead||inCar)return;hp-=amt;if(hp<0)hp=0;updHp();if(hp<=0){dead=true;clearAggro();toast('Bạn đã chết');setTimeout(respawn,2200);}}
function respawn(){dead=false;hp=maxHp;updHp();clearAggro();if(inside)exitBuilding();player.position.set(0,0,16);standY=0;player.visible=true;toast('Hồi sinh — bot đã nguội');}
function toggleCar(){if(dead||inside)return;if(inCar){inCar=false;carRef=null;player.visible=true;document.getElementById('mode').textContent='Đi bộ';return;}var best=null,bd=4.2;for(var ci=0;ci<cars.length;ci++){var d=player.position.distanceTo(cars[ci].g.position);if(d<bd){bd=d;best=cars[ci];}}if(best){inCar=true;carRef=best;player.visible=false;document.getElementById('mode').textContent=best.kind==='lambo'?'Lamborghini':'Xe';toast('Đã lên xe');}else toast('Lại gần xe hơn');}
function nearEnterable(){if(inside||inCar)return null;var best=null,bd=5.5;for(var i=0;i<enterables.length;i++){var b=enterables[i];var d=Math.hypot(player.position.x-b.x,player.position.z-b.doorZ);if(d<bd&&player.position.y<4){bd=d;best=b;}}return best;}
function tryLoot(){for(var i=0;i<loots.length;i++){var L=loots[i];if(L.taken)continue;if(player.position.distanceTo(L.g.position)<2.2){L.taken=true;L.g.visible=false;if(L.kind==='grenade'){grenades+=3;toast('Nhặt 💣 ×3 (phím G)');}else{unlocked[L.kind]=true;gun=L.kind;toast('Nhặt 🔫 '+GUNS[L.kind].name);refreshMenu();}return true;}}return false;}
function tryEnter(){if(inside){exitBuilding();return;}var b=nearEnterable();if(!b){toast('Gần cửa hoặc lên nóc nhặt súng');return;}outsidePos.copy(player.position);inside=true;cityRoot.visible=false;interior.visible=true;scene.background=new THREE.Color(0x1a2332);scene.fog=null;player.position.set(0,0,6);standY=0;document.getElementById('mode').textContent=b.name;toast('Vào: '+b.name);}
function exitBuilding(){inside=false;cityRoot.visible=true;interior.visible=false;scene.background=new THREE.Color(0x87b8dc);scene.fog=new THREE.Fog(0x87b8dc,120,400);player.position.copy(outsidePos);player.position.z+=3;standY=0;document.getElementById('mode').textContent='Đi bộ';toast('Ra ngoài');}
function blocked(x,z,rad){rad=rad||0.45;if(inside)return Math.abs(x)>8||Math.abs(z)>8;for(var bi=0;bi<buildings.length;bi++){var b=buildings[bi];if(Math.abs(x-b.x)<b.w/2+rad&&Math.abs(z-b.z)<b.d/2+rad)return true;}return false;}
function supportY(x,z){if(inside)return 0;var best=0;for(var i=0;i<platforms.length;i++){var p=platforms[i];if(Math.abs(x-p.x)<p.w/2&&Math.abs(z-p.z)<p.d/2){if(p.y>best)best=p.y;}}return best;}
function fire(from,dir,isPlayer,gtype){var gdef=GUNS[gtype||gun];var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.11,6,6),new THREE.MeshBasicMaterial({color:gdef.color}));mesh.position.copy(from);scene.add(mesh);var d=dir.clone().normalize();d.x+=rnd(-gdef.spread,gdef.spread);d.z+=rnd(-gdef.spread,gdef.spread);d.normalize();bullets.push({mesh:mesh,vel:d.multiplyScalar(gdef.spd),life:1.5,dmg:gdef.dmg,fromPlayer:!!isPlayer});}
function playerShoot(){if(shootCD>0||dead||inCar)return;shootCD=GUNS[gun].cd;var origin=player.position.clone();origin.y=standY+1.35;fire(origin,new THREE.Vector3(Math.sin(faceYaw),0,Math.cos(faceYaw)),true,gun);}
function throwGrenade(){if(grenades<=0||grenCD>0||dead||inCar){if(grenades<=0)toast('Lên nóc nhặt lựu đạn');return;}grenades--;grenCD=1.2;refreshMenu();var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.22,10,8),mat(0x166534,0.4,0.3));mesh.position.copy(player.position);mesh.position.y=standY+1.2;scene.add(mesh);var dir=new THREE.Vector3(Math.sin(faceYaw),0.55,Math.cos(faceYaw)).normalize().multiplyScalar(14);grenadeObjs.push({mesh:mesh,vel:dir,life:2.2});toast('Ném lựu đạn!');}
var clock=new THREE.Clock(),hitCD=0;
function animate(){
requestAnimationFrame(animate);var dt=Math.min(clock.getDelta(),0.05);walkT+=dt;hitCD=Math.max(0,hitCD-dt);shootCD=Math.max(0,shootCD-dt);grenCD=Math.max(0,grenCD-dt);
var near=nearEnterable();var pr=document.getElementById('prompt');var lootNear=false;
for(var li=0;li<loots.length;li++)if(!loots[li].taken&&player.position.distanceTo(loots[li].g.position)<2.5)lootNear=true;
if(lootNear){pr.textContent='E — Nhặt vật phẩm';pr.classList.add('show');}
else if(near&&!inside){pr.textContent=near.name+' — E vào';pr.classList.add('show');}
else if(inside){pr.textContent='E — Ra ngoài';pr.classList.add('show');}
else pr.classList.remove('show');
if(!dead){
var fwd=new THREE.Vector3(Math.sin(camYaw),0,Math.cos(camYaw));var right=new THREE.Vector3(Math.cos(camYaw),0,-Math.sin(camYaw));
var sprint=keys.ShiftLeft||keys.ShiftRight;var sp=inCar?(sprint?26:15):(sprint?8.5:4.5);var mv=new THREE.Vector3();
if(keys.KeyW||keys.ArrowUp)mv.add(fwd);if(keys.KeyS||keys.ArrowDown)mv.sub(fwd);
if(keys.KeyA||keys.ArrowLeft)mv.add(right);if(keys.KeyD||keys.ArrowRight)mv.sub(right);
if(joy.active&&(Math.abs(joy.x)>0.08||Math.abs(joy.y)>0.08)){mv.addScaledVector(fwd,joy.y);mv.addScaledVector(right,-joy.x);}
var moving=mv.lengthSq()>0.0001;
if(moving){mv.normalize();faceYaw=Math.atan2(mv.x,mv.z);mv.multiplyScalar(sp*dt);var nx=player.position.x+mv.x,nz=player.position.z+mv.z;if(!blocked(nx,nz,inCar?1.2:0.45)){player.position.x=nx;player.position.z=nz;}}
if(keys.Space&&onGround&&!inCar){vy=9;onGround=false;}
vy-=28*dt;player.position.y+=vy*dt;
var sy=supportY(player.position.x,player.position.z);
if(player.position.y<=sy){player.position.y=sy;vy=0;onGround=true;standY=sy;}else{onGround=false;standY=player.position.y;}
player.rotation.y=faceYaw;if(!inCar)walkAnim(player,walkT,moving&&onGround);
if(inCar&&carRef){carRef.g.position.x=player.position.x;carRef.g.position.z=player.position.z;carRef.g.rotation.y=faceYaw;player.position.y=0;standY=0;}
if(keys.Shoot)playerShoot();document.getElementById('spd').textContent=Math.round((moving?sp:0)*3.6)+' km/h';
}
for(var gi=grenadeObjs.length-1;gi>=0;gi--){var gr=grenadeObjs[gi];gr.life-=dt;gr.vel.y-=18*dt;gr.mesh.position.addScaledVector(gr.vel,dt);if(gr.mesh.position.y<0.3){gr.mesh.position.y=0.3;gr.vel.y*=-0.3;gr.vel.x*=0.7;gr.vel.z*=0.7;}
if(gr.life<=0){for(var ni=0;ni<npcs.length;ni++){var n=npcs[ni];if(n.dead)continue;var d=n.g.position.distanceTo(gr.mesh.position);if(d<8){n.hp-=Math.max(20,70-d*6);n.aggroT=4;if(n.hp<=0){n.dead=true;n.g.rotation.z=Math.PI/2;n.g.position.y=0.2;toast('Boom!');}}}scene.remove(gr.mesh);grenadeObjs.splice(gi,1);}}
for(var bi=bullets.length-1;bi>=0;bi--){var bu=bullets[bi];bu.life-=dt;bu.mesh.position.addScaledVector(bu.vel,dt);if(bu.life<=0){scene.remove(bu.mesh);bullets.splice(bi,1);continue;}
if(bu.fromPlayer){for(var ni=0;ni<npcs.length;ni++){var n=npcs[ni];if(n.dead||!cityRoot.visible)continue;if(bu.mesh.position.distanceTo(new THREE.Vector3(n.g.position.x,1.2,n.g.position.z))<1){n.hp-=bu.dmg;n.aggroT=5;scene.remove(bu.mesh);bullets.splice(bi,1);if(n.hp<=0){n.dead=true;n.g.rotation.z=Math.PI/2;n.g.position.y=0.2;n.aggroT=0;toast('Hạ gục!');}break;}}}
else if(!dead&&bu.mesh.position.distanceTo(new THREE.Vector3(player.position.x,standY+1.2,player.position.z))<0.9){hurt(bu.dmg);scene.remove(bu.mesh);bullets.splice(bi,1);}}
if(cityRoot.visible){
for(i=0;i<cars.length;i++){var c=cars[i];if(inCar&&c===carRef)continue;var nx=c.g.position.x,nz=c.g.position.z;
if(c.ax==='x'){nx+=c.spd*c.dir*dt;if(Math.abs(nx)>150)c.dir*=-1;c.g.rotation.y=c.dir>0?-Math.PI/2:Math.PI/2;}
else{nz+=c.spd*c.dir*dt;if(Math.abs(nz)>150)c.dir*=-1;c.g.rotation.y=c.dir>0?0:Math.PI;}
if(!blocked(nx,nz,1.4)){c.g.position.x=nx;c.g.position.z=nz;}else c.dir*=-1;
if(!dead&&!inCar&&hitCD<=0&&player.position.distanceTo(c.g.position)<2.4&&standY<1.5){hurt(Math.min(40,14+c.spd*2));hitCD=1.2;toast('Đâm xe!');}}
for(i=0;i<npcs.length;i++){var n=npcs[i];if(n.dead)continue;n.shootCD=Math.max(0,n.shootCD-dt);if(n.aggroT>0)n.aggroT-=dt;
var toP=new THREE.Vector3().subVectors(player.position,n.g.position);var dist=toP.length();
if(n.aggroT>0&&dist<32&&!dead){n.face=Math.atan2(toP.x,toP.z);n.g.rotation.y=n.face;
if(dist>12){var step=toP.normalize().multiplyScalar(2.2*dt);var nnx=n.g.position.x+step.x,nnz=n.g.position.z+step.z;if(!blocked(nnx,nnz,0.4)){n.g.position.x=nnx;n.g.position.z=nnz;}walkAnim(n.g,walkT+i,true);}
if(n.shootCD<=0&&dist<26&&dist>4){n.shootCD=1.4+Math.random()*0.6;var o=n.g.position.clone();o.y=1.3;fire(o,new THREE.Vector3(Math.sin(n.face)+rnd(-0.12,0.12),0,Math.cos(n.face)+rnd(-0.12,0.12)),false,'pistol');}}
else{n.a+=dt*0.22;var nnx=n.g.position.x+Math.cos(n.a)*n.s*dt,nnz=n.g.position.z+Math.sin(n.a)*n.s*dt;if(!blocked(nnx,nnz,0.4)){n.g.position.x=nnx;n.g.position.z=nnz;}else n.a+=1.2;n.g.rotation.y=-n.a+Math.PI/2;walkAnim(n.g,walkT+i,true);}}
}
for(i=0;i<loots.length;i++)if(!loots[i].taken)loots[i].g.position.y=loots[i].y+Math.sin(walkT*2+i)*0.15;
var dist=inside?7:12,ch=inside?3.5:5.2+pitch*5;var px=player.position.x,pz=player.position.z,py=player.position.y;var cy=inside?faceYaw:camYaw;
camera.position.x=px-Math.sin(cy)*dist;camera.position.z=pz-Math.cos(cy)*dist;camera.position.y=py+ch;camera.lookAt(px,py+1.4,pz);renderer.render(scene,camera);}
updHp();refreshMenu();var loadEl=document.getElementById('load');if(loadEl)loadEl.classList.add('hide');animate();
window.addEventListener('resize',function(){W=innerWidth;H=innerHeight;camera.aspect=W/H;camera.updateProjectionMatrix();renderer.setSize(W,H);});
}
wait(0);
})();
