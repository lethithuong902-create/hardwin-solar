(function(){
function wait(n){if(typeof THREE!=='undefined'){try{boot();}catch(e){var el=document.getElementById('load');if(el)el.innerHTML='<div style="padding:24px;text-align:center">Lỗi: '+(e.message||e)+'<br><br><a href="/" style="color:#38bdf8">← Hardwin</a></div>';console.error(e);}return;}if(n>150){var el=document.getElementById('load');if(el)el.innerHTML='<div>Không tải Three.js — thử Chrome</div>';return;}setTimeout(function(){wait(n+1);},80);}
function boot(){
/* RESTORE_IN_PROGRESS - full content via parts */
console.log('city loading');
var el=document.getElementById('load');
if(el)el.innerHTML='<div style="padding:24px;text-align:center">Đang khôi phục game...<br><small>Thử lại sau vài giây</small></div>';
}
wait(0);
})();
