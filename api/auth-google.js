// api/auth-google.js
// Recebe o token de login do Google (enviado pelo botão "Entrar com Google" no
// index.html), confere se é um e-mail @aguiaconsultoriaimobiliaria.com de
// verdade, e cria o cookie de sessão que libera o uso da ferramenta.

const { verificarTokenGoogle, criarCookieSessao } = require('./auth');

module.exports = async function handler(req, res){
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  const credential = body && typeof body.credential === 'string' ? body.credential : '';
  if(!credential){
    res.status(400).json({ error: 'Envie { "credential": "..." } no corpo da requisição.' });
    return;
  }

  try{
    const { email, nome } = await verificarTokenGoogle(credential);
    const cookie = criarCookieSessao(email);
    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ ok: true, email, nome });
  } catch(err){
    const status = err && err.dominioInvalido ? 403 : 401;
    res.status(status).json({ error: err && err.message || 'Falha ao verificar login do Google.' });
  }
};
