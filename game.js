(function boot(n){
if(typeof THREE==='undefined'||!THREE.OrbitControls){if(n<90)return setTimeout(function(){boot(n+1)},200);return;}
var box=document.getElementById('canvas3d');
function size(){return {w:box.clientWidth||window.innerWidth,h:box.clientHeight||window.innerHeight};}
var s0=size(),renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));renderer.setSize(s0.w,s0.h);box.appendChild(renderer.domElement);
var scene=new THREE.Scene();scene.background=new THREE.Color(0x02040a);
var camera=new THREE.PerspectiveCamera(55,s0.w/s0.h,0.1,8000);
var CAM0=new THREE.Vector3(0,70,160),TGT0=new THREE.Vector3(0,0,0);
camera.position.copy(CAM0);
var controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=5;controls.maxDistance=2200;controls.target.copy(TGT0);
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
var TEX={mercury:rocky('#9c8f80','rgba(60,50,40,.55)'),venus:rocky('#e0b878','rgba(160,110,50,.5)'),earth:earthTex,mars:rocky('#c25a38','rgba(100,40,20,.55)'),jupiter:gas(['#c9a06a','#e3c9a0','#b07d4e'],true),saturn:gas(['#d8c08a','#e8d8a8','#c4a868'],false),uranus:gas(['#a8e0e8','#8fd0dc'],false),neptune:gas(['#3a5fc8','#4a72d8'],false),
ceres:rocky('#a8a090','rgba(50,45,40,.5)'),pluto:rocky('#d4b896','rgba(90,70,50,.5)'),haumea:rocky('#e8dcc8','rgba(120,100,80,.45)'),makemake:rocky('#c47848','rgba(80,40,20,.5)'),eris:rocky('#d8e0e8','rgba(90,100,110,.5)')};
var PD=[
{id:'sun',vi:'Mặt Trời',radius:8,dist:0,speed:0,rot:.002},
{id:'mercury',vi:'Sao Thủy',radius:1.15,dist:18,speed:.045,rot:.004},
{id:'venus',vi:'Sao Kim',radius:1.85,dist:26,speed:.035,rot:.002},
{id:'earth',vi:'Trái Đất',radius:2,dist:36,speed:.028,rot:.02,moons:[{id:'moon',vi:'Mặt Trăng',r:.55,d:3.6,sp:.05}]},
{id:'mars',vi:'Sao Hỏa',radius:1.45,dist:48,speed:.022,rot:.018,moons:[{id:'phobos',vi:'Phobos',r:.22,d:2.4,sp:.09}]},
{id:'jupiter',vi:'Sao Mộc',radius:4.6,dist:72,speed:.011,rot:.04,moons:[
{id:'io',vi:'Io',r:.38,d:6.2,sp:.08},{id:'europa',vi:'Europa',r:.36,d:7.8,sp:.06},
{id:'ganymede',vi:'Ganymede',r:.48,d:9.6,sp:.045},{id:'callisto',vi:'Callisto',r:.44,d:11.5,sp:.03}]},
{id:'saturn',vi:'Sao Thổ',radius:3.9,dist:100,speed:.0075,rot:.038,ring:true,moons:[{id:'titan',vi:'Titan',r:.42,d:8.5,sp:.04}]},
{id:'uranus',vi:'Thiên Vương',radius:2.85,dist:128,speed:.0052,rot:.03,ring:true,ringColor:0x9ad4e0},
{id:'neptune',vi:'Hải Vương',radius:2.75,dist:154,speed:.004,rot:.032,moons:[{id:'triton',vi:'Triton',r:.36,d:5.2,sp:.035}]},
{id:'ceres',vi:'Ceres',radius:.9,dist:58,speed:.016,rot:.01,dwarf:true},
{id:'pluto',vi:'Sao Diêm Vương',radius:1.05,dist:178,speed:.0028,rot:.008,dwarf:true,moons:[{id:'charon',vi:'Charon',r:.4,d:2.8,sp:.04}]},
{id:'haumea',vi:'Haumea',radius:.95,dist:195,speed:.0024,rot:.012,dwarf:true},
{id:'makemake',vi:'Makemake',radius:.92,dist:210,speed:.0021,rot:.009,dwarf:true},
{id:'eris',vi:'Eris',radius:1.0,dist:235,speed:.0017,rot:.007,dwarf:true}
];
var planets=[],orbits=[],clickables=[],projectiles=[],effects=[],comets=[],passers=[],labels=document.getElementById('labels');
function addLabel(text,isDwarf){var lb=document.createElement('div');lb.className='planet-label'+(isDwarf?' dwarf':'');lb.textContent=text;labels.appendChild(lb);return lb;}
PD.forEach(function(d){
var pivot=new THREE.Object3D();scene.add(pivot);
var group=new THREE.Object3D();group.position.x=d.dist;pivot.add(group);
var mesh;
if(d.id==='sun'){mesh=sun;}
else{
var mat=new THREE.MeshStandardMaterial({map:TEX[d.id]||rocky('#aaa','rgba(40,40,40,.5)'),roughness:d.dwarf?0.9:0.72,metalness:0});
mesh=new THREE.Mesh(new THREE.SphereGeometry(d.radius,d.dwarf?20:32,d.dwarf?20:32),mat);
group.add(mesh);
}
if(d.ring){
var inner=d.radius*1.3,outer=d.radius*(d.id==='uranus'?1.9:2.35);
var rg=new THREE.Mesh(new THREE.RingGeometry(inner,outer,72),new THREE.MeshBasicMaterial({color:d.ringColor||0xc9b896,side:THREE.DoubleSide,transparent:true,opacity:.72}));
rg.rotation.x=d.id==='uranus'?-Math.PI/2.4:-Math.PI/2;group.add(rg);
if(d.id==='saturn'){var rg2=new THREE.Mesh(new THREE.RingGeometry(outer*1.02,outer*1.18,64),new THREE.MeshBasicMaterial({color:0xa89070,side:THREE.DoubleSide,transparent:true,opacity:.4}));rg2.rotation.x=-Math.PI/2;group.add(rg2);}
}
if(d.moons){d.moons.forEach(function(md){
var mp=new THREE.Object3D();group.add(mp);
var mm=new THREE.Mesh(new THREE.SphereGeometry(md.r,16,16),new THREE.MeshStandardMaterial({map:moonTex,roughness:1}));
mm.position.x=md.d;mp.add(mm);
var mo={data:{id:md.id,vi:md.vi,radius:md.r,dist:0,speed:0,rot:.01},mesh:mm,pivot:null,group:null,label:addLabel(md.vi),destroyed:false,life:null,lifeMesh:null,damage:0,craters:[],isMoon:true,moonPivot:mp,moonSp:md.sp};
mm.userData.planet=mo;clickables.push(mm);planets.push(mo);
});}
if(d.dist>0){
var pts=[];for(var i=0;i<100;i++){var a=i/100*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*d.dist,0,Math.sin(a)*d.dist));}
var line=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:d.dwarf?0x5a4a6a:0x3d5278,transparent:true,opacity:d.dwarf?0.28:0.38}));
scene.add(line);orbits.push(line);
}
var obj={data:d,pivot:pivot,group:group,mesh:mesh,label:addLabel(d.vi,d.dwarf),destroyed:false,life:null,lifeMesh:null,damage:0,craters:[]};
mesh.userData.planet=obj;if(d.id!=='sun')clickables.push(mesh);planets.push(obj);
});
function makeBelt(inner,outer,count,ySpread,sizeMin,sizeMax,color){
var pos=[];for(var i=0;i<count;i++){var rr=rnd(inner,outer),a=rnd(0,6.28),yy=rnd(-ySpread,ySpread);pos.push(Math.cos(a)*rr,yy,Math.sin(a)*rr);}
var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
var pts=new THREE.Points(geo,new THREE.PointsMaterial({color:color,size:(sizeMin+sizeMax)/2,sizeAttenuation:true,transparent:true,opacity:.85}));
scene.add(pts);return pts;
}
var asteroidBelt=makeBelt(54,64,900,.8,0.35,0.9,0xb8a890);
var kuiperBelt=makeBelt(165,250,1400,3,0.4,1.1,0x8a9bb8);
function addComet(dist,speed){
var g=new THREE.Group();
var head=new THREE.Mesh(new THREE.SphereGeometry(.35,10,10),new THREE.MeshBasicMaterial({color:0xe8f4ff}));
g.add(head);
var tailGeo=new THREE.BufferGeometry();
var tp=[];for(var i=0;i<40;i++)tp.push(-i*.35,rnd(-.1,.1),rnd(-.1,.1));
tailGeo.setAttribute('position',new THREE.Float32BufferAttribute(tp,3));
var tail=new THREE.Points(tailGeo,new THREE.PointsMaterial({color:0x88ccff,size:.45,transparent:true,opacity:.7,sizeAttenuation:true}));
g.add(tail);
var pivot=new THREE.Object3D();pivot.add(g);g.position.x=dist;scene.add(pivot);
comets.push({pivot:pivot,group:g,speed:speed,angle:rnd(0,6.28)});
}
addComet(88,.0065);addComet(130,.004);addComet(200,.0025);
function spawnPasser(){
var g=new THREE.Group();
var n=8+Math.floor(rnd(0,12));
for(var i=0;i<n;i++){
var m=new THREE.Mesh(new THREE.SphereGeometry(rnd(.08,.28),6,6),new THREE.MeshBasicMaterial({color:0xc8b8a0}));
m.position.set(rnd(-4,4),rnd(-1.5,1.5),rnd(-2,2));g.add(m);
}
var ang=rnd(0,6.28),R=rnd(40,280);
g.position.set(Math.cos(ang)*R,rnd(-8,8),Math.sin(ang)*R);
var dir=new THREE.Vector3(rnd(-1,1),rnd(-.15,.15),rnd(-1,1)).normalize().multiplyScalar(rnd(8,22));
scene.add(g);passers.push({g:g,vel:dir,life:rnd(8,18)});
}
for(var pi=0;pi<5;pi++)spawnPasser();
var soundOn=true,ac=null;
function beep(type,vol,freq,dur){if(!soundOn)return;try{if(!ac)ac=new (window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=freq;g.gain.value=vol;o.connect(g);g.connect(ac.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+dur);o.stop(ac.currentTime+dur+.05);}catch(e){}}
function boom(){beep('sawtooth',.5,50,.14);setTimeout(function(){beep('square',.25,35,.1)},90);}
var mode='explore',weapon='meteor',seed='forest',paused=false,speed=1,showOrbit=true,showLabel=true,isFs=false;
var fly={a:false,t:0,fp:new THREE.Vector3(),ft:new THREE.Vector3(),tp:new THREE.Vector3(),tt:new THREE.Vector3()};
var _v=new THREE.Vector3(),_wp=new THREE.Vector3(),_d=new THREE.Vector3(),clock=new THREE.Clock();
var WNAMES={meteor:'Thiên thạch',laser:'Laser',gamma:'Tia gamma',alien:'Hạm đội ngoài hành tinh',nova:'Siêu tân tinh'};
var SNAMES={forest:'Rừng',ocean:'Đại dương',city:'Thành phố',farm:'Nông trại',animal:'Động vật',atmo:'Khí quyển'};
function toast(m){var t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(function(){t.classList.remove('show');},2200);}
function setMode(m){mode=m;document.querySelectorAll('[data-mode]').forEach(function(b){b.classList.toggle('on',b.dataset.mode===m);});
document.getElementById('modeHint').textContent='Chế độ: '+(m==='explore'?'Khám phá':m==='destroy'?'Hủy diệt':'Tái tạo sự sống');
document.getElementById('subHint').textContent=m==='destroy'?'Vũ khí: '+WNAMES[weapon]:m==='create'?'Gieo: '+SNAMES[seed]:'Chạm hành tinh để bay tới';}
function setWeapon(w){weapon=w;document.querySelectorAll('[data-weapon]').forEach(function(b){b.classList.toggle('on',b.dataset.weapon===w);});if(mode==='destroy')document.getElementById('subHint').textContent='Vũ khí: '+WNAMES[w];}
function setSeed(s){seed=s;document.querySelectorAll('[data-seed]').forEach(function(b){b.classList.toggle('on',b.dataset.seed===s);});if(mode==='create')document.getElementById('subHint').textContent='Gieo: '+SNAMES[s];}
document.querySelectorAll('[data-mode]').forEach(function(b){b.onclick=function(){setMode(b.dataset.mode);};});
document.querySelectorAll('[data-weapon]').forEach(function(b){b.onclick=function(){setWeapon(b.dataset.weapon);setMode('destroy');};});
document.querySelectorAll('[data-seed]').forEach(function(b){b.onclick=function(){setSeed(b.dataset.seed);setMode('create');};});
document.getElementById('menuBtn').onclick=function(){document.getElementById('menu').classList.toggle('open');};
document.getElementById('btnPause').onclick=function(){paused=!paused;this.textContent=paused?'▶ Tiếp tục':'⏸ Tạm dừng';this.classList.toggle('on',!paused);};
document.getElementById('btnOrbit').onclick=function(){showOrbit=!showOrbit;orbits.forEach(function(o){o.visible=showOrbit;});this.classList.toggle('on',showOrbit);};
document.getElementById('btnLabel').onclick=function(){showLabel=!showLabel;this.classList.toggle('on',showLabel);};
document.getElementById('btnSound').onclick=function(){soundOn=!soundOn;this.classList.toggle('on',soundOn);this.textContent=soundOn?'🔊 Âm thanh':'🔇 Tắt tiếng';};
document.getElementById('speedRange').oninput=function(){speed=0.05+this.value/100*2.5;};
document.getElementById('btnReset').onclick=function(){resetAll();};
var btnCam=document.getElementById('btnCamReset');
if(btnCam)btnCam.onclick=function(){resetCamera();};
function resetCamera(){
fly.fp.copy(camera.position);fly.ft.copy(controls.target);
fly.tp.copy(CAM0);fly.tt.copy(TGT0);fly.t=0;fly.a=true;controls.enabled=false;
toast('📷 Góc nhìn ban đầu');
}
function resetAll(){planets.forEach(function(p){p.destroyed=false;p.life=null;p.damage=0;p.mesh.visible=true;p.mesh.scale.set(1,1,1);
if(p.lifeMesh){p.mesh.remove(p.lifeMesh);p.lifeMesh=null;}
if(p.craters){p.craters.forEach(function(c){p.mesh.remove(c);});p.craters=[];}});
toast('↺ Đã khôi phục trạng thái ban đầu');setMode('explore');resetCamera();}
function resize(){var s=size();if(s.w<2||s.h<2)return;camera.aspect=s.w/s.h;camera.updateProjectionMatrix();renderer.setSize(s.w,s.h);}
function setFs(on){isFs=!!on;document.body.classList.toggle('fs',isFs);document.getElementById('menu').classList.remove('open');
requestAnimationFrame(function(){requestAnimationFrame(resize);});toast(isFs?'Toàn màn hình — bấm ☰ menu':'Thu nhỏ');}
document.getElementById('fsBtn').onclick=function(){setFs(!isFs);};
var btnExit=document.getElementById('btnExitFs');if(btnExit)btnExit.onclick=function(){setFs(false);};
function flyTo(p){if(!p||!p.mesh||p.destroyed)return;p.mesh.getWorldPosition(_wp);_d.subVectors(camera.position,_wp).normalize();var off=(p.data.radius||1)*5+4;_v.copy(_wp).addScaledVector(_d,off);_v.y+=(p.data.radius||1);
fly.fp.copy(camera.position);fly.ft.copy(controls.target);fly.tp.copy(_v);fly.tt.copy(_wp);fly.t=0;fly.a=true;controls.enabled=false;}
function onPlanetAction(p){
if(mode==='explore')flyTo(p);
else if(mode==='destroy')attack(p);
else seedPlanet(p,seed);
}
var nav=document.getElementById('planetNav');
PD.forEach(function(d){var b=document.createElement('button');b.className='btn';b.textContent=d.vi+(d.dwarf?' · lùn':'');b.onclick=function(){var p=planets.find(function(x){return x.data.id===d.id});if(p)onPlanetAction(p);};nav.appendChild(b);});
var ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
renderer.domElement.addEventListener('pointerdown',function(e){
if(e.button!==0)return;var r=renderer.domElement.getBoundingClientRect();
mouse.x=((e.clientX-r.left)/r.width)*2-1;mouse.y=-((e.clientY-r.top)/r.height)*2+1;
ray.setFromCamera(mouse,camera);var hits=ray.intersectObjects(clickables,false);
if(hits.length&&hits[0].object.userData.planet)onPlanetAction(hits[0].object.userData.planet);
});
function sm(t){return t*t*(3-2*t)}
function spawnDebris(pos,col,n){
var geo=new THREE.BufferGeometry();var arr=[],vels=[];
for(var i=0;i<n;i++){arr.push(pos.x,pos.y,pos.z);vels.push(new THREE.Vector3(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(2,9)));}
geo.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));
var mesh=new THREE.Points(geo,new THREE.PointsMaterial({color:col,size:.6,transparent:true,opacity:1,sizeAttenuation:true}));
scene.add(mesh);effects.push({mesh:mesh,vels:vels,life:1.2});
}
function attack(p){
if(!p||p.destroyed||p.data.id==='sun'){if(p&&p.data.id==='sun')toast('Không hủy được Mặt Trời');return;}
p.mesh.getWorldPosition(_wp);boom();
if(weapon==='meteor'){
var rock=new THREE.Mesh(new THREE.SphereGeometry(.4,8,8),new THREE.MeshBasicMaterial({color:0x886644}));
rock.position.copy(camera.position);scene.add(rock);
var dir=_wp.clone().sub(camera.position).normalize();
projectiles.push({mesh:rock,vel:dir.multiplyScalar(55),target:p,kind:'meteor',life:3});
toast('☄️ Thiên thạch → '+p.data.vi);
}else if(weapon==='laser'){
var beam=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1,6),new THREE.MeshBasicMaterial({color:0x44ffaa}));
var mid=camera.position.clone().lerp(_wp,.5);beam.position.copy(mid);
beam.scale.y=_wp.distanceTo(camera.position);beam.lookAt(_wp);beam.rotateX(Math.PI/2);scene.add(beam);
effects.push({mesh:beam,vels:[],life:.35});
hitPlanet(p,28);toast('🔦 Laser → '+p.data.vi);
}else if(weapon==='gamma'){
var ring=new THREE.Mesh(new THREE.RingGeometry(.2,1.2,32),new THREE.MeshBasicMaterial({color:0xaa66ff,side:THREE.DoubleSide,transparent:true,opacity:.9}));
ring.position.copy(_wp);scene.add(ring);effects.push({mesh:ring,vels:[],life:.5});
hitPlanet(p,40);toast('☢️ Tia gamma → '+p.data.vi);
}else if(weapon==='alien'){
for(var i=0;i<5;i++){var ship=new THREE.Mesh(new THREE.ConeGeometry(.25,.7,4),new THREE.MeshBasicMaterial({color:0x66ffcc}));
ship.position.copy(camera.position).add(new THREE.Vector3(rnd(-3,3),rnd(-2,2),rnd(-3,3)));scene.add(ship);
var dir2=_wp.clone().sub(ship.position).normalize();
projectiles.push({mesh:ship,vel:dir2.multiplyScalar(40+i*3),target:p,kind:'alien',life:2.5});}
toast('👽 Hạm đội → '+p.data.vi);
}else if(weapon==='nova'){
spawnDebris(_wp,0xff8844,60);hitPlanet(p,100);toast('💥 Siêu tân tinh → '+p.data.vi);
}
}
function hitPlanet(p,dmg){
if(p.destroyed)return;p.damage+=dmg;
var crater=new THREE.Mesh(new THREE.SphereGeometry(p.data.radius*(.08+Math.min(p.damage,80)/400),8,8),new THREE.MeshBasicMaterial({color:0x221100}));
crater.position.set(rnd(-.5,.5)*p.data.radius,rnd(-.5,.5)*p.data.radius,p.data.radius*.85);p.mesh.add(crater);p.craters.push(crater);
p.mesh.getWorldPosition(_wp);spawnDebris(_wp,0xffaa66,18);
if(p.damage>=100){p.destroyed=true;p.mesh.visible=false;if(p.lifeMesh){p.mesh.remove(p.lifeMesh);p.lifeMesh=null;}toast('💀 '+p.data.vi+' bị hủy diệt');boom();}
}
function seedPlanet(p,kind){
if(!p||p.destroyed||p.data.id==='sun')return;
if(p.lifeMesh){p.mesh.remove(p.lifeMesh);p.lifeMesh=null;}
var g=new THREE.Group();var col={forest:0x2d8a4a,ocean:0x1e6fbb,city:0x94a3b8,farm:0xc4a35a,animal:0xa07850,atmo:0x7dd3fc}[kind]||0x4ade80;
if(kind==='ocean'){var oc=new THREE.Mesh(new THREE.SphereGeometry(p.data.radius*1.02,24,24),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.45}));g.add(oc);}
else if(kind==='atmo'){var at=new THREE.Mesh(new THREE.SphereGeometry(p.data.radius*1.12,24,24),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.22}));g.add(at);}
else{for(var i=0;i<12;i++){var bl=new THREE.Mesh(new THREE.SphereGeometry(p.data.radius*.12,8,8),new THREE.MeshBasicMaterial({color:col}));
var u=rnd(0,6.28),v=rnd(-1,1);bl.position.set(Math.cos(u)*Math.sqrt(1-v*v)*p.data.radius*1.05,v*p.data.radius*1.05,Math.sin(u)*Math.sqrt(1-v*v)*p.data.radius*1.05);g.add(bl);}}
p.mesh.add(g);p.lifeMesh=g;p.life=kind;beep('sine',.2,440,.08);toast('🌱 '+SNAMES[kind]+' → '+p.data.vi);}
function animate(){
requestAnimationFrame(animate);var dt=Math.min(clock.getDelta(),.05);
controls.update();
if(!paused){
sun.rotation.y+=.002*dt*60*speed;corona.rotation.y-=.001*dt*60*speed;
asteroidBelt.rotation.y+=.0008*dt*60*speed;kuiperBelt.rotation.y+=.00035*dt*60*speed;
planets.forEach(function(p){
if(p.isMoon){if(p.moonPivot)p.moonPivot.rotation.y+=(p.moonSp||.04)*dt*60*speed*.5;if(p.mesh)p.mesh.rotation.y+=.01*dt*60*speed;return;}
if(p.data.dist>0&&p.pivot)p.pivot.rotation.y+=p.data.speed*dt*60*speed*.5;
if(p.mesh&&p.data.id!=='sun')p.mesh.rotation.y+=p.data.rot*dt*60*speed*.5;
if(p.lifeMesh)p.lifeMesh.rotation.y+=dt*.35;
});
comets.forEach(function(c){c.angle+=c.speed*dt*60*speed;c.pivot.rotation.y=c.angle;c.group.rotation.y=-c.angle;});
for(var pi=passers.length-1;pi>=0;pi--){var ps=passers[pi];ps.life-=dt;ps.g.position.addScaledVector(ps.vel,dt);
if(ps.life<=0){scene.remove(ps.g);passers.splice(pi,1);if(Math.random()>.4)spawnPasser();}}
if(passers.length<3&&Math.random()<.01)spawnPasser();
}
if(fly.a){fly.t=Math.min(1,fly.t+dt*1.35);var s=sm(fly.t);camera.position.lerpVectors(fly.fp,fly.tp,s);controls.target.lerpVectors(fly.ft,fly.tt,s);if(fly.t>=1){fly.a=false;controls.enabled=true;}}
for(var qi=projectiles.length-1;qi>=0;qi--){var pr=projectiles[qi];pr.life-=dt;pr.mesh.position.addScaledVector(pr.vel,dt);
if(pr.target&&!pr.target.destroyed){pr.target.mesh.getWorldPosition(_wp);if(pr.mesh.position.distanceTo(_wp)<pr.target.data.radius+1.2){hitPlanet(pr.target,pr.kind==='alien'?18:35);scene.remove(pr.mesh);projectiles.splice(qi,1);continue;}}
if(pr.life<=0){scene.remove(pr.mesh);projectiles.splice(qi,1);}}
for(var ei=effects.length-1;ei>=0;ei--){var e=effects[ei];e.life-=dt*1.1;
if(e.vels&&e.vels.length){var pos=e.mesh.geometry.attributes.position;for(var k=0;k<e.vels.length;k++){pos.array[k*3]+=e.vels[k].x*dt*8;pos.array[k*3+1]+=e.vels[k].y*dt*8;pos.array[k*3+2]+=e.vels[k].z*dt*8;}pos.needsUpdate=true;if(e.mesh.material)e.mesh.material.opacity=Math.max(0,e.life);}
else if(e.mesh.material){e.mesh.material.opacity=Math.max(0,e.life);e.mesh.scale.multiplyScalar(1+dt*2);}
if(e.life<=0){scene.remove(e.mesh);effects.splice(ei,1);}}
if(showLabel){var sz=size();planets.forEach(function(p){if(!p.label||!p.mesh.visible||p.destroyed){if(p.label)p.label.style.display='none';return;}
p.mesh.getWorldPosition(_wp);_v.copy(_wp).project(camera);
if(_v.z<1&&Math.abs(_v.x)<1.4&&Math.abs(_v.y)<1.4){p.label.style.display='block';p.label.style.left=(_v.x*.5+.5)*sz.w+'px';p.label.style.top=(-_v.y*.5+.5)*sz.h+'px';}
else p.label.style.display='none';});}
else planets.forEach(function(p){if(p.label)p.label.style.display='none';});
renderer.render(scene,camera);
}
window.addEventListener('resize',resize);setMode('explore');animate();
toast('Hệ Mặt Trời đầy đủ — 8 hành tinh + 5 hành tinh lùn');
})(0);
