(function(){
function go(){
  if(typeof THREE==='undefined'||!THREE.OrbitControls){setTimeout(go,100);return;}
  var parts=window.__HW||[];
  var code=parts.join('');
  try{ (0,eval)(code); }catch(e){ console.error(e); alert('Lỗi load game: '+e.message); }
}
go();
})();
