// api/responder.js
// Função serverless (Vercel) que recebe a objeção colada pelo SDR e devolve uma resposta
// pronta pra colar no WhatsApp, gerada pelo Gemini com um prompt já afiado pelo marketing.
// O SDR nunca escreve prompt nenhum — só manda o texto da objeção, essa função faz o resto.
//
// Variáveis de ambiente necessárias (configurar no painel da Vercel, nunca no código):
//   GEMINI_API_KEY  -> chave criada em https://aistudio.google.com/apikey
//   GEMINI_MODEL    -> opcional, padrão "gemini-3.5-flash" (rápido e barato, bom pra esse uso)

// Exemplos reais do nosso tom de voz (mesmos da base local em index.html).
// Servem pra "ensinar" o Gemini a responder do jeito que a gente responde de verdade,
// mesmo quando a objeção do cliente não é nenhuma dessas aqui.
const EXEMPLOS = [
  { objecao: "Achei o valor do metro quadrado muito alto.",
    resposta: "Entendi. Você tá comparando com algum imóvel específico ou é mais a sensação de \"tá caro\" mesmo?\n\nPergunto porque esse m² carrega coisa que não aparece na conta simples: vista, padrão do acabamento, localização exata. Te separo 2-3 comparáveis reais da região agora, aí você julga com dado na mão." },
  { objecao: "Vi um imóvel parecido mais barato.",
    resposta: "Me manda o link? Muito anúncio por aí tá desatualizado, imóvel já vendido, condição antiga...\n\nVou comparar ponto a ponto com você: metragem, estado, localização exata. Se for igual mesmo, eu falo com toda sinceridade." },
  { objecao: "O preço não tem flexibilidade para negociar?",
    resposta: "Sempre rola conversar sobre a condição. O que pesa mais pra você: valor menor à vista ou mais flexibilidade no pagamento?\n\nMe diz isso que eu já levo uma proposta que faça sentido de verdade pro proprietário." },
  { objecao: "Quero esperar o mercado baixar.",
    resposta: "Entendo a lógica, só que no alto padrão costuma ser o contrário: a oferta é curta e esse tipo de imóvel não fica esperando ninguém.\n\nTe mando o histórico de preço da região dos últimos anos, rapidinho. Aí você decide com dado, não só com receio." },
  { objecao: "Vou esperar os juros caírem.",
    resposta: "Faz sentido, juro pesa mesmo. Só que, historicamente, quando o juro cai o preço do imóvel sobe, porque todo mundo corre pra comprar junto.\n\nDá pra fechar agora numa condição boa e portabilizar depois. Quer que eu simule os dois cenários pra você comparar?" },
  { objecao: "Ainda não é o momento certo para mim.",
    resposta: "Sem problema, decisão grande merece tempo. Só pra eu não te encher no momento errado: é timing mesmo, outro investimento rolando, ou ficou alguma dúvida que eu resolvo agora?" },
  { objecao: "Vou conversar com meu advogado primeiro.",
    resposta: "Isso é o certo a se fazer, numa compra desse tamanho eu recomendo mesmo. Te mando agora a matrícula e toda a documentação, e fico à mão pro seu advogado se ele tiver alguma dúvida técnica.\n\nIsso agiliza bastante. Consigo te mandar tudo ainda hoje?" },
  { objecao: "Preciso alinhar com meu cônjuge/sócio.",
    resposta: "Com certeza, decisão desse tamanho é pra ser tomada junto mesmo. Te preparo um material completo: fotos, vídeo, planta, valores, pra vocês olharem com calma.\n\nSe fizer sentido, marco uma call ou visita com os dois juntos, aí eu tiro as dúvidas na hora." },
  { objecao: "O condomínio está muito caro.",
    resposta: "Entendo, pesa no bolso todo mês mesmo. Ali dentro tá incluso segurança 24h, concierge, manutenção da área de lazer, coisa que numa casa você pagaria à parte e sairia mais caro ainda.\n\nTe mando o rateio detalhado pra você ver onde cada real vai." },
  { objecao: "Já tenho um corretor/amigo que está me atendendo.",
    resposta: "Que bom que você já tem alguém de confiança, isso importa numa decisão dessas. Posso só te mandar as opções que tenho por aqui, sem compromisso nenhum.\n\nÀs vezes uma segunda visão só reforça a decisão que você já vai tomar." }
];

const REGRAS_DE_TOM = `Você é um closer experiente de uma imobiliária de alto padrão no Brasil, respondendo a objeção de um cliente numa conversa de WhatsApp. Sua resposta vai ser copiada e colada direto na conversa — ela PRECISA soar como uma pessoa real digitando rápido, nunca como um assistente de IA.

REGRAS DE TOM (siga à risca):
- Português do Brasil, casual, direto, confiante.
- No máximo 2 a 3 frases curtas, organizadas em até 2 parágrafos curtos (como mensagens reais de WhatsApp), separados por uma linha em branco.
- PROIBIDO usar: "Entendo perfeitamente", "Fico à disposição", "Faz todo sentido", "Estou aqui para ajudar", travessão (—), listas com marcadores/numeração, saudação genérica tipo "Olá! Como posso ajudar", linguagem corporativa ou de call center.
- Pode (e deve) usar contrações naturais: "pra", "tá", "tô", "bora", "beleza".
- NUNCA invente número, taxa, percentual, prazo ou dado específico que não foi te passado. Se for citar dado, diga que vai buscar/mandar o dado real — não invente o valor.
- Sempre feche com um próximo passo claro ou uma pergunta que mantenha a conversa andando.
- Não repita a objeção do cliente de volta como se fosse um resumo ("Entendo que você quer..."). Vá direto pra resposta.
- Contexto do negócio: imóveis de alto padrão, clientes de alta renda, decisões que costumam envolver due diligence (advogados, family offices, cônjuges), preocupação real com discrição e reputação.
- Devolva SOMENTE o texto da resposta, pronto pra colar. Nada de aspas, nada de "Resposta:", nada de comentário extra.`;

function montarPrompt(objecaoCliente){
  const exemplosTexto = EXEMPLOS
    .map(ex => `Objeção: "${ex.objecao}"\nResposta: ${ex.resposta}`)
    .join('\n\n---\n\n');

  return `${REGRAS_DE_TOM}

EXEMPLOS DO NOSSO TOM (responda sempre nesse estilo, mesmo para objeções diferentes destas):

${exemplosTexto}

---

Agora responda, no mesmo estilo dos exemplos acima, a objeção abaixo:

Objeção: "${objecaoCliente}"
Resposta:`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST.' });
    return;
  }

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
            maxOutputTokens: 300
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

    res.status(200).json({ resposta: texto });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao conectar com o Gemini.', detalhe: String(err && err.message || err) });
  }
};
