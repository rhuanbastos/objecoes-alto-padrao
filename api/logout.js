// api/logout.js
// Encerra a sessão do usuário (apaga o cookie de login).

const { cookieLogout } = require('../lib/auth');

module.exports = async function handler(req, res){
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST.' });
    return;
  }
  res.setHeader('Set-Cookie', cookieLogout());
  res.status(200).json({ ok: true });
};
