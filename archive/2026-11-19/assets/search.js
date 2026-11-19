
(function(){
  var KEY='ww-saved';
  function saved(){try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){return [];}}
  function store(a){try{localStorage.setItem(KEY,JSON.stringify(a));}catch(e){}}
  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  var data=null, box=document.getElementById('results'), q=document.getElementById('q'),
      sv=document.getElementById('saved'), alerts=document.getElementById('alerts');
  function hits(term){
    var t=term.toLowerCase().trim(); if(!t||!data) return [];
    return data.items.filter(function(it){
      return (it.title+' '+(it.en||'')).toLowerCase().indexOf(t)>=0;});
  }
  function row(it){
    var o=data.outlets[it.outlet]||{name:it.outlet};
    return '<li class="it"><a class="h" href="'+esc(it.link)+'" target="_blank" rel="noopener">'+
      esc(it.title)+'</a>'+
      '<span class="meta">'+esc(o.name)+' · '+esc(it.pub.slice(11,16))+'</span></li>';
  }
  function run(){
    if(!box) return; var h=hits(q.value);
    box.innerHTML=q.value.trim()?('<p class="meta">'+h.length+' headlines</p><ul class="plain">'+
      h.slice(0,300).map(row).join('')+'</ul>'):'';
  }
  function drawSaved(){
    var a=saved();
    if(sv) sv.innerHTML=a.length?a.map(function(s,i){
      return '<span class="chip"><a href="#" data-run="'+esc(s)+'">'+esc(s)+'</a> '+
        '<a href="#" data-del="'+i+'" aria-label="remove">×</a></span>';}).join(' '):
      '<span class="meta">No saved searches yet.</span>';
    if(alerts){
      if(!a.length){alerts.innerHTML='<p class="meta">Save a search on the <a href="search.html">search page</a> and its matches show up here each day.</p>';return;}
      alerts.innerHTML=a.map(function(s){var h=hits(s);
        return '<div class="card"><h3>'+esc(s)+' <small class="meta">'+h.length+' today</small></h3><ul class="plain">'+
          h.slice(0,4).map(row).join('')+'</ul></div>';}).join('');
    }
  }
  document.addEventListener('click',function(ev){
    var r=ev.target.closest('[data-run]'), d=ev.target.closest('[data-del]');
    if(r){ev.preventDefault(); if(q){q.value=r.getAttribute('data-run'); run();}}
    if(d){ev.preventDefault(); var a=saved(); a.splice(+d.getAttribute('data-del'),1); store(a); drawSaved();}
  });
  var f=document.getElementById('sform');
  if(f) f.addEventListener('submit',function(ev){ev.preventDefault(); run();});
  var sb=document.getElementById('save');
  if(sb) sb.addEventListener('click',function(){var v=q.value.trim(); if(!v) return;
    var a=saved(); if(a.indexOf(v)<0){a.push(v); store(a);} drawSaved();});
  fetch('data.json').then(function(r){return r.json();}).then(function(d){
    data=d; var m=location.hash.match(/q=([^&]+)/);
    if(m&&q){q.value=decodeURIComponent(m[1]);} run(); drawSaved();
  }).catch(function(){ if(box) box.innerHTML='<p class="meta">Search needs the published site (data.json could not be loaded from a local file).</p>'; drawSaved();});
})();
