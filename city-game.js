(function(){
  var el=document.getElementById('load');
  function fail(m){if(el)el.innerHTML='<div style="padding:24px;text-align:center">'+m+'</div>';}
  function get(url,cb){var x=new XMLHttpRequest();x.open('GET',url,true);x.onload=function(){if(x.status>=200&&x.status<300)cb(x.responseText);else fail('Lỗi '+x.status);};x.onerror=function(){fail('Lỗi mạng');};x.send();}
  var v='?v=gta2', n=11, i=0, buf='';
  function next(){
    if(i>=n){
      try{
        var s=decodeURIComponent(escape(atob(buf)));
        (0,eval)(s);
      }catch(e){console.error(e);fail(e.message||e);}
      return;
    }
    get('/city-b64-'+i+'.txt'+v,function(t){buf+=t;i++;next();});
  }
  next();
})();
