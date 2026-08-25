// api/add-objecao.js
// Recebe uma objeção + resposta gerada pela IA que um SDR marcou como "boa" e
// salva no banco compartilhado, pra virar uma entrada fixa da base pra todo
// mundo (na categoria "Sugeridas pela IA"), sem precisar chamar a IA de novo.

const { getPool, ensureTable, registrarUso } = require('../lib/db');
const { exigirSessao } = require('../lib/auth');

module.exports = async function handler(req, res){
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST.' });
    return;
  }

  const sessao = exigirSessao(req, res);
  if(!sessao) return;

  if (!process.env.DB_HOST) {
    res.status(500).json({ error: 'Banco de dados ainda não configurado nesta versão. Configure DB_HOST, DB_USER, DB_PASS e DB_NAME na Vercel.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  const categoria = (body && typeof body.categoria === 'string' ? body.categoria.trim() : '') || 'Sugeridas pela IA';
  const pergunta = (body && typeof body.pergunta === 'string' ? body.pergunta.trim() : '');
  const resposta = (body && typeof body.resposta === 'string' ? body.resposta.trim() : '');

  if (!pergunta || !resposta) {
    res.status(400).json({ error: 'Envie { "pergunta": "...", "resposta": "..." } no corpo da requisição.' });
    return;
  }
  if (pergunta.length > 1200 || resposta.length > 2000) {
    res.status(400).json({ error: 'Texto muito longo pra salvar.' });
    return;
  }

  try {
    await ensureTable();
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO objecoes_extra (categoria, pergunta, resposta) VALUES (?, ?, ?)',
      [categoria, pergunta, resposta]
    );
    registrarUso(sessao.email, 'add_objecao', pergunta).catch(() => {});
    res.status(200).json({ ok: true, id: result.insertId, categoria, pergunta, resposta });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao salvar na base.', detalhe: String(err && err.message || err) });
  }
};
