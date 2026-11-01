var dist=inside?7:12,ch=inside?3.5:5.2+pitch*5;var px=player.position.x,pz=player.position.z,py=player.position.y;var cy=inside?faceYaw:camYaw;
camera.position.x=px-Math.sin(cy)*dist;camera.position.z=pz-Math.cos(cy)*dist;camera.position.y=py+ch;camera.lookAt(px,py+1.4,pz);renderer.render(scene,camera);}
updHp();updFuel();refreshMenu();var loadEl=document.getElementById('load');if(loadEl)loadEl.classList.add('hide');animate();
window.addEventListener('resize',function(){W=innerWidth;H=innerHeight;camera.aspect=W/H;camera.updateProjectionMatrix();renderer.setSize(W,H);});
}
wait(0);
})();
