(function(){
  var el=document.getElementById('load');
  function fail(m){if(el)el.innerHTML='<div style="padding:24px;text-align:center">'+m+'<br><br><a href="/" style="color:#38bdf8">← Hardwin</a></div>';}
  function get(url,cb){var x=new XMLHttpRequest();x.open('GET',url,true);x.onload=function(){if(x.status>=200&&x.status<300)cb(x.responseText);else fail('Lỗi '+x.status);};x.onerror=function(){fail('Lỗi mạng');};x.send();}
  var v='?v=gta2', files=['/city-p0.js','/city-p1.js','/city-p2.js','/city-p3.js','/city-p4.js','/city-p5.js','/city-p6.js'], i=0, buf='';
  function next(){if(i>=files.length){try{(0,eval)(buf);}catch(e){console.error(e);fail(e.message||e);}return;}get(files[i++]+v,function(t){buf+=t;next();});}
  next();
})();
