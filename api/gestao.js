// api/gestao.js
// Acesso da Gestão da Plataforma Águia (app.aguiaconsultoriaimobiliaria.com) para
// revisar e excluir o que os SDRs colocaram: as objeções adicionadas à base
// compartilhada (objecoes_extra) e o histórico do que foi perguntado (uso_log).
// Não usa o login Google: só aceita chamadas de servidor com o token secreto,
// que fica guardado no Cloudflare da Plataforma (nunca no navegador).
//
// Variável de ambiente necessária (configurar no painel da Vercel):
// GESTAO_TOKEN -> texto longo e aleatório; o MESMO valor vai no Cloudflare como AI_ASSIST_TOKEN

const crypto = require('crypto');
const { getPool, ensureTable, ensureUsoTable } = require('../lib/db');

function tokenOk(req){
  const esperado = process.env.GESTAO_TOKEN || '';
  const recebido = String(req.headers['x-gestao-token'] || '');
  if (esperado.length < 24 || recebido.length !== esperado.length) return false;
  return crypto.timingSafeEqual(Buffer.from(recebido), Buffer.from(esperado));
}

module.exports = async function handler(req, res){
  res.setHeader('Cache-Control', 'no-store');
  if (!tokenOk(req)) {
    await new Promise(r => setTimeout(r, 500));
    res.status(401).json({ error: 'Não autorizado.' });
    return;
  }
  if (!process.env.DB_HOST) {
    res.status(500).json({ error: 'Banco de dados não configurado.' });
    return;
  }
  try {
    await ensureTable();
    await ensureUsoTable();
    const pool = getPool();

    if (req.method === 'GET') {
      const [base] = await pool.query(
        'SELECT id, categoria, pergunta, resposta, criado_em FROM objecoes_extra ORDER BY criado_em DESC LIMIT 1000'
      );
      const [historico] = await pool.query(
        "SELECT id, email, acao, detalhe, criado_em FROM uso_log WHERE acao IN ('responder','add_objecao') ORDER BY criado_em DESC LIMIT 2000"
      );
      res.status(200).json({ base, historico });
      return;
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      const tipo = body && body.tipo, id = body && Number(body.id);
      if (!id || (tipo !== 'base' && tipo !== 'historico')) {
        res.status(400).json({ error: 'Envie { "tipo": "base" | "historico", "id": <numero> }.' });
        return;
      }
      const tabela = tipo === 'base' ? 'objecoes_extra' : 'uso_log';
      const [r] = await pool.query(`DELETE FROM ${tabela} WHERE id = ?`, [id]);
      if (r.affectedRows === 0) { res.status(404).json({ error: 'Não encontrado (talvez já excluído).' }); return; }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Use GET ou POST.' });
  } catch (err) {
    res.status(500).json({ error: 'Falha no banco.', detalhe: String(err && err.message || err) });
  }
};
