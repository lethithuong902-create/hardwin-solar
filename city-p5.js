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
