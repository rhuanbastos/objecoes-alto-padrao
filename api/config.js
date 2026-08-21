// api/config.js
// Devolve configurações públicas que o front-end precisa pra montar a tela de
// login (o Client ID do Google não é segredo, mas fica configurado na Vercel
// em vez de escrito direto no index.html, pra não precisar editar o código
// toda vez que mudar).

module.exports = async function handler(req, res){
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Use GET.' });
    return;
  }
  res.status(200).json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || null
  });
};
