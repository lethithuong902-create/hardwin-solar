(function(){
  var el=document.getElementById('load');
  function fail(m){if(el)el.innerHTML='<div style="padding:24px;text-align:center">'+m+'<br><br><a href="/" style="color:#38bdf8">← Hardwin</a></div>';}
  function get(url,cb){var x=new XMLHttpRequest();x.open('GET',url,true);x.onload=function(){if(x.status>=200&&x.status<300)cb(x.responseText);else fail('Lỗi '+x.status+' '+url);};x.onerror=function(){fail('Lỗi mạng');};x.send();}
  var base='https://cdn.jsdelivr.net/gh/lethithuong902-create/hardwin-solar@main/';
  var v='?v=gta3', n=4, i=0, buf='';
  function next(){
    if(i>=n){
      try{
        var bin=atob(buf), bytes=new Uint8Array(bin.length);
        for(var j=0;j<bin.length;j++)bytes[j]=bin.charCodeAt(j);
        if(!window.DecompressionStream){fail('Cần Chrome/Edge mới');return;}
        var ds=new DecompressionStream('deflate');
        new Response(new Blob([bytes]).stream().pipeThrough(ds)).arrayBuffer().then(function(ab){
          (0,eval)(new TextDecoder().decode(ab));
        }).catch(function(e){console.error(e);fail(e.message||e);});
      }catch(e){console.error(e);fail(e.message||e);}
      return;
    }
    get(base+'city-zc'+i+'.txt'+v,function(t){buf+=t;i++;next();});
  }
  next();
})();
