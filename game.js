(function(){
function go(){
  if(typeof THREE==='undefined'||!THREE.OrbitControls){setTimeout(go,100);return;}
  var b64=(window.__B64||[]).join('');
  function b64ToU8(s){var bin=atob(s);var u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u;}
  function inflate(u8,cb){
    if(typeof DecompressionStream==='undefined'){alert('Cần trình duyệt mới (Chrome/Edge/Firefox)');return;}
    var ds=new DecompressionStream('deflate-raw');
    var ab=u8.buffer.slice(u8.byteOffset,u8.byteOffset+u8.byteLength);
    new Response(new Blob([ab]).stream().pipeThrough(ds)).arrayBuffer().then(function(buf){
      cb(new TextDecoder().decode(buf));
    }).catch(function(e){console.error(e);alert('Decompress fail: '+e);});
  }
  inflate(b64ToU8(b64),function(code){
    try{(0,eval)(code);}catch(e){console.error(e);alert('Lỗi: '+e.message);}
  });
}
go();
})();
