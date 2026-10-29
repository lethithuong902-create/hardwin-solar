(function(){
  var el = document.getElementById('load');
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/lethithuong902-create/hardwin-solar@a63dafe712ab7223387c45a89ec0d0bd33f9b749/city-game.js';
  s.async = false;
  s.onload = function(){ /* boot() is called inside the loaded file */ };
  s.onerror = function(){
    if(el) el.innerHTML = '<div style="padding:24px;text-align:center">Lỗi tải Open City (mạng).<br>Thử Wi‑Fi hoặc Chrome.<br><br><a href="/" style="color:#38bdf8">← Hardwin</a></div>';
  };
  document.head.appendChild(s);
})();
