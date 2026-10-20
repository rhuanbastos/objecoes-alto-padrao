/* Conversa com a IA (gerar outra resposta + continuar a conversa).
   Compartilhado pela ferramenta de objeções (index.html) e pelo simulador. */
(function(){
  var css = `
  /* ===== Conversa com a IA (gerar outra + continuar) ===== */
  .ia-ref{margin-top:18px; padding-top:16px; border-top:1.5px dashed rgba(242,144,28,.5); text-align:left;}
  .ia-ref-top{display:flex; align-items:center; gap:12px; flex-wrap:wrap;}
  .ia-ref-btn{display:inline-flex; align-items:center; gap:8px; font-family:inherit; font-weight:700; font-size:13px; padding:10px 18px; border-radius:999px; border:1.5px solid #e0780f; background:#fff; color:#b8620a; cursor:pointer; transition:all .2s;}
  .ia-ref-btn:hover:not(:disabled){background:linear-gradient(135deg,#f6a23a,#e0780f); border-color:transparent; color:#000; box-shadow:0 10px 22px -10px rgba(242,144,28,.9); transform:translateY(-1px);}
  .ia-ref-btn:disabled{opacity:.6; cursor:default;}
  .ia-ref.ocupado .ia-ref-btn svg{animation:iaGira 1s linear infinite;}
  @keyframes iaGira{to{transform:rotate(360deg);}}
  .ia-ref-versoes{display:inline-flex; align-items:center; gap:4px; font-size:12px; font-weight:600; color:#3a3936; background:#fff; border:1.5px solid #e4e0da; border-radius:999px; padding:3px 6px;}
  .ia-ref-versoes[hidden]{display:none;}
  .ia-ref-versoes button{border:none; background:none; font-size:18px; line-height:1; width:26px; height:26px; border-radius:50%; cursor:pointer; color:#3a3936; font-family:inherit;}
  .ia-ref-versoes button:hover:not(:disabled){background:var(--orange-soft, #fdead2); color:#b8620a;}
  .ia-ref-versoes button:disabled{opacity:.3; cursor:default;}
  .ia-ref-chips{display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:14px;}
  .ia-ref-chips-label{font-size:11px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:#2b2a28;}
  .ia-chip{font-family:inherit; font-size:12px; font-weight:600; padding:7px 13px; border-radius:999px; border:1.5px solid #d9d4cb; background:#fff; color:#2b2a28; cursor:pointer; transition:all .2s;}
  .ia-chip:hover:not(:disabled){background:linear-gradient(135deg,#fde3bf,#f9c98a); border-color:rgba(242,144,28,.7); color:#000; transform:translateY(-1px);}
  .ia-chip:disabled{opacity:.5; cursor:default;}
  .ia-ref-thread{display:flex; flex-direction:column; gap:10px; margin-top:14px;}
  .ia-ref-thread:empty{display:none;}
  .ia-bolha{max-width:92%; padding:11px 15px; border-radius:16px; font-size:14px; line-height:1.6; white-space:pre-wrap; animation:iaBolha .3s ease;}
  @keyframes iaBolha{from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:none;}}
  .ia-bolha.eu{align-self:flex-end; background:#141414; color:#fff; border-bottom-right-radius:5px; font-weight:500;}
  .ia-bolha.ia{align-self:flex-start; background:#fff; color:#0b0b0a; border:1.5px solid rgba(242,144,28,.55); border-bottom-left-radius:5px; box-shadow:0 10px 24px -16px rgba(242,144,28,.6);}
  .ia-bolha-copiar{display:block; margin-top:8px; font-family:inherit; font-size:11.5px; font-weight:700; color:#b8620a; background:var(--orange-soft, #fdead2); border:none; border-radius:999px; padding:5px 12px; cursor:pointer;}
  .ia-bolha-copiar:hover{background:linear-gradient(135deg,#f6a23a,#e0780f); color:#000;}
  .ia-ref-chat{display:flex; gap:8px; margin-top:14px;}
  .ia-ref-chat input{flex:1; min-width:0; font-family:inherit; font-size:14px; font-weight:500; padding:13px 16px; border-radius:14px; border:1.5px solid #d9d4cb; background:#fff; color:#0b0b0a; outline:none; transition:border-color .2s, box-shadow .2s;}
  .ia-ref-chat input:hover{border-color:rgba(242,144,28,.8);}
  .ia-ref-chat input:focus{border-color:#f2901c; box-shadow:0 0 0 4px rgba(242,144,28,.2);}
  .ia-ref-chat input::placeholder{color:#6b6a67;}
  .ia-ref-send{font-family:inherit; font-weight:700; font-size:13px; padding:0 22px; border-radius:14px; border:none; background:linear-gradient(135deg,#f6a23a,#e0780f); color:#000; cursor:pointer; transition:all .2s;}
  .ia-ref-send:hover:not(:disabled){filter:brightness(1.07); box-shadow:0 12px 24px -12px rgba(242,144,28,.9); transform:translateY(-1px);}
  .ia-ref-send:disabled{opacity:.55; cursor:default;}
  .ia-ref-erro{margin-top:8px; font-size:12.5px; font-weight:600; color:#a4483a;}
  .ia-ref-erro:empty{display:none;}
  @media (max-width:640px){ .ia-bolha{max-width:100%;} .ia-ref-chat{flex-direction:column;} .ia-ref-send{padding:12px;} }
  .ia-ref-perfil{font-size:11px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; padding:6px 12px; border-radius:999px; color:#000;}
  .ia-ref-perfil[hidden]{display:none;}
  .ia-ref-perfil.moradia{background:linear-gradient(135deg,#7cc4ff,#3b8fe6);}
  .ia-ref-perfil.investimento{background:linear-gradient(135deg,#5eeab0,#17b26a);}

  .ia-bolha-txt .ai-spinner{display:inline-block; width:13px; height:13px; border:2px solid rgba(242,144,28,.3); border-top-color:#f2901c; border-radius:50%; animation:iaGira .8s linear infinite; vertical-align:-2px; margin-right:6px;}
`;
  var st = document.createElement('style'); st.id = 'conversa-ia-css'; st.textContent = css;
  document.head.appendChild(st);
})();

/* ---------- Conversa com a IA: gerar outra resposta + continuar a conversa ---------- */
function montarConversaIA(opts){
  const endpoint = opts.endpoint || 'api/responder';
  const versoes = [opts.resposta];
  let idx = 0;
  let ocupado = false;
  const thread = []; // [{role:'user'|'model', text}]

  const bar = document.createElement('div');
  bar.className = 'ia-ref';
  bar.innerHTML = `
    <div class="ia-ref-top">
      <button type="button" class="ia-ref-btn principal" data-outra>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        <span data-outra-label>Gerar outra resposta</span>
      </button>
      <span class="ia-ref-perfil" data-perfil hidden></span>
      <span class="ia-ref-versoes" hidden>
        <button type="button" data-prev aria-label="Versão anterior">‹</button>
        <span data-vlabel>1 de 1</span>
        <button type="button" data-next aria-label="Próxima versão">›</button>
      </span>
    </div>
    <div class="ia-ref-chips">
      <span class="ia-ref-chips-label">Ajustar:</span>
      <button type="button" class="ia-chip" data-msg="Deixa mais curta.">Mais curta</button>
      <button type="button" class="ia-chip" data-msg="Deixa mais direta, sem rodeio.">Mais direta</button>
      <button type="button" class="ia-chip" data-msg="Deixa mais informal, bem de WhatsApp.">Mais informal</button>
      <button type="button" class="ia-chip" data-msg="Deixa mais consultiva, terminando com uma pergunta aberta.">Mais consultiva</button>
      <button type="button" class="ia-chip" data-msg="Fecha convidando pra uma call com o closer.">Convidar pra call</button>
    </div>
    <div class="ia-ref-thread" data-thread></div>
    <form class="ia-ref-chat" data-form autocomplete="off">
      <input type="text" maxlength="800" data-input placeholder="Continuar a conversa: peça um ajuste, tire uma dúvida ou cole a próxima fala do cliente">
      <button type="submit" class="ia-ref-send" data-send>Enviar</button>
    </form>
    <div class="ia-ref-erro" data-erro></div>
  `;
  opts.anexarEm.appendChild(bar);

  const q = s => bar.querySelector(s);
  const btnOutra = q('[data-outra]'), labelOutra = q('[data-outra-label]');
  const nav = q('.ia-ref-versoes'), vlabel = q('[data-vlabel]');
  const threadEl = q('[data-thread]'), input = q('[data-input]'), erroEl = q('[data-erro]');
  const btnSend = q('[data-send]');
  const perfilEl = q('[data-perfil]');
  const perfilIni = opts.getPerfil ? opts.getPerfil() : '';
  if(perfilIni){ perfilEl.hidden = false; perfilEl.textContent = 'Perfil: ' + (perfilIni === 'moradia' ? 'Moradia' : 'Investimento'); perfilEl.classList.add(perfilIni); }

  function setOcupado(v){
    ocupado = v;
    bar.classList.toggle('ocupado', v);
    btnOutra.disabled = v; btnSend.disabled = v;
    bar.querySelectorAll('.ia-chip').forEach(c => c.disabled = v);
  }
  function mostrarErro(m){ erroEl.textContent = m || ''; }
  function atualizarNav(){
    nav.hidden = versoes.length < 2;
    vlabel.textContent = (idx + 1) + ' de ' + versoes.length;
    q('[data-prev]').disabled = idx === 0;
    q('[data-next]').disabled = idx === versoes.length - 1;
  }
  function textoAtual(){ return (opts.getTexto() || '').trim() || versoes[idx]; }

  async function chamar(corpo){
    const perfil = opts.getPerfil ? opts.getPerfil() : '';
    if(perfil) corpo.perfil = perfil;
    const r = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(corpo) });
    const dados = await r.json().catch(() => ({}));
    if(!r.ok) throw new Error(dados.error || 'Não consegui gerar agora. Tenta de novo.');
    if(!dados.resposta) throw new Error('Não veio uma resposta dessa vez. Tenta de novo.');
    return dados.resposta;
  }

  btnOutra.addEventListener('click', async () => {
    if(ocupado) return;
    mostrarErro('');
    versoes[idx] = textoAtual(); // guarda ajustes manuais da versão atual
    setOcupado(true); labelOutra.textContent = 'Gerando outra...';
    try{
      const nova = await chamar({ objecao: opts.objecao, regenerar: true, anteriores: versoes });
      versoes.push(nova); idx = versoes.length - 1;
      opts.setTexto(nova, true);
      atualizarNav();
    } catch(err){ mostrarErro(err.message); }
    labelOutra.textContent = 'Gerar outra resposta';
    setOcupado(false);
  });
  q('[data-prev]').addEventListener('click', () => { versoes[idx] = textoAtual(); idx = Math.max(0, idx - 1); opts.setTexto(versoes[idx], false); atualizarNav(); });
  q('[data-next]').addEventListener('click', () => { versoes[idx] = textoAtual(); idx = Math.min(versoes.length - 1, idx + 1); opts.setTexto(versoes[idx], false); atualizarNav(); });

  function bolha(papel, texto, carregando){
    const b = document.createElement('div');
    b.className = 'ia-bolha ' + (papel === 'user' ? 'eu' : 'ia');
    const t = document.createElement('div'); t.className = 'ia-bolha-txt';
    if(carregando){ t.innerHTML = '<span class="ai-spinner"></span> Pensando...'; } else { t.textContent = texto; }
    b.appendChild(t);
    if(papel !== 'user' && !carregando){
      const c = document.createElement('button'); c.type = 'button'; c.className = 'ia-bolha-copiar'; c.textContent = 'Copiar';
      c.addEventListener('click', () => {
        navigator.clipboard.writeText(t.textContent).then(() => { c.textContent = 'Copiado ✓'; setTimeout(() => c.textContent = 'Copiar', 1500); }).catch(() => { c.textContent = 'Selecione e copie'; });
      });
      b.appendChild(c);
    }
    threadEl.appendChild(b);
    b.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return b;
  }

  async function enviar(msg){
    msg = (msg || '').trim();
    if(!msg || ocupado) return;
    mostrarErro('');
    versoes[idx] = textoAtual();
    const base = [{ role:'user', text: opts.objecao }, { role:'model', text: versoes[idx] }];
    const hist = base.concat(thread.slice(-10));
    bolha('user', msg);
    const esperando = bolha('model', '', true);
    setOcupado(true); input.value = '';
    try{
      const resp = await chamar({ objecao: opts.objecao, historico: hist, mensagem: msg });
      thread.push({ role:'user', text: msg }, { role:'model', text: resp });
      esperando.remove(); bolha('model', resp);
    } catch(err){
      esperando.remove(); mostrarErro(err.message);
      input.value = msg;
    }
    setOcupado(false);
  }
  q('[data-form]').addEventListener('submit', e => { e.preventDefault(); enviar(input.value); });
  bar.querySelectorAll('.ia-chip').forEach(c => c.addEventListener('click', () => enviar(c.dataset.msg)));
  atualizarNav();
  return bar;
}
