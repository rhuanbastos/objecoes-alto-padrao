// api/db.js
// Conexão com o banco MySQL (hospedado na Hostinger) usado pra guardar as objeções
// novas que os SDRs vão adicionando com respostas geradas pela IA. Reaproveitada
// pelos outros arquivos da pasta api/ (list-objecoes.js e add-objecao.js).
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

module.exports = { getPool, ensureTable };
