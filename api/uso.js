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

// Agrupa as objeções que caíram no fallback de IA (ou seja, a busca local
// não achou nada forte na base) por texto normalizado, pra mostrar no painel
// o que mais falta na base fixa. Normaliza igual ao motor de busca local
// (minúscula, sem acento, sem pontuação), pra "Preço tá caro" e "preço tá
// caro?!" caírem no mesmo grupo. Também tira o prefixo "[cache]" (usado
// quando a resposta veio do cache do dia em vez de gerar de novo), porque
// pro propósito desse relatório as duas contam como "a base local não achou".
function normalizarParaAgrupar(s){
  return String(s || '')
    .replace(/^\[cache\]\s*/, '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function agruparSemMatch(rows){
  const grupos = {};
  rows.forEach(row => {
    const chave = normalizarParaAgrupar(row.detalhe);
    if (!chave || chave.length < 4) return; // ruído: transcrição vazia, texto curto demais pra ser útil
    if (row.detalhe === '(áudio sem transcrição reconhecida)') return; // não é uma objeção de verdade, é falha de transcrição
    if (!grupos[chave]) {
      grupos[chave] = {
        exemplo: String(row.detalhe || '').replace(/^\[cache\]\s*/, ''),
        vezes: 0,
        ultima: row.criado_em
      };
    }
    grupos[chave].vezes++;
    if (new Date(row.criado_em) > new Date(grupos[chave].ultima)) {
      grupos[chave].ultima = row.criado_em;
    }
  });
  return Object.values(grupos)
    .sort((a, b) => b.vezes - a.vezes || new Date(b.ultima) - new Date(a.ultima))
    .slice(0, 30);
}

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
    res.status(200).json({ porUsuario: [], recentes: [], semMatch: [] });
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
        MAX(criado_em) AS ultimo_acesso,
        (
          SELECT ul2.detalhe FROM uso_log ul2
          WHERE ul2.email = uso_log.email AND ul2.acao = 'login' AND ul2.detalhe <> ''
          ORDER BY ul2.criado_em DESC LIMIT 1
        ) AS nome
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

    // Últimos 500 pedidos de resposta (texto ou áudio), pra montar o relatório
    // de "objeções que a base local não resolveu sozinha" (agrupado em JS,
    // porque agrupar por semelhança de texto é mais simples aqui do que em SQL).
    const [semMatchRows] = await pool.query(`
      SELECT detalhe, criado_em
      FROM uso_log
      WHERE acao = 'responder'
      ORDER BY criado_em DESC
      LIMIT 500
    `);
    const semMatch = agruparSemMatch(semMatchRows);

    res.status(200).json({ porUsuario, recentes, semMatch });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao buscar estatísticas de uso.', detalhe: String(err && err.message || err) });
  }
};
