// api/list-objecoes.js
// Endpoint antigo, substituído pelo api/objecoes.js (que já devolve as fixas +
// as extras numa chamada só, protegida por login). Deixado aqui só por
// segurança, com sessão exigida também, caso algo ainda aponte pra ele.

const { getPool, ensureTable } = require('./db');
const { exigirSessao } = require('./auth');

module.exports = async function handler(req, res){
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Use GET.' });
    return;
  }

  const sessao = exigirSessao(req, res);
  if(!sessao) return;

  if (!process.env.DB_HOST) {
    // Banco ainda não configurado nessa versão: devolve lista vazia em vez de erro,
    // pra não quebrar a ferramenta pra quem ainda não configurou o banco.
    res.status(200).json({ objecoes: [] });
    return;
  }

  try {
    await ensureTable();
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id, categoria, pergunta, resposta, criado_em FROM objecoes_extra ORDER BY id ASC'
    );
    res.status(200).json({ objecoes: rows });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao buscar objeções salvas.', detalhe: String(err && err.message || err) });
  }
};
