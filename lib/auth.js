// lib/auth.js
// Funções compartilhadas de autenticação: confere o login do Google, checa se
// o e-mail é da Águia, e cria/lê o cookie de sessão usado pelas outras funções.
// Fica fora da pasta api/ de propósito (ver nota em lib/db.js).
//
// Variáveis de ambiente necessárias (configurar no painel da Vercel):
//   GOOGLE_CLIENT_ID -> Client ID criado no Google Cloud Console (OAuth)
//   SESSION_SECRET   -> uma frase secreta qualquer, só pra assinar o cookie de sessão

const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const DOMINIO_PERMITIDO = 'aguiaconsultoriaimobiliaria.com';
const COOKIE_NAME = 'sessao_aguia';
const SESSAO_DIAS = 30;

function parseCookies(req){
  const header = req.headers && req.headers.cookie;
  const cookies = {};
  if(!header) return cookies;
  header.split(';').forEach(part => {
    const idx = part.indexOf('=');
    if(idx === -1) return;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    cookies[key] = decodeURIComponent(val);
  });
  return cookies;
}

// Verifica o ID token que o navegador recebeu do botão "Entrar com Google",
// confirma que é legítimo (assinatura, expiração, audiência certa) e que o
// e-mail é @aguiaconsultoriaimobiliaria.com de verdade.
async function verificarTokenGoogle(idToken){
  if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error('GOOGLE_CLIENT_ID não configurado no servidor.');
  }
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  if(!payload || !payload.email_verified){
    throw new Error('E-mail do Google não verificado.');
  }
  const email = String(payload.email || '').toLowerCase();
  const dominioOk = payload.hd === DOMINIO_PERMITIDO || email.endsWith('@' + DOMINIO_PERMITIDO);
  if(!dominioOk){
    const erro = new Error('Esse e-mail não é da Águia. Faça login com seu e-mail @' + DOMINIO_PERMITIDO + '.');
    erro.dominioInvalido = true;
    throw erro;
  }
  return { email, nome: payload.name || '' };
}

function criarCookieSessao(email, nome){
  if(!process.env.SESSION_SECRET){
    throw new Error('SESSION_SECRET não configurado no servidor.');
  }
  const token = jwt.sign({ email, nome: nome || '' }, process.env.SESSION_SECRET, { expiresIn: SESSAO_DIAS + 'd' });
  const maxAge = SESSAO_DIAS * 24 * 60 * 60;
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

function cookieLogout(){
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

// Lê e valida a sessão de uma requisição. Devolve { email } ou null.
function lerSessao(req){
  if(!process.env.SESSION_SECRET) return null;
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if(!token) return null;
  try{
    const dados = jwt.verify(token, process.env.SESSION_SECRET);
    return { email: dados.email, nome: dados.nome || '' };
  } catch(e){
    return null;
  }
}

// Chamada no início de toda função protegida. Se não tiver sessão válida, já
// responde 401 sozinha e devolve null pra função chamadora parar de executar.
function exigirSessao(req, res){
  const sessao = lerSessao(req);
  if(!sessao){
    res.status(401).json({ error: 'Sessão expirada ou não autenticada. Faça login de novo com seu e-mail @' + DOMINIO_PERMITIDO + '.' });
    return null;
  }
  return sessao;
}

module.exports = {
  DOMINIO_PERMITIDO,
  verificarTokenGoogle,
  criarCookieSessao,
  cookieLogout,
  lerSessao,
  exigirSessao
};
