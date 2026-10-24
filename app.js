(function(){
  let current = 'all';
  let query = '';

  function renderGrid(){
    const grid = document.getElementById('grid');
    const filtered = TEMPLATES.filter(t => {
      const catOk = current === 'all' || (current === 'grok' && t.type === 'grok') || (current === 'cg' && t.type === 'cg');
      const qOk = !query || t.name.includes(query) || t.cat.includes(query) || t.prompt.includes(query);
      return catOk && qOk;
    });
    grid.innerHTML = filtered.map(t => `
      <div class="card" onclick="openModal('${t.id}')">
        <div class="card-cat ${t.type}">${t.cat}</div>
        <div class="card-name">${t.name}</div>
        <div class="card-preview">${t.prompt.slice(0,60)}…</div>
      </div>`).join('');
  }

  window.filterCat = function(cat, el){
    current = cat;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    renderGrid();
  };

  window.filterSearch = function(v){
    query = v;
    renderGrid();
  };

  window.openModal = function(id){
    const t = TEMPLATES.find(x => x.id === id);
    if(!t) return;
    document.getElementById('m-title').textContent = t.name;
    document.getElementById('m-cat').textContent = t.cat;
    document.getElementById('m-body').textContent = t.prompt;
    document.getElementById('modal').classList.add('open');
    document.getElementById('copy-btn').onclick = () => copyP(t.prompt);
  };

  window.copyP = function(text){
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copy-btn');
      btn.textContent = 'コピーしました ✓';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'プロンプトをコピー'; btn.classList.remove('copied'); }, 2000);
    });
  };

  window.closeMO = function(){
    document.getElementById('modal').classList.remove('open');
  };

  window.closeDirect = function(e){
    if(e.target.id === 'modal') closeMO();
  };

  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMO(); });

  renderGrid();
})();
