// api/uso.js
// Devolve as estatísticas de uso da ferramenta (quem usou, quantas vezes, o
// quê), pra alimentar o painel de uso da equipe (painel.html). Só funciona
// pra quem estiver logado com e-mail @aguia... E ALÉM disso precisa da senha
// de administrador, porque é dado de desempenho individual do time, não é
// pra qualquer SDR logado ver os números dos colegas.
//
// Variáveis de ambiente necessárias (já configuradas na Vercel):
//   DB_HOST, DB_USER, DB_PASS, DB_NAME -> banco de dados
//   ADMIN_PASSWORD -> mesma senha usada pra excluir objeções

const { getPool, ensureUsoTable } = require('../lib/db');
const { exigirSessao } = require('../lib/auth');

module.exports = async function handler(req, res){
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST.' });
    return;
  }

  const sessao = exigirSessao(req, res);
  if(!sessao) return;

  if (!process.env.ADMIN_PASSWORD) {
    res.status(500).json({ error: 'Senha de administrador ainda não configurada nesta versão. Configure ADMIN_PASSWORD na Vercel.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const senha = (body && typeof body.senha === 'string') ? body.senha : '';

  if (senha !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Senha incorreta.' });
    return;
  }

  if (!process.env.DB_HOST) {
    res.status(200).json({ porUsuario: [], recentes: [] });
    return;
  }

  try {
    await ensureUsoTable();
    const pool = getPool();

    const [porUsuario] = await pool.query(`
      SELECT
        email,
        SUM(acao = 'responder') AS respostas,
        SUM(acao = 'add_objecao') AS objecoes_adicionadas,
        SUM(acao = 'login') AS logins,
        MAX(criado_em) AS ultimo_acesso
      FROM uso_log
      GROUP BY email
      ORDER BY respostas DESC, ultimo_acesso DESC
    `);

    const [recentes] = await pool.query(`
      SELECT email, acao, detalhe, criado_em
      FROM uso_log
      ORDER BY criado_em DESC
      LIMIT 40
    `);

    res.status(200).json({ porUsuario, recentes });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao buscar estatísticas de uso.', detalhe: String(err && err.message || err) });
  }
};
