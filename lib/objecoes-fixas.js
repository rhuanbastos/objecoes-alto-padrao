// lib/objecoes-fixas.js
// As 21 objeções reais e fixas da Águia, escritas à mão com o tom de voz
// certo. Fica fora da pasta api/ de propósito: é dado estático compartilhado,
// não é uma função/endpoint (a Vercel só permite 12 funções no plano gratuito).
// Só chega no navegador de quem estiver logado (via api/objecoes.js), em vez
// de ficar visível no código-fonte da página pra qualquer pessoa, sem login.

module.exports = [
  {
    cat: "Preço e Valor",
    quote: "Achei o valor do metro quadrado muito alto.",
    behind: "Tá comparando sem um parâmetro claro, ou testando até onde dá pra negociar.",
    technique: "Investigar antes de argumentar + falar de valor, não de preço",
    script: "Entendi. Você tá comparando com algum imóvel específico ou é mais a sensação de \"tá caro\" mesmo?\n\nPergunto porque esse m² carrega coisa que não aparece na conta simples: vista, padrão do acabamento, localização exata. Te separo 2-3 comparáveis reais da região agora, aí você julga com dado na mão.",
    tone: "Curto e direto. Nunca discuta o preço em si, puxe pro valor.",
    keywords: "preço caro metro quadrado m2 valor alto tá caro achei caro"
  },
  {
    cat: "Preço e Valor",
    quote: "Vi um imóvel parecido mais barato.",
    behind: "Pode ser anúncio desatualizado (já vendido, condição antiga) ou um comparável real com diferenças que não aparecem de cara.",
    technique: "Comparação ponto a ponto",
    script: "Me manda o link? Muito anúncio por aí tá desatualizado, imóvel já vendido, condição antiga...\n\nVou comparar ponto a ponto com você: metragem, estado, localização exata. Se for igual mesmo, eu falo com toda sinceridade.",
    tone: "Curiosidade genuína, sem parecer que tá se defendendo.",
    keywords: "concorrência mais barato anúncio internet comparação parecido achei mais barato vi outro"
  },
  {
    cat: "Preço e Valor",
    quote: "O preço não tem flexibilidade para negociar?",
    behind: "Pode estar testando o limite, ou já decidiu e só quer confirmar que fez um bom negócio.",
    technique: "Ancorar em condição, não em desconto direto",
    script: "Sempre rola avaliar a condição, isso quem monta certinho é nosso closer, que tem toda a visão da negociação com a construtora.\n\nPosso já agendar uma conversa rápida com ele pra vocês verem os números certinho?",
    tone: "SDR nunca negocia preço nem promete desconto/condição sozinho. Papel do SDR é agendar a reunião com o closer.",
    keywords: "negociar desconto flexibilidade condições preço abaixar dá pra baixar tem desconto"
  },
  {
    cat: "Timing e Mercado",
    quote: "Quero esperar o mercado baixar.",
    behind: "Medo de pagar caro e ver o valor cair depois. Falta contexto de que o alto padrão costuma andar diferente do mercado geral.",
    technique: "Dado histórico + custo de oportunidade",
    script: "Entendo a lógica, só que aqui na Tríade (Penha, Piçarras e Barra Velha) costuma ser o contrário: nos últimos 15 anos, foi qual for o governo ou crise, a região nunca desvalorizou. Só entre 2020 e 2021 Piçarras e Penha subiram de 50% a 60%, e hoje o m² já tá entre R$ 11 mil e R$ 18 mil.\n\nOu seja, esperar 'baixar' geralmente significa pagar mais caro depois. Bora eu te mostrar as opções que ainda fazem sentido pro seu perfil?",
    tone: "Nunca crie urgência falsa. Traga o dado e deixa o cliente concluir sozinho.",
    keywords: "esperar mercado baixar cair preço timing retração recessão vou esperar mercado cair"
  },
  {
    cat: "Timing e Mercado",
    quote: "Vou esperar os juros caírem.",
    behind: "Preocupação genuína com o custo total do financiamento.",
    technique: "Separar o preço do imóvel do custo do crédito",
    script: "Faz sentido, juro pesa mesmo. Só que, historicamente, quando o juro cai o preço do imóvel sobe, porque todo mundo corre pra comprar junto.\n\nPosso já agendar uma conversa com nosso closer? Ele simula os dois cenários certinho com você.",
    tone: "Raciocínio financeiro, com número. Sem pressão emocional.",
    keywords: "juros financiamento esperar taxa selic cair vou esperar o juro baixar"
  },
  {
    cat: "Timing e Mercado",
    quote: "Ainda não é o momento certo para mim.",
    behind: "Pode ser timing pessoal genuíno, ou um jeito educado de não avançar sem dizer o motivo real.",
    technique: "Investigar a objeção real por trás da resposta genérica",
    script: "Sem problema, decisão grande merece tempo. Só pra eu não te encher no momento errado: é timing mesmo, outro investimento rolando, ou ficou alguma dúvida que eu resolvo agora?",
    tone: "Pergunta aberta, sem insistir. O objetivo é descobrir se é objeção real.",
    keywords: "momento certo não é hora agora depois pensar não é a hora ainda vou pensar"
  },
  {
    cat: "Terceiros e Decisão",
    quote: "Vou conversar com meu advogado primeiro.",
    behind: "Legítimo e esperado em compra de alto valor. Também pode ser um jeito educado de ganhar tempo.",
    technique: "Acolher e facilitar, nunca resistir",
    script: "Isso é o certo a se fazer, numa compra desse tamanho eu recomendo mesmo. Te mando agora a matrícula e toda a documentação, e fico à mão pro seu advogado se ele tiver alguma dúvida técnica.\n\nIsso agiliza bastante. Consigo te mandar tudo ainda hoje?",
    tone: "Postura profissional, nunca defensiva. Documentação rápida reforça confiança.",
    keywords: "advogado documentação jurídico due diligence contrato falar conversar vou falar com meu advogado"
  },
  {
    cat: "Terceiros e Decisão",
    quote: "Preciso alinhar com meu cônjuge/sócio.",
    behind: "Decisão compartilhada é comum e legítima nesse padrão de compra, raramente é desculpa.",
    technique: "Virar aliado da decisão em conjunto",
    script: "Com certeza, decisão desse tamanho é pra ser tomada junto mesmo. Te preparo um material completo: fotos, vídeo, planta, valores, pra vocês olharem com calma.\n\nSe fizer sentido, marco uma call ou visita com os dois juntos, aí eu tiro as dúvidas na hora.",
    tone: "Reforce que apoiar essa conversa é parte do seu trabalho, não um obstáculo.",
    keywords: "cônjuge esposa marido sócio conversar alinhar parceiro falar mulher vou falar com minha esposa vou falar com meu marido"
  },
  {
    cat: "Terceiros e Decisão",
    quote: "Meu family office/contador vai analisar.",
    behind: "Público de alto padrão costuma estruturar compra via holding ou consultor financeiro. É sinal de seriedade, não recusa.",
    technique: "Dar o dado no formato técnico certo",
    script: "Boa, isso mostra que o processo do seu lado tá bem estruturado, eu gosto assim. Te monto um dossiê com rentabilidade, comparativos e todos os custos (IPTU, condomínio, taxas).\n\nTem algum formato específico que eles costumam pedir?",
    tone: "Fale a língua financeira: número, projeção, estrutura.",
    keywords: "family office contador consultor financeiro holding análise assessor falar conversar vou falar com meu contador"
  },
  {
    cat: "Custos e Condições",
    quote: "O condomínio está muito caro.",
    behind: "Preocupação com o custo mensal recorrente, não só com o valor de compra.",
    technique: "Traduzir custo em benefício tangível",
    script: "Entendo, pesa no bolso todo mês mesmo. Ali dentro tá incluso segurança 24h, concierge, manutenção da área de lazer, coisa que numa casa você pagaria à parte e sairia mais caro ainda.\n\nTe mando o rateio detalhado pra você ver onde cada real vai.",
    tone: "Transparência com o rateio, sem minimizar a preocupação com o orçamento.",
    keywords: "condomínio caro taxa mensal rateio manutenção condomínio tá caro"
  },
  {
    cat: "Custos e Condições",
    quote: "Não quero pagar comissão de corretagem.",
    behind: "Pode não saber que a comissão em geral é paga pelo vendedor/incorporadora, ou está tentando negociar redução.",
    technique: "Esclarecer quem paga + reforçar o valor do serviço",
    script: "Boa notícia: na maioria dos casos quem paga é o proprietário ou a incorporadora, não você. Meu trabalho de te acompanhar até o fim não tem custo extra pro seu lado.\n\n(Se for diferente aqui) o valor cobre toda a checagem de documentação e a negociação em seu nome, coisa que sozinho tomaria muito mais tempo e risco.",
    tone: "Clareza objetiva sobre quem paga o quê, sem soar defensivo.",
    keywords: "comissão corretagem taxa honorários pagar não quero pagar comissão"
  },
  {
    cat: "Custos e Condições",
    quote: "As condições de pagamento não me atendem.",
    behind: "Pode ser fluxo de caixa, outro investimento em andamento, ou teste de flexibilidade.",
    technique:
