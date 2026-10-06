(function boot(n){
if(typeof THREE==='undefined'||!THREE.OrbitControls){if(n<90)return setTimeout(function(){boot(n+1)},200);return;}
var box=document.getElementById('canvas3d');
function size(){return {w:box.clientWidth||window.innerWidth,h:box.clientHeight||window.innerHeight};}
var s0=size(),renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setSize(s0.w,s0.h);box.appendChild(renderer.domElement);
var scene=new THREE.Scene();scene.background=new THREE.Color(0x03050c);
var camera=new THREE.PerspectiveCamera(55,s0.w/s0.h,0.1,6000);camera.position.set(0,70,160);
var controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=6;controls.maxDistance=1000;
scene.add(new THREE.PointLight(0xfff0c8,2.2,0,0));scene.add(new THREE.AmbientLight(0x334455,.45));
function rnd(a,b){return a+Math.random()*(b-a)}
function mkTex(w,h,fn){var c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);var t=new THREE.CanvasTexture(c);t.needsUpdate=true;return t;}
function rocky(base,dark){return mkTex(512,256,function(x,w,h){x.fillStyle=base;x.fillRect(0,0,w,h);for(var i=0;i<500;i++){x.beginPath();x.arc(rnd(0,w),rnd(0,h),rnd(1,12),0,6.28);x.fillStyle=dark;x.globalAlpha=rnd(.2,.5);x.fill();}x.globalAlpha=1;});}
function gas(bands,spot){return mkTex(512,256,function(x,w,h){var y=0,bi=0;while(y<h){var bh=rnd(6,22);x.fillStyle=bands[bi++%bands.length];x.fillRect(0,y,w,bh);y+=bh;}if(spot){x.beginPath();x.ellipse(w*.68,h*.55,28,14,0,0,6.28);x.fillStyle='#c24528';x.fill();}})}
var sunTex=mkTex(512,256,function(x,w,h){var g=x.createRadialGradient(w/2,h/2,8,w/2,h/2,w/2);g.addColorStop(0,'#fff6c8');g.addColorStop(.45,'#ffcc44');g.addColorStop(1,'#e85a10');x.fillStyle=g;x.fillRect(0,0,w,h);});
var earthTex=mkTex(1024,512,function(x,w,h){x.fillStyle='#0c4a8c';x.fillRect(0,0,w,h);[[.18,.42,.14],[.28,.38,.1],[.55,.45,.16],[.72,.35,.12],[.48,.62,.09],[.22,.55,.08],[.65,.58,.1]].forEach(function(L){x.fillStyle='#2d8a4a';x.beginPath();x.ellipse(L[0]*w,L[1]*h,L[2]*w,L[2]*h*.55,rnd(-.3,.3),0,6.28);x.fill();});x.fillStyle='#e8f4ff';x.fillRect(0,0,w,h*.08);x.fillRect(0,h*.92,w,h*.08);});
var moonTex=rocky('#c8c4b8','rgba(80,80,80,.55)');
var sp=[],sc=[],cols=[0xffffff,0xaaccff,0xffddaa,0xffaaaa,0xccffcc,0xddaaff];
for(var i=0;i<3000;i++){var r=rnd(900,2400),th=rnd(0,6.28),ph=Math.acos(rnd(-1,1));sp.push(r*Math.sin(ph)*Math.cos(th),r*Math.cos(ph),r*Math.sin(ph)*Math.sin(th));var c=new THREE.Color(cols[i%cols.length]);sc.push(c.r,c.g,c.b);}
var starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));starGeo.setAttribute('color',new THREE.Float32BufferAttribute(sc,3));
var stars=new THREE.Points(starGeo,new THREE.PointsMaterial({size:1.5,vertexColors:true,transparent:true,opacity:.9}));scene.add(stars);
var sun=new THREE.Mesh(new THREE.SphereGeometry(8,48,48),new THREE.MeshBasicMaterial({map:sunTex}));scene.add(sun);
var corona=new THREE.Mesh(new THREE.SphereGeometry(10.5,32,32),new THREE.MeshBasicMaterial({color:0xffaa33,transparent:true,opacity:.18}));scene.add(corona);
var TEX={mercury:rocky('#9c8f80','rgba(60,50,40,.55)'),venus:rocky('#e0b878','rgba(160,110,50,.5)'),earth:earthTex,mars:rocky('#c25a38','rgba(100,40,20,.55)'),jupiter:gas(['#c9a06a','#e3c9a0','#b07d4e'],true),saturn:gas(['#d8c08a','#e8d8a8','#c4a868'],false),uranus:gas(['#a8e0e8','#8fd0dc'],false),neptune:gas(['#3a5fc8','#4a72d8'],false)};
var PD=[{id:'sun',vi:'Mặt Trời',radius:8,dist:0,speed:0,rot:.002},{id:'mercury',vi:'Sao Thủy',radius:1.2,dist:18,speed:.045,rot:.004},{id:'venus',vi:'Sao Kim',radius:1.9,dist:26,speed:.035,rot:.002},{id:'earth',vi:'Trái Đất',radius:2,dist:35,speed:.028,rot:.02,moon:true},{id:'mars',vi:'Sao Hỏa',radius:1.5,dist:45,speed:.022,rot:.018},{id:'jupiter',vi:'Sao Mộc',radius:4.6,dist:66,speed:.011,rot:.04},{id:'saturn',vi:'Sao Thổ',radius:3.9,dist:92,speed:.0075,rot:.038,ring:true},{id:'uranus',vi:'Thiên Vương',radius:2.9,dist:118,speed:.0052,rot:.03},{id:'neptune',vi:'Hải Vương',radius:2.8,dist:142,speed:.004,rot:.032},{id:'moon',vi:'Mặt Trăng',radius:.55,dist:0,speed:0,rot:.01}];
var planets=[],orbits=[],clickables=[],projectiles=[],effects=[],labels=document.getElementById('labels');
PD.forEach(function(d){if(d.id==='moon')return;var pivot=new THREE.Object3D();scene.add(pivot);var group=new THREE.Object3D();group.position.x=d.dist;pivot.add(group);
var mesh=d.id==='sun'?sun:new THREE.Mesh(new THREE.SphereGeometry(d.radius,32,32),new THREE.MeshStandardMaterial({map:TEX[d.id],roughness:.72}));
if(d.id!=='sun')group.add(mesh);
if(d.ring){var rg=new THREE.Mesh(new THREE.RingGeometry(d.radius*1.35,d.radius*2.3,64),new THREE.MeshBasicMaterial({color:0xc9b896,side:THREE.DoubleSide,transparent:true,opacity:.7}));rg.rotation.x=-Math.PI/2;group.add(rg);}
if(d.moon){var mp=new THREE.Object3D();group.add(mp);var mm=new THREE.Mesh(new THREE.SphereGeometry(.55,24,24),new THREE.MeshStandardMaterial({map:moonTex,roughness:1}));mm.position.x=3.5;mp.add(mm);d._moonPivot=mp;
var mo={data:PD.find(function(x){return x.id==='moon'}),mesh:mm,label:null,destroyed:false,life:null,damage:0,isMoon:true};mm.userData.planet=mo;clickables.push(mm);
var mlb=document.createElement('div');mlb.className='planet-label';mlb.textContent='Mặt Trăng';labels.appendChild(mlb);mo.label=mlb;planets.push(mo);}
if(d.dist>0){var pts=[];for(var i=0;i<96;i++){var a=i/96*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*d.dist,0,Math.sin(a)*d.dist));}var line=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x3d5278,transparent:true,opacity:.35}));scene.add(line);orbits.push(line);}
var lb=document.createElement('div');lb.className='planet-label';lb.textContent=d.vi;labels.appendChild(lb);
var obj={data:d,pivot:pivot,group:group,mesh:mesh,label:lb,destroyed:false,life:null,lifeMesh:null,damage:0,craters:[]};mesh.userData.planet=obj;planets.push(obj);clickables.push(mesh);pivot.rotation.y=Math.random()*6.28;});
var soundOn=true,actx=null;
function audio(){if(!actx)try{actx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}return actx;}
function beep(type,dur,freq,vol){if(!soundOn)return;var c=audio();if(!c)return;if(c.state==='suspended')c.resume();var o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.value=vol||.08;o.connect(g);g.connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,c.currentTime+dur);o.stop(c.currentTime+dur+.05);}
function boom(){beep('sawtooth',.5,50,.14);setTimeout(function(){beep('square',.25,35,.1)},90);}
var mode='explore',weapon='meteor',seed='forest',paused=false,speed=1,showOrbit=true,showLabel=true,isFs=false;
var fly={a:false,t:0,fp:new THREE.Vector3(),ft:new THREE.Vector3(),tp:new THREE.Vector3(),tt:new THREE.Vector3()};
var _v=new THREE.Vector3(),_wp=new THREE.Vector3(),_d=new THREE.Vector3(),clock=new THREE.Clock();
var WNAMES={meteor:'Thiên thạch',laser:'Laser',gamma:'Tia gamma',alien:'Hạm đội ngoài hành tinh',nova:'Siêu tân tinh'};
var SNAMES={forest:'Rừng',ocean:'Đại dương',city:'Thành phố',farm:'Nông trại',animal:'Động vật',atmo:'Khí quyển'};
function toast(m){var t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(function(){t.classList.remove('show')},2400);}
function updHint(){document.getElementById('modeHint').textContent='Chế độ: '+(mode==='explore'?'Khám phá':mode==='destroy'?'Hủy diệt':'Tái tạo');
document.getElementById('subHint').textContent=mode==='destroy'?('Vũ khí: '+WNAMES[weapon]):mode==='create'?('Sự sống: '+SNAMES[seed]):'Bấm hành tinh để xem';}
function setMode(m){mode=m;document.querySelectorAll('[data-mode]').forEach(function(b){b.classList.toggle('on',b.dataset.mode===m);});updHint();}
function setWeapon(w){weapon=w;document.querySelectorAll('[data-weapon]').forEach(function(b){b.classList.toggle('on',b.dataset.weapon===w);});updHint();}
function setSeed(s){seed=s;document.querySelectorAll('[data-seed]').forEach(function(b){b.classList.toggle('on',b.dataset.seed===s);});updHint();}
document.querySelectorAll('[data-mode]').forEach(function(b){b.onclick=function(){setMode(b.dataset.mode);};});
document.querySelectorAll('[data-weapon]').forEach(function(b){b.onclick=function(){setWeapon(b.dataset.weapon);setMode('destroy');};});
document.querySelectorAll('[data-seed]').forEach(function(b){b.onclick=function(){setSeed(b.dataset.seed);setMode('create');};});
function burst(pos,color,n,spd){var geo=new THREE.BufferGeometry(),a=[];for(var i=0;i<n;i++)a.push(pos.x,pos.y,pos.z);geo.setAttribute('position',new THREE.Float32BufferAttribute(a,3));
var pts=new THREE.Points(geo,new THREE.PointsMaterial({color:color,size:1.3,transparent:true,opacity:1}));scene.add(pts);
var vels=[];for(var j=0;j<n;j++)vels.push(new THREE.Vector3(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(spd||5,spd?spd*2:12)));
effects.push({mesh:pts,vels:vels,life:1.3});}
function addCrater(p){if(!p.mesh||p.isMoon)return;var crater=new THREE.Mesh(new THREE.SphereGeometry(p.data.radius*0.28,12,12),new THREE.MeshBasicMaterial({color:0x3a1a0a}));
var a=rnd(0,6.28),b=rnd(-.6,.6);crater.position.set(Math.cos(a)*Math.cos(b)*p.data.radius*0.92,Math.sin(b)*p.data.radius*0.92,Math.sin(a)*Math.cos(b)*p.data.radius*0.92);
p.mesh.add(crater);if(!p.craters)p.craters=[];p.craters.push(crater);p.damage=(p.damage||0)+1;
var lava=new THREE.Mesh(new THREE.SphereGeometry(p.data.radius*0.12,8,8),new THREE.MeshBasicMaterial({color:0xff4400}));lava.position.copy(crater.position).multiplyScalar(1.05);p.mesh.add(lava);p.craters.push(lava);}
function fullDestroy(p){if(p.destroyed)return;p.mesh.getWorldPosition(_wp);burst(_wp,0xf87171,60,12);burst(_wp,0xffaa44,35,8);
for(var i=0;i<10;i++){var ch=new THREE.Mesh(new THREE.BoxGeometry(rnd(.2,.55),rnd(.2,.55),rnd(.2,.55)),new THREE.MeshBasicMaterial({color:0x884422}));ch.position.copy(_wp);scene.add(ch);effects.push({mesh:ch,vels:[new THREE.Vector3(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(5,14))],life:1.6,chunk:true});}
p.destroyed=true;p.mesh.visible=false;if(p.lifeMesh){p.mesh.remove(p.lifeMesh);p.lifeMesh=null;}p.life=null;boom();toast(p.data.vi+' đã vỡ vụn!');}
function attack(p){
if(p.data.id==='sun'){toast('Không tấn công Mặt Trời');return;}
if(p.destroyed){toast('Đã bị hủy');return;}
p.mesh.getWorldPosition(_wp);
if(weapon==='meteor'){
var start=_wp.clone().add(new THREE.Vector3(rnd(22,32),rnd(14,24),rnd(10,18)));
var met=new THREE.Mesh(new THREE.SphereGeometry(.6,10,10),new THREE.MeshBasicMaterial({color:0xff8844}));met.position.copy(start);scene.add(met);
projectiles.push({mesh:met,target:p,t:0,start:start.clone(),end:_wp.clone(),kind:'meteor',dur:1.2});
toast('☄️ Thiên thạch đang lao tới '+p.data.vi+'…');
}else if(weapon==='laser'){
var beam=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,1,8),new THREE.MeshBasicMaterial({color:0x44ffaa,transparent:true,opacity:.9}));
beam.position.copy(_wp);scene.add(beam);
projectiles.push({mesh:beam,target:p,t:0,kind:'laser',dur:.9});
toast('🔦 Laser đang khóa '+p.data.vi+'…');
}else if(weapon==='gamma'){
var from=_wp.clone().add(new THREE.Vector3(0,25,0));
var beam=new THREE.Mesh(new THREE.CylinderGeometry(.2,.05,1,8),new THREE.MeshBasicMaterial({color:0xaa66ff,transparent:true,opacity:.85}));
beam.position.copy(from);scene.add(beam);
projectiles.push({mesh:beam,target:p,t:0,start:from.clone(),end:_wp.clone(),kind:'gamma',dur:1.0});
toast('☢️ Tia gamma bắn vào '+p.data.vi+'…');
}else if(weapon==='alien'){
for(var i=0;i<5;i++){var ship=new THREE.Mesh(new THREE.ConeGeometry(.35,.9,4),new THREE.MeshBasicMaterial({color:0x66ffaa}));
var st=_wp.clone().add(new THREE.Vector3(rnd(20,35),rnd(8,18),rnd(-15,15)));ship.position.copy(st);scene.add(ship);
projectiles.push({mesh:ship,target:p,t:0,start:st.clone(),end:_wp.clone(),kind:'alien',dur:1.4+i*.15,delay:i*.12});}
toast('👽 Hạm đội đang tấn công '+p.data.vi+'…');
}else{
burst(_wp,0xffee88,40,10);projectiles.push({mesh:null,target:p,t:0,kind:'nova',dur:.8});
toast('💥 Siêu tân tinh kích hoạt…');
}}
function onHit(p,kind){
if(kind==='gamma'){addCrater(p);burst(_wp,0xaa66ff,25,7);beep('sawtooth',.35,90,.1);toast('Hố lõm trên '+p.data.vi+'! ('+p.damage+'/3)');if(p.damage>=3)fullDestroy(p);}
else if(kind==='laser'){addCrater(p);burst(_wp,0x44ffaa,20,6);beep('square',.25,200,.08);toast('Laser đốt '+p.data.vi);if(p.damage>=3)fullDestroy(p);}
else fullDestroy(p);
}
function addLife(p,kind){if(p.lifeMesh){p.mesh.remove(p.lifeMesh);p.lifeMesh=null;}var g=new THREE.Group();var R=p.data.radius;
if(kind==='forest'||kind==='farm'){for(var i=0;i<14;i++){var t=new THREE.Mesh(new THREE.ConeGeometry(.1,.32,6),new THREE.MeshBasicMaterial({color:kind==='farm'?0xa3e635:0x33aa44}));var a=i/14*Math.PI*2;t.position.set(Math.cos(a)*(R+.12),0,Math.sin(a)*(R+.12));g.add(t);}}
if(kind==='ocean'){g.add(new THREE.Mesh(new THREE.SphereGeometry(R*1.06,24,24),new THREE.MeshBasicMaterial({color:0x2288cc,transparent:true,opacity:.35})));}
if(kind==='city'){for(var i=0;i<12;i++){var b=new THREE.Mesh(new THREE.BoxGeometry(.1,rnd(.15,.4),.1),new THREE.MeshBasicMaterial({color:0xffcc66}));var a=i/12*Math.PI*2;b.position.set(Math.cos(a)*(R+.08),.12,Math.sin(a)*(R+.08));g.add(b);}}
if(kind==='animal'){for(var i=0;i<8;i++){var a=new THREE.Mesh(new THREE.SphereGeometry(.08,6,6),new THREE.MeshBasicMaterial({color:0xe8b48a}));var ang=i/8*Math.PI*2;a.position.set(Math.cos(ang)*(R+.05),.05,Math.sin(ang)*(R+.05));g.add(a);}}
if(kind==='atmo'){g.add(new THREE.Mesh(new THREE.SphereGeometry(R*1.12,24,24),new THREE.MeshBasicMaterial({color:0x88ccff,transparent:true,opacity:.2})));}
p.mesh.add(g);p.lifeMesh=g;p.life=kind;}
function seedPlanet(p,kind){if(p.data.id==='sun'||p.destroyed){toast('Không gieo được');return;}kind=kind||seed;addLife(p,kind);p.mesh.getWorldPosition(_wp);burst(_wp,0x4ade80,24,5);beep('triangle',.3,280,.06);toast('Đã gieo '+SNAMES[kind]+' lên '+p.data.vi);}
function resetAll(){planets.forEach(function(p){p.destroyed=false;p.life=null;p.damage=0;p.mesh.visible=true;p.mesh.scale.set(1,1,1);
if(p.lifeMesh){p.mesh.remove(p.lifeMesh);p.lifeMesh=null;}
if(p.craters){p.craters.forEach(function(c){p.mesh.remove(c);});p.craters=[];}});toast('↺ Đã khôi phục trạng thái ban đầu');setMode('explore');}
function resize(){var s=size();if(s.w<2||s.h<2)return;camera.aspect=s.w/s.h;camera.updateProjectionMatrix();renderer.setSize(s.w,s.h);}
function setFs(on){isFs=!!on;document.body.classList.toggle('fs',isFs);document.getElementById('menu').classList.remove('open');
requestAnimationFrame(function(){requestAnimationFrame(resize);});toast(isFs?'Toàn màn hình — bấm ☰ menu':'Thu nhỏ');}
document.getElementById('fsBtn').onclick=function(){setFs(!isFs);};
document.getElementById('btnExitFs').onclick=function(){setFs(false);document.getElementById('menu').classList.remove('open');};
document.getElementById('menuBtn').onclick=function(e){e.stopPropagation();document.getElementById('menu').classList.toggle('open');};
document.getElementById('btnReset').onclick=function(){resetAll();};
document.getElementById('btnPause').onclick=function(){paused=!paused;this.textContent=paused?'▶ Tiếp tục':'⏸ Tạm dừng';};
document.getElementById('btnOrbit').onclick=function(){showOrbit=!showOrbit;this.classList.toggle('on',showOrbit);orbits.forEach(function(l){l.visible=showOrbit;});};
document.getElementById('btnLabel').onclick=function(){showLabel=!showLabel;this.classList.toggle('on',showLabel);labels.style.display=showLabel?'block':'none';};
document.getElementById('btnSound').onclick=function(){soundOn=!soundOn;this.classList.toggle('on',soundOn);this.textContent=soundOn?'🔊 Âm thanh':'🔇 Tắt tiếng';};
var sr=document.getElementById('speedRange');sr.oninput=function(){speed=.1+parseInt(sr.value,10)/100*7;};speed=.1+20/100*7;
function flyTo(p){p.mesh.getWorldPosition(_wp);_d.subVectors(camera.position,_wp).normalize();var off=(p.data.radius||1)*5+4;_v.copy(_wp).addScaledVector(_d,off);_v.y+=(p.data.radius||1);
fly.fp.copy(camera.position);fly.ft.copy(controls.target);fly.tp.copy(_v);fly.tt.copy(_wp);fly.t=0;fly.a=true;controls.enabled=false;
if(mode==='explore')toast(p.data.vi+(p.damage?' — hư hại '+p.damage+'/3':''));
else if(mode==='destroy')attack(p);
else seedPlanet(p,seed);}
var nav=document.getElementById('planetNav');
PD.forEach(function(d){var b=document.createElement('button');b.className='btn';b.textContent=d.vi;b.onclick=function(){var p=planets.find(function(x){return x.data.id===d.id});if(p)flyTo(p);};nav.appendChild(b);});
var ray=new THREE.Raycaster(),mouse=new THREE.Vector2(),dx=0,dy=0,dom=renderer.domElement;
dom.addEventListener('pointerdown',function(e){dx=e.clientX;dy=e.clientY;audio();});
dom.addEventListener('pointerup',function(e){if(Math.abs(e.clientX-dx)>8||Math.abs(e.clientY-dy)>8)return;
var r=dom.getBoundingClientRect();mouse.x=((e.clientX-r.left)/r.width)*2-1;mouse.y=-((e.clientY-r.top)/r.height)*2+1;
ray.setFromCamera(mouse,camera);var hits=ray.intersectObjects(clickables,false);if(hits.length&&hits[0].object.userData.planet)flyTo(hits[0].object.userData.planet);});
window.addEventListener('resize',resize);
function sm(t){return t*t*(3-2*t)}
function animate(){requestAnimationFrame(animate);var dt=Math.min(clock.getDelta(),.05);
var pulse=1+Math.sin(clock.elapsedTime*1.5)*.03;corona.scale.setScalar(pulse);corona.material.opacity=.14+Math.sin(clock.elapsedTime*2)*.04;stars.rotation.y+=dt*.003;
if(!paused){sun.rotation.y+=.002*dt*60*speed;planets.forEach(function(p){if(p.isMoon)return;if(p.data.dist>0&&p.pivot)p.pivot.rotation.y+=p.data.speed*dt*60*speed*.5;if(p.mesh)p.mesh.rotation.y+=p.data.rot*dt*60*speed*.5;if(p.data._moonPivot)p.data._moonPivot.rotation.y+=.05*dt*60*speed*.5;if(p.lifeMesh)p.lifeMesh.rotation.y+=dt*.35;});}
for(var i=projectiles.length-1;i>=0;i--){var pr=projectiles[i];pr.t+=dt;var tt=Math.max(0,pr.t-(pr.delay||0));if(tt<=0)continue;var s=Math.min(1,tt/(pr.dur||1));
if(pr.kind==='meteor'||pr.kind==='alien'||pr.kind==='gamma'){if(pr.mesh&&pr.start)pr.mesh.position.lerpVectors(pr.start,pr.end,s);if(pr.kind==='alien'&&pr.mesh)pr.mesh.lookAt(pr.end);}
if(pr.kind==='laser'&&pr.mesh){pr.mesh.scale.set(1,6+s*25,1);}
if(s>=1){pr.target.mesh.getWorldPosition(_wp);if(pr.kind==='nova')fullDestroy(pr.target);else onHit(pr.target,pr.kind);if(pr.mesh)scene.remove(pr.mesh);projectiles.splice(i,1);}}
if(fly.a){fly.t=Math.min(1,fly.t+dt*1.35);var s=sm(fly.t);camera.position.lerpVectors(fly.fp,fly.tp,s);controls.target.lerpVectors(fly.ft,fly.tt,s);if(fly.t>=1){fly.a=false;controls.enabled=true;}}
for(var ei=effects.length-1;ei>=0;ei--){var e=effects[ei];e.life-=dt*1.1;if(e.chunk){e.mesh.position.addScaledVector(e.vels[0],dt*8);e.mesh.rotation.x+=dt*3;}
else{var pos=e.mesh.geometry.attributes.position;for(var k=0;k<e.vels.length;k++){pos.array[k*3]+=e.vels[k].x*dt*8;pos.array[k*3+1]+=e.vels[k].y*dt*8;pos.array[k*3+2]+=e.vels[k].z*dt*8;}pos.needsUpdate=true;e.mesh.material.opacity=Math.max(0,e.life);}
if(e.life<=0){scene.remove(e.mesh);effects.splice(ei,1);}}
controls.update();
if(showLabel){var s=size();planets.forEach(function(p){if(!p.label||!p.mesh.visible){if(p.label)p.label.style.display='none';return;}p.mesh.getWorldPosition(_wp);_v.copy(_wp).project(camera);if(_v.z<1){p.label.style.display='block';p.label.style.left=(_v.x*.5+.5)*s.w+'px';p.label.style.top=(-_v.y*.5+.5)*s.h+'px';}else p.label.style.display='none';});}
renderer.render(scene,camera);}
setMode('explore');setWeapon('meteor');animate();
})(0);
