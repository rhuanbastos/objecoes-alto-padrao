// api/limpar.js
// Limpeza do que os SDRs colocaram na ferramenta (página limpeza.html):
// lista e exclui registros do histórico de perguntas (uso_log) e objeções que
// foram salvas na base compartilhada (objecoes_extra).
// Precisa estar logado com o Google (@aguia...) E da senha de administrador,
// a mesma do painel de uso.
//
// Variáveis de ambiente (já configuradas na Vercel): DB_HOST, DB_USER, DB_PASS, DB_NAME, ADMIN_PASSWORD

const { getPool, ensureTable, ensureUsoTable } = require('../lib/db');
const { exigirSessao } = require('../lib/auth');

module.exports = async function handler(req, res){
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.status(405).json({ error: 'Use POST.' }); return; }

  const sessao = exigirSessao(req, res);
  if (!sessao) return;

  if (!process.env.ADMIN_PASSWORD) { res.status(500).json({ error: 'Configure ADMIN_PASSWORD na Vercel.' }); return; }
  if (!process.env.DB_HOST) { res.status(500).json({ error: 'Banco de dados não configurado.' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const senha = (body && typeof body.senha === 'string') ? body.senha : '';
  if (senha !== process.env.ADMIN_PASSWORD) {
    await new Promise(r => setTimeout(r, 500));
    res.status(401).json({ error: 'Senha incorreta.' });
    return;
  }

  try {
    await ensureTable();
    await ensureUsoTable();
    const pool = getPool();

    if (body.acao === 'listar') {
      const [historico] = await pool.query(
        "SELECT id, email, acao, detalhe, criado_em FROM uso_log WHERE acao IN ('responder','add_objecao') ORDER BY criado_em DESC LIMIT 3000"
      );
      const [base] = await pool.query(
        'SELECT id, categoria, pergunta, resposta, criado_em FROM objecoes_extra ORDER BY criado_em DESC LIMIT 1000'
      );
      res.status(200).json({ historico, base });
      return;
    }

    if (body.acao === 'excluir') {
      const tabela = body.tipo === 'base' ? 'objecoes_extra' : body.tipo === 'historico' ? 'uso_log' : null;
      const ids = Array.isArray(body.ids) ? body.ids.map(Number).filter(n => Number.isInteger(n) && n > 0).slice(0, 500) : [];
      if (!tabela || !ids.length) { res.status(400).json({ error: 'Envie { acao: "excluir", tipo: "historico" | "base", ids: [..] }.' }); return; }
      const [r] = await pool.query(`DELETE FROM ${tabela} WHERE id IN (?)`, [ids]);
      res.status(200).json({ ok: true, excluidos: r.affectedRows });
      return;
    }

    res.status(400).json({ error: 'Ação inválida.' });
  } catch (err) {
    res.status(500).json({ error: 'Falha no banco.', detalhe: String(err && err.message || err) });
  }
};
