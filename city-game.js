(function(){
  var url = "https://raw.githubusercontent.com/lethithuong902-create/hardwin-solar/a63dafe712ab7223387c45a89ec0d0bd33f9b749/city-game.js";
  fetch(url)
    .then(function(r){ if(!r.ok) throw new Error("HTTP "+r.status); return r.text(); })
    .then(function(code){ (0,eval)(code); })
    .catch(function(e){
      var el = document.getElementById("load");
      if(el) el.innerHTML = "<div style=padding:24px>Lỗi tải game: "+e+"<br><a href=/ style=color:#38bdf8>← Hardwin</a></div>";
      console.error(e);
    });
})();
