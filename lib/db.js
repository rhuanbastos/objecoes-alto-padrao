// lib/db.js
// Conexão com o banco MySQL (hospedado na Hostinger) usado pra guardar as objeções
// novas que os SDRs vão adicionando com respostas geradas pela IA, e o registro
// de uso da equipe. Fica fora da pasta api/ de propósito: é código compartilhado,
// não é uma função/endpoint (a Vercel só permite 12 funções no plano gratuito).
//
// Variáveis de ambiente necessárias (configurar no painel da Vercel):
//   DB_HOST -> host do MySQL remoto (ex: srv889.hstgr.io)
//   DB_USER -> usuário do banco (ex: u385455498_objecoes_app)
//   DB_PASS -> senha do banco
//   DB_NAME -> nome do banco (ex: u385455498_objecoes_ia)
//   DB_PORT -> opcional, padrão 3306

const mysql = require('mysql2/promise');

let pool;
function getPool(){
  if(!pool){
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 3,
      queueLimit: 0
    });
  }
  return pool;
}

async function ensureTable(){
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS objecoes_extra (
      id INT AUTO_INCREMENT PRIMARY KEY,
      categoria VARCHAR(120) NOT NULL,
      pergunta TEXT NOT NULL,
      resposta TEXT NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

// Tabela que guarda um registro simples de uso (quem usou, o quê, quando), pra
// alimentar o painel de uso da equipe (painel.html / api/uso.js). Cada ação
// (pedir resposta, adicionar objeção, logar) vira uma linha aqui.
async function ensureUsoTable(){
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS uso_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(190) NOT NULL,
      acao VARCHAR(40) NOT NULL,
      detalhe VARCHAR(500) NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

// Registra uma ação de uso. Nunca deve derrubar a função que chamou: se o banco
// falhar ou não estiver configurado, só ignora silenciosamente (a ferramenta
// continua funcionando normalmente pro SDR, só não conta essa estatística).
async function registrarUso(email, acao, detalhe){
  if(!process.env.DB_HOST || !email) return;
  try{
    await ensureUsoTable();
    const p = getPool();
    await p.query(
      'INSERT INTO uso_log (email, acao, detalhe) VALUES (?, ?, ?)',
      [email, acao, (detalhe || '').slice(0, 500)]
    );
  } catch(err){
    // Silencioso de propósito: estatística de uso nunca pode quebrar a ferramenta.
  }
}

module.exports = { getPool, ensureTable, ensureUsoTable, registrarUso };
