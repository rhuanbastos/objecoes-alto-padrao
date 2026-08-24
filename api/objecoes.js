// api/objecoes.js
// Devolve a base inteira de objeções (as 20 fixas + as que os SDRs foram
// adicionando com a IA), só pra quem estiver logado com e-mail @aguia...
// Substituiu o antigo list-objecoes.js: agora as 20 fixas também só chegam
// pra quem tiver sessão válida, em vez de ficarem visíveis no código-fonte
// da página pra qualquer pessoa, mesmo sem estar logada.

const { exigirSessao } = require('../lib/auth');
const { getPool, ensureTable } = require('../lib/db');
const FIXAS = require('../lib/objecoes-fixas');

module.exports = async function handler(req, res){
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Use GET.' });
    return;
  }

  const sessao = exigirSessao(req, res);
  if(!sessao) return;

  let extras = [];
  if(process.env.DB_HOST){
    try{
      await ensureTable();
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT id, categoria, pergunta, resposta, criado_em FROM objecoes_extra ORDER BY id ASC'
      );
      extras = rows;
    } catch(err){
      // Se o banco falhar, ainda devolve as fixas, só sem as extras dessa vez.
      extras = [];
    }
  }

  res.status(200).json({ fixas: FIXAS, extras });
};
