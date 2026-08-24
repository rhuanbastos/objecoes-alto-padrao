// api/delete-objecao.js
// Exclui da base compartilhada uma objeção que algum SDR adicionou (a partir de
// uma resposta gerada pela IA). Só funciona com a senha de administrador, pra
// SDRs conseguirem imputar mas só quem tem a senha conseguir editar/excluir.
//
// Variável de ambiente necessária (configurar no painel da Vercel):
//   ADMIN_PASSWORD -> senha simples que só a gestão conhece

const { getPool, ensureTable } = require('../lib/db');
const { exigirSessao } = require('../lib/auth');

module.exports = async function handler(req, res){
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST.' });
    return;
  }

  const sessao = exigirSessao(req, res);
  if(!sessao) return;

  if (!process.env.DB_HOST) {
    res.status(500).json({ error: 'Banco de dados ainda não configurado nesta versão.' });
    return;
  }

  if (!process.env.ADMIN_PASSWORD) {
    res.status(500).json({ error: 'Senha de administrador ainda não configurada nesta versão. Configure ADMIN_PASSWORD na Vercel.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  const id = body && Number(body.id);
  const senha = (body && typeof body.senha === 'string') ? body.senha : '';

  if (!id) {
    res.status(400).json({ error: 'Envie { "id": <numero>, "senha": "..." } no corpo da requisição.' });
    return;
  }

  if (senha !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Senha incorreta.' });
    return;
  }

  try {
    await ensureTable();
    const pool = getPool();
    const [result] = await pool.query('DELETE FROM objecoes_extra WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Essa objeção não foi encontrada (talvez já tenha sido excluída por outra pessoa).' });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao excluir da base.', detalhe: String(err && err.message || err) });
  }
};
