const { exigirSessao } = require('./auth');
const { registrarUso } = require('./db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST.' });
    return;
  }

  const sessao = exigirSessao(req, res);
  if(!sessao) return;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor. Configure em Project Settings > Environment Variables na Vercel.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const objecao = body && typeof body.objecao === 'string' ? body.objecao.trim() : '';

  if (!objecao) {
    res.status(400).json({ error: 'Envie { "objecao": "texto do cliente" } no corpo da requisição.' });
    return;
  }
  if (objecao.length > 1200) {
    res.status(400).json({ error: 'Objeção muito longa. Cole só a parte relevante da mensagem do cliente.' });
    return;
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  const prompt = montarPrompt(objecao);

  try {
    const resposta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 500,
            thinkingConfig: { thinkingBudget: 0 }
          }
        })
      }
    );

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      res.status(502).json({ error: 'O Gemini recusou a requisição.', detalhe });
      return;
    }

    const dados = await resposta.json();
    const texto = (dados && dados.candidates && dados.candidates[0] && dados.candidates[0].content &&
      dados.candidates[0].content.parts || [])
      .map(p => p.text || '')
      .join('')
      .trim();

    if (!texto) {
      res.status(502).json({ error: 'O Gemini não retornou nenhum texto (pode ter sido bloqueado por segurança).' });
      return;
    }

    registrarUso(sessao.email, 'responder', objecao).catch(() => {});
    res.status(200).json({ resposta: texto });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao conectar com o Gemini.', detalhe: String(err && err.message || err) });
  }
};
