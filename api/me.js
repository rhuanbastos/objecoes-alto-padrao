// api/me.js
// Devolve quem está logado agora (lendo o cookie de sessão), ou 401 se
// ninguém estiver logado. O index.html chama isso ao carregar a página pra
// decidir se mostra a ferramenta ou a tela de login.

const { lerSessao } = require('../lib/auth');

module.exports = async function handler(req, res){
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Use GET.' });
    return;
  }
  const sessao = lerSessao(req);
  if(!sessao){
    res.status(401).json({ error: 'Não autenticado.' });
    return;
  }
  res.status(200).json({ email: sessao.email, nome: sessao.nome || '' });
};
