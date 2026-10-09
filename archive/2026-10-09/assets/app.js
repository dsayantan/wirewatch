
(function(){
  var dp=document.getElementById('datepick');
  if(dp) dp.addEventListener('change',function(){ location.href=dp.value; });
  // language / group filter buttons: <div class="filters" data-target="#x"> with data-f
  document.querySelectorAll('.filters').forEach(function(f){
    var tgt=document.querySelector(f.getAttribute('data-target'));
    f.addEventListener('click',function(ev){
      var b=ev.target.closest('button'); if(!b) return;
      f.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed','false');});
      b.setAttribute('aria-pressed','true');
      var v=b.getAttribute('data-f');
      tgt.querySelectorAll('[data-f]').forEach(function(el){
        el.style.display=(v==='all'||el.getAttribute('data-f').split(' ').indexOf(v)>=0)?'':'none';
      });
    });
  });
})();
