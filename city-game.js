(function(){
function wait(n){
  if(typeof THREE!=='undefined'){try{boot();}catch(e){document.getElementById('load').innerHTML='<div>Lỗi: '+e.message+'</div>';console.error(e);}return;}
  if(n>150){document.getElementById('load').innerHTML='<div>Không tải được Three.js</div>';return;}
  setTimeout(function(){wait(n+1);},80);
}
function boot(){
var canvas=document.getElementById('c');
var W=innerWidth,H=innerHeight;
var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.setSize(W,H);
var scene=new THREE.Scene();
scene.background=new THREE.Color(0x5eb0e0);
scene.fog=new THREE.Fog(0x5eb0e0,100,380);
var camera=new THREE.PerspectiveCamera(60,W/H,0.1,600);
camera.position.set(0,16,24);
scene.add(new THREE.HemisphereLight(0xd4ecff,0x3a4555,0.8));
var sun=new THREE.DirectionalLight(0xfff3d6,1.15);sun.position.set(70,100,40);scene.add(sun);
scene.add(new THREE.AmbientLight(0x556677,0.4));
var cityRoot=new THREE.Group();scene.add(cityRoot);
var interior=new THREE.Group();interior.visible=false;scene.add(interior);
function rnd(a,b){return a+Math.random()*(b-a);}
function mkWin(){
  var c=document.createElement('canvas');c.width=64;c.height=128;var x=c.getContext('2d');
  x.fillStyle='#2d3a4c';x.fillRect(0,0,64,128);
  for(var y=4;y<122;y+=13)for(var u=4;u<58;u+=12){
    x.fillStyle=Math.random()>0.28?(Math.random()>0.65?'#fde68a':'#93c5fd'):'#0b1220';
    x.fillRect(u,y,9,10);
  }
  var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
}
var winTex=mkWin();
var ground=new THREE.Mesh(new THREE.PlaneGeometry(480,480),new THREE.MeshLambertMaterial({color:0x2c333c}));
ground.rotation.x=-Math.PI/2;cityRoot.add(ground);
var i,gx,gz;
for(i=-7;i<=7;i++){
  var roadZ=new THREE.Mesh(new THREE.PlaneGeometry(20,480),new THREE.MeshLambertMaterial({color:0x141414}));
  roadZ.rotation.x=-Math.PI/2;roadZ.position.set(i*42,0.04,0);cityRoot.add(roadZ);
  var roadX=new THREE.Mesh(new THREE.PlaneGeometry(480,20),new THREE.MeshLambertMaterial({color:0x141414}));
  roadX.rotation.x=-Math.PI/2;roadX.position.set(0,0.04,i*42);cityRoot.add(roadX);
  var line=new THREE.Mesh(new THREE.PlaneGeometry(0.35,480),new THREE.MeshBasicMaterial({color:0xfbbf24}));
  line.rotation.x=-Math.PI/2;line.position.set(i*42,0.05,0);cityRoot.add(line);
}
var buildings=[],enterables=[];
var names=['Công ty Hardwin','Nhà ăn','Nhà hát','Khách sạn','Ngân hàng','Siêu thị','Cafe','Bệnh viện'];
for(gx=-5;gx<=5;gx++)for(gz=-5;gz<=5;gz++){
  if(Math.abs(gx)+Math.abs(gz)<1)continue;
  if(Math.random()<0.08)continue;
  var h=rnd(16,52),bw=rnd(13,22),bd=rnd(13,22);
  var mat=new THREE.MeshLambertMaterial({map:winTex.clone(),color:new THREE.Color().setHSL(rnd(0.52,0.62),0.12,rnd(0.42,0.62))});
  mat.map.repeat.set(Math.max(2,bw/3),Math.max(3,h/5));
  var mesh=new THREE.Mesh(new THREE.BoxGeometry(bw,h,bd),mat);
  var px=gx*42+rnd(-4,4),pz=gz*42+rnd(-4,4);
  mesh.position.set(px,h/2,pz);cityRoot.add(mesh);
  var roof=new THREE.Mesh(new THREE.BoxGeometry(bw*1.05,0.6,bd*1.05),new THREE.MeshLambertMaterial({color:0x0f172a}));
  roof.position.set(px,h+0.3,pz);cityRoot.add(roof);
  var door=new THREE.Mesh(new THREE.BoxGeometry(2.4,3.2,0.4),new THREE.MeshLambertMaterial({color:0x1e293b}));
  door.position.set(px,1.6,pz+bd/2+0.15);cityRoot.add(door);
  var b={x:px,z:pz,w:bw,d:bd,h:h,name:names[Math.abs(gx*5+gz*3)%names.length],doorZ:pz+bd/2};
  buildings.push(b);
  if(Math.random()>0.25)enterables.push(b);
}
function addTree(x,z){
  var g=new THREE.Group();
  var tr=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.28,1.6,6),new THREE.MeshLambertMaterial({color:0x6b4423}));
  tr.position.y=0.8;g.add(tr);
  var lf=new THREE.Mesh(new THREE.SphereGeometry(1.4,8,6),new THREE.MeshLambertMaterial({color:0x1f8a3c}));
  lf.position.y=2.3;g.add(lf);
  g.position.set(x,0,z);cityRoot.add(g);
}
for(i=0;i<55;i++)addTree(rnd(-180,180),rnd(-180,180));
function makePerson(skin,shirt,pants,isP){
  var g=new THREE.Group();
  var sk=new THREE.MeshLambertMaterial({color:skin});
  var sh=new THREE.MeshLambertMaterial({color:shirt});
  var pa=new THREE.MeshLambertMaterial({color:pants});
  var head=new THREE.Mesh(new THREE.SphereGeometry(0.24,12,10),sk);head.position.y=1.6;g.add(head);
  var hair=new THREE.Mesh(new THREE.SphereGeometry(0.25,8,6),new THREE.MeshLambertMaterial({color:isP?0x0f2744:0x2a1810}));
  hair.position.y=1.74;hair.scale.set(1,0.55,1);g.add(hair);
  var torso=new THREE.Mesh(new THREE.BoxGeometry(0.46,0.6,0.32),sh);torso.position.y=1.06;g.add(torso);
  var hips=new THREE.Mesh(new THREE.BoxGeometry(0.44,0.3,0.3),pa);hips.position.y=0.66;g.add(hips);
  var legL=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.6,0.18),pa);legL.position.set(-0.12,0.28,0);g.add(legL);
  var legR=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.6,0.18),pa);legR.position.set(0.12,0.28,0);g.add(legR);
  var armL=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.54,0.14),sh);armL.position.set(-0.33,1.02,0);g.add(armL);
  var armR=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.54,0.14),sh);armR.position.set(0.33,1.02,0);g.add(armR);
  var gunM=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.12,0.5),new THREE.MeshLambertMaterial({color:0x1a1a1a}));
  gunM.position.set(0.33,1.02,0.38);g.add(gunM);
  g.userData={legL:legL,legR:legR,armL:armL,armR:armR};
  return g;
}
function walkAnim(g,t,mv){
  var a=mv?Math.sin(t*11)*0.5:0;
  g.userData.legL.rotation.x=a;g.userData.legR.rotation.x=-a;
  g.userData.armL.rotation.x=-a*0.65;g.userData.armR.rotation.x=a*0.65;
}
var cars=[];
function addCar(x,z,kind){
  var g=new THREE.Group();
  var cols=kind==='lambo'?[0xffd700,0xff1a1a,0x111111,0x00e5ff]:[0xe74c3c,0x3498db,0x2ecc71,0xffffff,0x9b59b6];
  var col=cols[Math.floor(Math.random()*cols.length)];
  if(kind==='lambo'){
    var body=new THREE.Mesh(new THREE.BoxGeometry(2.3,0.42,4.8),new THREE.MeshLambertMaterial({color:col}));body.position.y=0.48;g.add(body);
    var slope=new THREE.Mesh(new THREE.BoxGeometry(2.1,0.38,2.3),new THREE.MeshLambertMaterial({color:col}));slope.position.set(0,0.78,-0.35);g.add(slope);
    var glass=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.28,1.5),new THREE.MeshLambertMaterial({color:0x88ccee,transparent:true,opacity:0.7}));glass.position.set(0,0.98,-0.25);g.add(glass);
  }else{
    var body=new THREE.Mesh(new THREE.BoxGeometry(2.1,0.52,4.1),new THREE.MeshLambertMaterial({color:col}));body.position.y=0.5;g.add(body);
    var cab=new THREE.Mesh(new THREE.BoxGeometry(1.75,0.52,2.1),new THREE.MeshLambertMaterial({color:0x87ceeb,transparent:true,opacity:0.75}));cab.position.set(0,1.02,-0.1);g.add(cab);
  }
  var wMat=new THREE.MeshLambertMaterial({color:0x111});
  [[-1,0.3,1.35],[1,0.3,1.35],[-1,0.3,-1.35],[1,0.3,-1.35]].forEach(function(p){
    var w=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.32,0.24,10),wMat);w.rotation.z=Math.PI/2;w.position.set(p[0],p[1],p[2]);g.add(w);
  });
  g.position.set(x,0,z);cityRoot.add(g);
  cars.push({g:g,spd:kind==='lambo'?rnd(9,15):rnd(5,10),dir:Math.random()>0.5?1:-1,ax:Math.random()>0.5?'x':'z',kind:kind});
}
for(i=0;i<14;i++)addCar(rnd(-150,150),rnd(-150,150),'sedan');
for(i=0;i<7;i++)addCar(rnd(-150,150),rnd(-150,150),'lambo');
var npcs=[],skins=[0xf5c6a0,0xd4a574,0xc68642,0x8d5524],shirts=[0x3b82f6,0xef4444,0x22c55e,0xa855f7,0xf59e0b],pants=[0x1e3a5f,0x374151];
for(i=0;i<14;i++){
  var p=makePerson(skins[i%4],shirts[i%5],pants[i%2],false);
  p.position.set(rnd(-120,120),0,rnd(-120,120));cityRoot.add(p);
  npcs.push({g:p,a:rnd(0,6.28),s:rnd(1.2,2.5),hp:100,dead:false,aggro:false,shootCD:0,face:0});
}
var player=makePerson(0xf5c6a0,0x38bdf8,0x0f2744,true);
player.position.set(0,0,16);scene.add(player);
var intFloor=new THREE.Mesh(new THREE.BoxGeometry(18,0.4,18),new THREE.MeshLambertMaterial({color:0x8b6914}));intFloor.position.y=0.2;interior.add(intFloor);
var wallMat=new THREE.MeshLambertMaterial({color:0xe8eef6});
[[0,3,-9,18,6,0.5],[0,3,9,18,6,0.5],[-9,3,0,0.5,6,18],[9,3,0,0.5,6,18]].forEach(function(w){
  var m=new THREE.Mesh(new THREE.BoxGeometry(w[3],w[4],w[5]),wallMat);m.position.set(w[0],w[1],w[2]);interior.add(m);
});
var rug=new THREE.Mesh(new THREE.BoxGeometry(6,0.08,4),new THREE.MeshLambertMaterial({color:0xb91c1c}));rug.position.set(0,0.42,0);interior.add(rug);
var table=new THREE.Mesh(new THREE.BoxGeometry(3,0.15,1.5),new THREE.MeshLambertMaterial({color:0x5c4033}));table.position.set(0,1.1,-2);interior.add(table);
var intLight=new THREE.PointLight(0xfff4e0,1.4,30);intLight.position.set(0,5,0);interior.add(intLight);
var ceil=new THREE.Mesh(new THREE.BoxGeometry(18,0.3,18),new THREE.MeshLambertMaterial({color:0xf1f5f9}));ceil.position.y=6.1;interior.add(ceil);
var GUNS={pistol:{name:'Pistol Hardwin',dmg:22,cd:0.28,spd:55,color:0xffee88,spread:0.02},smg:{name:'SMG Plasma',dmg:12,cd:0.09,spd:50,color:0x44ffaa,spread:0.06},rifle:{name:'Rifle Sniper',dmg:55,cd:0.7,spd:90,color:0xff6666,spread:0.005},rail:{name:'Railgun Nova',dmg:90,cd:1.1,spd:120,color:0xaa66ff,spread:0}};
var gun='pistol',bullets=[],shootCD=0;
var hp=100,maxHp=100,dead=false,inCar=false,carRef=null,vy=0,onGround=true;
var inside=false,insideB=null,outsidePos=new THREE.Vector3();
var joy={x:0,y:0,active:false},keys={},camYaw=0,pitch=0.45,faceYaw=0,walkT=0;
function setKey(c,o){keys[c]=!!o;}
window.addEventListener('keydown',function(e){setKey(e.code,true);if(e.code==='Space'||e.code.indexOf('Arrow')===0)e.preventDefault();if(e.code==='KeyF')toggleCar();if(e.code==='KeyE')tryEnter();});
window.addEventListener('keyup',function(e){setKey(e.code,false);});
document.getElementById('menuBtn').onclick=function(){document.getElementById('menu').classList.toggle('open');};
document.querySelectorAll('#menu .w').forEach(function(b){b.onclick=function(){gun=b.dataset.gun;document.querySelectorAll('#menu .w').forEach(function(x){x.classList.toggle('on',x===b);});document.getElementById('gunLabel').textContent='🔫 '+GUNS[gun].name;document.getElementById('menu').classList.remove('open');toast(GUNS[gun].name);};});
var joyBase=document.getElementById('joyBase'),joyKnob=document.getElementById('joyKnob'),joyZone=document.getElementById('joyZone');
function joyUpd(cx,cy){var r=joyBase.getBoundingClientRect();var mx=cx-(r.left+r.width/2),my=cy-(r.top+r.height/2);var max=52,len=Math.sqrt(mx*mx+my*my)||1;if(len>max){mx*=max/len;my*=max/len;}joyKnob.style.left=(44+mx)+'px';joyKnob.style.top=(44+my)+'px';joy.x=mx/max;joy.y=-my/max;}
function joyEnd(){joy.active=false;joy.x=0;joy.y=0;joyKnob.style.left='44px';joyKnob.style.top='44px';}
joyZone.addEventListener('pointerdown',function(e){joy.active=true;joyUpd(e.clientX,e.clientY);joyZone.setPointerCapture(e.pointerId);e.preventDefault();});
joyZone.addEventListener('pointermove',function(e){if(joy.active)joyUpd(e.clientX,e.clientY);});
joyZone.addEventListener('pointerup',joyEnd);joyZone.addEventListener('pointercancel',joyEnd);
document.getElementById('btnJump').addEventListener('pointerdown',function(e){e.preventDefault();setKey('Space',true);});
document.getElementById('btnJump').addEventListener('pointerup',function(){setKey('Space',false);});
document.getElementById('btnCar').onclick=function(e){e.preventDefault();toggleCar();};
document.getElementById('btnEnter').onclick=function(e){e.preventDefault();tryEnter();};
document.getElementById('btnShoot').addEventListener('pointerdown',function(e){e.preventDefault();setKey('Shoot',true);});
document.getElementById('btnShoot').addEventListener('pointerup',function(){setKey('Shoot',false);});
window.addEventListener('mousedown',function(e){if(e.button===0&&e.target===canvas)setKey('Shoot',true);});
window.addEventListener('mouseup',function(){setKey('Shoot',false);});
var dragging=false,lx=0,ly=0;
canvas.addEventListener('pointerdown',function(e){dragging=true;lx=e.clientX;ly=e.clientY;try{canvas.setPointerCapture(e.pointerId);}catch(err){}});
canvas.addEventListener('pointerup',function(){dragging=false;});
canvas.addEventListener('pointermove',function(e){if(!dragging)return;var dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;camYaw-=dx*0.005;pitch=Math.max(0.15,Math.min(1.3,pitch+dy*0.004));});
function toast(m){var t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(function(){t.classList.remove('show');},2000);}
function updHp(){var bar=document.getElementById('hpBar'),pct=Math.max(0,hp/maxHp*100);bar.style.width=pct+'%';bar.className=pct<35?'low':pct<65?'mid':'';}
function hurt(amt){if(dead||inCar)return;hp-=amt;if(hp<0)hp=0;updHp();if(hp<=0){dead=true;toast('Bạn đã chết');setTimeout(respawn,2200);}}
function respawn(){dead=false;hp=maxHp;updHp();if(inside)exitBuilding();player.position.set(0,0,16);player.visible=true;toast('Hồi sinh');}
function toggleCar(){if(dead||inside)return;if(inCar){inCar=false;carRef=null;player.visible=true;document.getElementById('mode').textContent='Đi bộ';return;}var best=null,bd=4.2;for(var ci=0;ci<cars.length;ci++){var d=player.position.distanceTo(cars[ci].g.position);if(d<bd){bd=d;best=cars[ci];}}if(best){inCar=true;carRef=best;player.visible=false;document.getElementById('mode').textContent=best.kind==='lambo'?'Lamborghini':'Xe';toast('Đã lên xe');}else toast('Lại gần xe hơn');}
function nearEnterable(){if(inside||inCar)return null;var best=null,bd=5.5;for(var i=0;i<enterables.length;i++){var b=enterables[i];var d=Math.hypot(player.position.x-b.x,player.position.z-b.doorZ);if(d<bd){bd=d;best=b;}}return best;}
function tryEnter(){if(inside){exitBuilding();return;}var b=nearEnterable();if(!b){toast('Đứng gần cửa tòa nhà');return;}outsidePos.copy(player.position);inside=true;insideB=b;cityRoot.visible=false;interior.visible=true;scene.background=new THREE.Color(0x1a2332);scene.fog=null;player.position.set(0,0,6);document.getElementById('mode').textContent=b.name;toast('Vào: '+b.name);}
function exitBuilding(){inside=false;insideB=null;cityRoot.visible=true;interior.visible=false;scene.background=new THREE.Color(0x5eb0e0);scene.fog=new THREE.Fog(0x5eb0e0,100,380);player.position.copy(outsidePos);player.position.z+=3;document.getElementById('mode').textContent='Đi bộ';toast('Ra ngoài phố');}
function blocked(x,z,rad){rad=rad||0.45;if(inside)return Math.abs(x)>8||Math.abs(z)>8;for(var bi=0;bi<buildings.length;bi++){var b=buildings[bi];if(Math.abs(x-b.x)<b.w/2+rad&&Math.abs(z-b.z)<b.d/2+rad)return true;}return false;}
function fire(from,dir,isPlayer,gtype){var gdef=GUNS[gtype||gun];var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.13,6,6),new THREE.MeshBasicMaterial({color:gdef.color}));mesh.position.copy(from);scene.add(mesh);var d=dir.clone().normalize();d.x+=rnd(-gdef.spread,gdef.spread);d.z+=rnd(-gdef.spread,gdef.spread);d.normalize();bullets.push({mesh:mesh,vel:d.multiplyScalar(gdef.spd),life:1.6,dmg:gdef.dmg,fromPlayer:!!isPlayer});}
function playerShoot(){if(shootCD>0||dead||inCar)return;shootCD=GUNS[gun].cd;var origin=player.position.clone();origin.y=1.35;fire(origin,new THREE.Vector3(Math.sin(faceYaw),0,Math.cos(faceYaw)),true,gun);}
var clock=new THREE.Clock(),hitCD=0;
function animate(){
  requestAnimationFrame(animate);
  var dt=Math.min(clock.getDelta(),0.05);
  walkT+=dt;hitCD=Math.max(0,hitCD-dt);shootCD=Math.max(0,shootCD-dt);
  var near=nearEnterable();
  var pr=document.getElementById('prompt');
  if(near&&!inside){pr.textContent=near.name+' — bấm nút nhà hoặc E';pr.classList.add('show');}
  else if(inside){pr.textContent='Ra ngoài — bấm nút nhà hoặc E';pr.classList.add('show');}
  else pr.classList.remove('show');
  if(!dead){
    var fwd=new THREE.Vector3(Math.sin(camYaw),0,Math.cos(camYaw));
    var right=new THREE.Vector3(Math.cos(camYaw),0,-Math.sin(camYaw));
    var sprint=keys.ShiftLeft||keys.ShiftRight;
    var sp=inCar?(sprint?26:15):(sprint?9:4.6);
    var mv=new THREE.Vector3();
    if(keys.KeyW||keys.ArrowUp)mv.add(fwd);if(keys.KeyS||keys.ArrowDown)mv.sub(fwd);
    if(keys.KeyA||keys.ArrowLeft)mv.add(right);if(keys.KeyD||keys.ArrowRight)mv.sub(right);
    if(joy.active&&(Math.abs(joy.x)>0.08||Math.abs(joy.y)>0.08)){mv.addScaledVector(fwd,joy.y);mv.addScaledVector(right,-joy.x);}
    var moving=mv.lengthSq()>0.0001;
    if(moving){mv.normalize();faceYaw=Math.atan2(mv.x,mv.z);mv.multiplyScalar(sp*dt);var nx=player.position.x+mv.x,nz=player.position.z+mv.z;if(!blocked(nx,nz,inCar?1.2:0.45)){player.position.x=nx;player.position.z=nz;}}
    if(keys.Space&&onGround&&!inCar){vy=8.5;onGround=false;}
    vy-=26*dt;player.position.y+=vy*dt;if(player.position.y<=0){player.position.y=0;vy=0;onGround=true;}
    player.rotation.y=faceYaw;
    if(!inCar)walkAnim(player,walkT,moving&&onGround);
    if(inCar&&carRef){carRef.g.position.x=player.position.x;carRef.g.position.z=player.position.z;carRef.g.rotation.y=faceYaw;player.position.y=0;}
    if(keys.Shoot)playerShoot();
    document.getElementById('spd').textContent=Math.round((moving?sp:0)*3.6)+' km/h';
  }
  for(var bi=bullets.length-1;bi>=0;bi--){
    var bu=bullets[bi];bu.life-=dt;bu.mesh.position.addScaledVector(bu.vel,dt);
    if(bu.life<=0){scene.remove(bu.mesh);bullets.splice(bi,1);continue;}
    if(bu.fromPlayer){
      for(var ni=0;ni<npcs.length;ni++){
        var n=npcs[ni];if(n.dead||!cityRoot.visible)continue;
        if(bu.mesh.position.distanceTo(new THREE.Vector3(n.g.position.x,1.2,n.g.position.z))<1){
          n.hp-=bu.dmg;n.aggro=true;scene.remove(bu.mesh);bullets.splice(bi,1);
          if(n.hp<=0){n.dead=true;n.g.rotation.z=Math.PI/2;n.g.position.y=0.2;toast('Hạ gục!');}
          break;
        }
      }
    }else if(!dead&&bu.mesh.position.distanceTo(new THREE.Vector3(player.position.x,1.2,player.position.z))<0.9){
      hurt(bu.dmg);scene.remove(bu.mesh);bullets.splice(bi,1);toast('Bị bắn!');
    }
  }
  if(cityRoot.visible){
    for(i=0;i<cars.length;i++){
      var c=cars[i];if(inCar&&c===carRef)continue;
      var ox=c.g.position.x,oz=c.g.position.z,nx=ox,nz=oz;
      if(c.ax==='x'){nx+=c.spd*c.dir*dt;if(Math.abs(nx)>160)c.dir*=-1;c.g.rotation.y=c.dir>0?-Math.PI/2:Math.PI/2;}
      else{nz+=c.spd*c.dir*dt;if(Math.abs(nz)>160)c.dir*=-1;c.g.rotation.y=c.dir>0?0:Math.PI;}
      if(!blocked(nx,nz,1.4)){c.g.position.x=nx;c.g.position.z=nz;}else c.dir*=-1;
      if(!dead&&!inCar&&hitCD<=0&&player.position.distanceTo(c.g.position)<2.4){hurt(Math.min(45,16+c.spd*2));hitCD=1;toast('Đâm xe!');}
    }
    for(i=0;i<npcs.length;i++){
      var n=npcs[i];if(n.dead)continue;
      n.shootCD=Math.max(0,n.shootCD-dt);
      var toP=new THREE.Vector3().subVectors(player.position,n.g.position);var dist=toP.length();
      if(n.aggro&&dist<48&&!dead){
        n.face=Math.atan2(toP.x,toP.z);n.g.rotation.y=n.face;
        if(dist>9){var step=toP.normalize().multiplyScalar(2.6*dt);var nnx=n.g.position.x+step.x,nnz=n.g.position.z+step.z;if(!blocked(nnx,nnz,0.4)){n.g.position.x=nnx;n.g.position.z=nnz;}walkAnim(n.g,walkT+i,true);}
        if(n.shootCD<=0&&dist<36){n.shootCD=0.95;var o=n.g.position.clone();o.y=1.3;fire(o,new THREE.Vector3(Math.sin(n.face),0,Math.cos(n.face)),false,'pistol');}
      }else{
        n.a+=dt*0.25;var nnx=n.g.position.x+Math.cos(n.a)*n.s*dt,nnz=n.g.position.z+Math.sin(n.a)*n.s*dt;
        if(!blocked(nnx,nnz,0.4)){n.g.position.x=nnx;n.g.position.z=nnz;}else n.a+=1.2;
        n.g.rotation.y=-n.a+Math.PI/2;walkAnim(n.g,walkT+i,true);
      }
    }
  }
  var dist=inside?7:13,ch=inside?3.5:5.5+pitch*5;
  var px=player.position.x,pz=player.position.z,py=player.position.y;
  var cy=inside?faceYaw:camYaw;
  camera.position.x=px-Math.sin(cy)*dist;camera.position.z=pz-Math.cos(cy)*dist;camera.position.y=py+ch;
  camera.lookAt(px,py+1.4,pz);
  renderer.render(scene,camera);
}
updHp();
document.getElementById('load').classList.add('hide');
animate();
window.addEventListener('resize',function(){W=innerWidth;H=innerHeight;camera.aspect=W/H;camera.updateProjectionMatrix();renderer.setSize(W,H);});
}
wait(0);
})();
