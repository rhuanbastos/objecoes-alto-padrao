// api/list-objecoes.js
// Devolve a lista de objeções que os SDRs foram adicionando à base (as que a IA
// gerou e alguém clicou em "Adicionar essa resposta à base"). O index.html chama
// isso ao carregar a página e junta o resultado com as objeções fixas.

const { getPool, ensureTable } = require('./db');

module.exports = async function handler(req, res){
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Use GET.' });
    return;
  }

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
