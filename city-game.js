(function(){
  var el=document.getElementById('load');
  function fail(m){if(el)el.innerHTML='<div style="padding:24px;text-align:center">'+m+'<br><br><a href="/" style="color:#38bdf8">← Hardwin</a></div>';}
  function get(url,cb){
    var x=new XMLHttpRequest();
    x.open('GET',url,true);
    x.onload=function(){if(x.status>=200&&x.status<300)cb(x.responseText);else fail('Lỗi tải Open City ('+x.status+')');};
    x.onerror=function(){fail('Lỗi mạng Open City');};
    x.send();
  }
  var v='?v=jump3';
  get('/city-game-a.js'+v,function(a){
    get('/city-game-b.js'+v,function(b){
      try{(0,eval)(a+b);}catch(e){console.error(e);fail('Lỗi chạy game: '+(e.message||e));}
    });
  });
})();
