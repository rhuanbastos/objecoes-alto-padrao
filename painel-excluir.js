/* painel-excluir.js
 * Coloca um bot\u00E3o "\u22EF" no fim de cada linha das tabelas do Painel de uso (painel.html),
 * com a op\u00E7\u00E3o "Excluir". A exclus\u00E3o usa /api/limpar (login Google + senha de administrador),
 * apagando do banco o registro daquela pergunta. N\u00E3o muda nada do resto do painel.
 */
(function () {
  const semAc = s => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const limpa = t => String(t ?? "").replace(/^\[cache\]\s*/, "");
  const chave = t => semAc(limpa(t)).replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const fmt = v => new Date(v).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
  let senha = "", cache = null;

  const css = document.createElement("style");
  css.textContent = `
  .px-dots{border:1px solid transparent;background:transparent;color:#a9b4c8;border-radius:8px;width:30px;height:28px;font:700 16px/1 system-ui;cursor:pointer;letter-spacing:1px}
  .px-dots:hover,.px-dots[aria-expanded="true"]{border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#fff}
  .px-td{width:40px;text-align:right;white-space:nowrap}
  .px-menu{position:fixed;z-index:9999;min-width:180px;background:#0b1030;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:6px;box-shadow:0 18px 50px rgba(0,0,0,.55);font:500 14px Poppins,system-ui,sans-serif;color:#e2e8f0}
  .px-menu button{display:block;width:100%;text-align:left;border:0;background:transparent;color:#fecdd3;padding:9px 12px;border-radius:8px;font:inherit;cursor:pointer}
  .px-menu button:hover{background:rgba(244,63,94,.18)}
  .px-menu .px-info{padding:8px 12px;color:#a9b4c8;font-size:12.5px;max-width:280px}
  .px-menu input{width:100%;margin:4px 0 6px;background:rgba(5,7,20,.8);border:1px solid rgba(255,255,255,.2);color:#fff;border-radius:8px;padding:8px 10px;font:inherit}
  .px-saindo{opacity:.25;transition:opacity .3s}`;
  document.head.appendChild(css);

  function senhaDoPainel() {
    if (senha) return senha;
    const i = [...document.querySelectorAll('input[type="password"]')].find(x => x.value);
    return i ? i.value : "";
  }
  async function api(corpo) {
    const r = await fetch("/api/limpar", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...corpo, senha: senhaDoPainel() }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(d.error || r.status); e.status = r.status; throw e; }
    return d;
  }
  async function registros(forcar) {
    if (!cache || forcar) cache = (await api({ acao: "listar" })).historico || [];
    return cache;
  }

  // Descobre quais registros do banco correspondem \u00E0 linha da tabela.
  async function idsDaLinha(tr) {
    const cel = [...tr.cells].filter(td => !td.classList.contains("px-td"));
    const textos = cel.map(td => (td.getAttribute("title") || td.textContent || "").trim());
    const email = (textos.find(t => EMAIL.test(t)) || "").match(EMAIL)?.[0]?.toLowerCase() || "";
    const data = textos.find(t => /^\d{2}\/\d{2}\/\d{2},?\s+\d{2}:\d{2}$/.test(t)) || "";
    const candidatos = textos.filter(t => t && !EMAIL.test(t) && t !== data && !/^\d+$/.test(t) && !/^pediu resposta$|^salvou|^entrou|^login$/i.test(t));
    const texto = candidatos.sort((a, b) => b.length - a.length)[0] || "";
    const cortado = /(\.\.\.|\u2026)$/.test(texto);
    const k = chave(texto.replace(/(\.\.\.|\u2026)$/, ""));
    if (!k) return [];
    const lista = await registros();
    return lista.filter(r => {
      const kr = chave(r.detalhe);
      const bateTexto = cortado ? kr.startsWith(k) : kr === k;
      if (!bateTexto) return false;
      if (email && String(r.email).toLowerCase() !== email) return false;
      // Com e-mail (lista do dia): s\u00F3 aquele registro. Sem e-mail (lista agrupada): todas as vezes do mesmo texto.
      if (email && data && fmt(r.criado_em).replace(",", "") !== data.replace(",", "")) return false;
      return true;
    }).map(r => r.id);
  }

  let aberto = null;
  function fechar() { if (aberto) { aberto.menu.remove(); aberto.btn.setAttribute("aria-expanded", "false"); aberto = null; } }
  document.addEventListener("click", e => { if (aberto && !aberto.menu.contains(e.target) && e.target !== aberto.btn) fechar(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") fechar(); });

  function abrirMenu(btn, tr) {
    fechar();
    const menu = document.createElement("div");
    menu.className = "px-menu"; menu.setAttribute("role", "menu");
    menu.addEventListener("click", e => e.stopPropagation());
    const r = btn.getBoundingClientRect();
    menu.style.top = Math.min(r.bottom + 6, innerHeight - 160) + "px";
    menu.style.left = Math.max(8, r.right - 200) + "px";
    document.body.appendChild(menu);
    aberto = { menu, btn }; btn.setAttribute("aria-expanded", "true");
    const opcoes = () => {
      menu.innerHTML = "";
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "menuitem"); b.textContent = "Excluir";
      b.onclick = () => confirmar();
      menu.appendChild(b);
    };
    const pedirSenha = (depois) => {
      menu.innerHTML = '<div class="px-info">Digite a senha de administrador para excluir:</div>';
      const i = document.createElement("input"); i.type = "password"; i.autocomplete = "current-password";
      const ok = document.createElement("button"); ok.type = "button"; ok.textContent = "Continuar"; ok.style.color = "#a5f3fc";
      const vai = () => { senha = i.value; depois(); };
      ok.onclick = vai; i.onkeydown = e => { if (e.key === "Enter") vai(); };
      menu.append(i, ok); i.focus();
    };
    const confirmar = async () => {
      if (!senhaDoPainel()) return pedirSenha(confirmar);
      menu.innerHTML = '<div class="px-info">Procurando o registro\u2026</div>';
      let ids;
      try { ids = await idsDaLinha(tr); }
      catch (e) { if (e.status === 401 && /senha/i.test(e.message)) { senha = ""; return pedirSenha(confirmar); } menu.innerHTML = `<div class="px-info">N\u00E3o consegui: ${e.message}</div>`; return; }
      if (!ids.length) { menu.innerHTML = '<div class="px-info">N\u00E3o encontrei este registro no banco (talvez j\u00E1 tenha sido exclu\u00EDdo).</div>'; return; }
      menu.innerHTML = `<div class="px-info">Apagar ${ids.length > 1 ? ids.length + " registros iguais" : "este registro"}? N\u00E3o d\u00E1 para desfazer.</div>`;
      const sim = document.createElement("button"); sim.type = "button"; sim.textContent = "Confirmar exclus\u00E3o";
      const nao = document.createElement("button"); nao.type = "button"; nao.textContent = "Cancelar"; nao.style.color = "#a9b4c8";
      sim.onclick = async () => {
        menu.innerHTML = '<div class="px-info">Excluindo\u2026</div>';
        try {
          await api({ acao: "excluir", tipo: "historico", ids });
          cache = cache ? cache.filter(r => !ids.includes(r.id)) : cache;
          fechar(); tr.classList.add("px-saindo"); setTimeout(() => tr.remove(), 320);
        } catch (e) { menu.innerHTML = `<div class="px-info">N\u00E3o consegui excluir: ${e.message}</div>`; }
      };
      nao.onclick = fechar;
      menu.append(sim, nao);
    };
    opcoes();
  }

  // Coloca o "\u22EF" nas linhas que s\u00E3o perguntas (t\u00EAm texto de obje\u00E7\u00E3o).
  function decorar() {
    document.querySelectorAll("table").forEach(tb => {
      const cab = semAc(tb.querySelector("thead, tr")?.textContent || "");
      const ehTabela = /^\s*objec/.test(cab) || /detalhe/.test(cab); // s\u00f3 as tabelas de perguntas (n\u00e3o a de pessoas)
      if (!ehTabela) return;
      const head = tb.tHead?.rows?.[0];
      if (head && !head.querySelector(".px-td")) { const th = document.createElement("th"); th.className = "px-td"; head.appendChild(th); }
      [...tb.tBodies].forEach(tbody => [...tbody.rows].forEach(tr => {
        if (tr.querySelector(".px-td") || tr.cells.length < 2) return;
        if (tb.querySelector("td") && /pediu resposta/i.test(tb.textContent) && !/pediu resposta/i.test(tr.textContent)) {
          tr.appendChild(Object.assign(document.createElement("td"), { className: "px-td" })); return;
        }
        const td = document.createElement("td"); td.className = "px-td";
        const b = document.createElement("button"); b.type = "button"; b.className = "px-dots"; b.textContent = "\u22EF";
        b.setAttribute("aria-label", "Mais op\u00E7\u00F5es"); b.setAttribute("aria-haspopup", "menu"); b.setAttribute("aria-expanded", "false");
        b.onclick = e => { e.stopPropagation(); if (aberto && aberto.btn === b) return fechar(); abrirMenu(b, tr); };
        td.appendChild(b); tr.appendChild(td);
      }));
    });
  }
  new MutationObserver(() => decorar()).observe(document.body, { childList: true, subtree: true });
  decorar();
})();
