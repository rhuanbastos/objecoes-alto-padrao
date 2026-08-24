// lib/objecoes-fixas.js
// As 20 objeções reais e fixas da Águia, escritas à mão com o tom de voz
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
    technique: "Explorar alternativas antes de assumir impossibilidade",
    script: "Entendo, isso pesa mesmo. Quem monta as opções de entrada, prazo e parcelamento com a construtora é nosso closer, que sabe exatamente o que dá pra ajustar em cada empreendimento.\n\nPosso já agendar uma reunião rápida com ele pra vocês verem juntos o que cabe no seu momento?",
    tone: "SDR nunca negocia condição de pagamento sozinho. Papel do SDR é agendar a reunião com o closer.",
    keywords: "pagamento entrada parcelamento condições financiamento sinal não consigo pagar assim"
  },
  {
    cat: "Concorrência e Confiança",
    quote: "Já tenho um corretor/amigo que está me atendendo.",
    behind: "Relação de confiança pré-existente. Concorrência por atenção, não por informação.",
    technique: "Reforçar sem desqualificar o outro profissional",
    script: "Que bom que você já tem alguém de confiança, isso importa numa decisão dessas. Posso só te mandar as opções que tenho por aqui, sem compromisso nenhum.\n\nÀs vezes uma segunda visão só reforça a decisão que você já vai tomar.",
    tone: "Nunca critique o outro corretor. Postura colaborativa, não de pressão.",
    keywords: "corretor amigo concorrência outro atendimento imobiliária já tenho corretor tenho um amigo"
  },
  {
    cat: "Concorrência e Confiança",
    quote: "Vou pesquisar mais opções antes de decidir.",
    behind: "Comportamento natural em compra de alto valor, não é recusa.",
    technique: "Apoiar a pesquisa e virar referência",
    script: "Faz sentido pesquisar bem, eu inclusive recomendo. Te mando um comparativo com as principais opções disponíveis hoje, prós e contras de cada uma, pra você ganhar tempo.\n\nAssim, quando for decidir, você já parte com visão completa do mercado.",
    tone: "Seja o curador de informação, não o vendedor ansioso.",
    keywords: "pesquisar outras opções mercado comparar decidir depois vou pesquisar mais estudando o mercado só de olho analisando"
  },
  {
    cat: "Concorrência e Confiança",
    quote: "Não conheço a imobiliária/corretor, quero mais garantias.",
    behind: "Falta de prova social ou histórico. Natural em quem valoriza discrição e reputação acima de tudo.",
    technique: "Prova social + transparência de processo",
    script: "Entendo, ainda mais nesse mercado onde discrição e confiança valem tudo. Te mostro nosso histórico de transações no seu perfil de imóvel e referências de outros clientes, com autorização deles.\n\nTambém topo uma call mais aprofundada antes de qualquer coisa, sem compromisso.",
    tone: "Nunca se justifique demais, apresente credencial com naturalidade.",
    keywords: "confiança garantias não conhece referências reputação não conheço vocês"
  },
  {
    cat: "Perfil do Investidor",
    quote: "Já comprei um imóvel recentemente, não preciso de outro agora.",
    behind: "Uma das objeções que a gente mais perde por desistir cedo demais. Pode ser real falta de necessidade, mas também pode ser investidor que continuaria comprando se a conversa não parasse aqui.",
    technique: "Qualificar o motivo da compra anterior antes de encerrar a conversa",
    script: "Que bom, parabéns pela conquista! Só uma curiosidade: essa compra foi mais pra morar ou você também investe no mercado imobiliário?\n\nPergunto porque muita gente que já tem o imóvel próprio continua comprando pra diversificar, com locação por temporada ou reserva de valor. Faz sentido eu te mostrar como isso funcionaria pro seu caso?",
    tone: "NUNCA aceite 'já comprei' como fim de conversa e só agradeça. Sempre qualifique o motivo (moradia x investimento) antes de encerrar: é aqui que mais se perde conversão.",
    keywords: "já comprei já tenho imóvel apartamento casa não preciso de outro comprei recentemente já adquiri um imóvel já tenho um imóvel próprio já comprei um apartamento já comprei uma casa"
  },
  {
    cat: "Perfil do Investidor",
    quote: "Nunca investi em imóveis, tenho medo de comprar na planta e não saber se vai entregar.",
    behind: "Medo do desconhecido, comum em quem nunca passou pelo processo de compra na planta, mesmo sendo investidor experiente em outros mercados (ações, renda fixa).",
    technique: "Desmistificar o processo + trazer a segurança jurídica concreta",
    script: "Faz todo sentido esse receio, é normal na primeira vez. A gente só trabalha com construtoras grandes e consolidadas, com Patrimônio de Afetação, que blinda o dinheiro do empreendimento mesmo se a construtora tiver problema em outro projeto.\n\nQuer que eu te explique o passo a passo de como funciona da assinatura até a entrega das chaves?",
    tone: "Postura de professor, não de vendedor. Quanto mais claro o processo, menor o medo.",
    keywords: "nunca investi primeira vez medo planta não entrega construtora vai entregar mesmo receio insegurança comprar na planta pela primeira vez nunca comprei na planta"
  },
  {
    cat: "Perfil do Investidor",
    quote: "Moro fora do Brasil, por que eu investiria aqui e não no meu dinheiro em dólar ou na moeda daqui?",
    behind: "Já pensa em investir onde mora (EUA, Paraguai, Argentina), não vê motivo pra trazer capital de volta pro Brasil, ou tem receio de câmbio/risco-país.",
    technique: "Diversificação de moeda e ativo real, não substituição",
    script: "Faz sentido diversificar onde você já tá, ninguém tá te pedindo pra tirar tudo de lá. A ideia é o contrário: ter um ativo real no Brasil, numa moeda diferente, protege seu patrimônio de ficar 100% exposto a um único país.\n\nE ainda é um imóvel que sua família usa quando visita e gera renda em real enquanto isso. Quer que eu te explique como funciona a compra à distância, direto daí de fora?",
    tone: "Argumento de diversificação internacional, nunca dizendo pra trocar tudo pro Brasil. Empatia com quem já mora fora.",
    keywords: "moro fora do brasil eua estados unidos paraguai argentina exterior dólar moeda estrangeira investir fora do brasil brasileiro no exterior brasileiro morando fora"
  },
  {
    cat: "Timing e Mercado",
    quote: "Por que investir em Penha, Piçarras ou Barra Velha e não em Balneário Camboriú, Itajaí ou Itapema?",
    behind: "Comparação com marcas mais conhecidas e de maior apelo de mídia, vizinhas da Tríade.",
    technique: "Mostrar que as vizinhas já saturaram e a Tríade é a nova fronteira",
    script: "Essas três já deram o salto de valorização delas e hoje tão saturadas: aporte inicial bem mais alto e pouco terreno novo pra construir. A Tríade é a nova fronteira bem do lado, mesma região, mesmo público, só que ainda no ciclo de valorização mais forte, com m² mais competitivo e praia mais preservada.\n\nÉ a oportunidade que Balneário Camboriú, Itajaí e Itapema já foram há alguns anos. Quer que eu te mande um comparativo de preço por m² entre as regiões?",
    tone: "Nunca fale mal das cidades vizinhas, só mostre o ciclo de mercado com naturalidade.",
    keywords: "balneário camboriú itajaí itapema por que não bc comparar cidades vizinhas por que aqui e não"
  },
  {
    cat: "Postura e Atendimento",
    quote: "Não sei responder uma pergunta técnica que o cliente fez.",
    behind: "Pergunta fora do escopo do SDR (jurídico muito específico, dado técnico de engenharia, número exato que só o closer/especialista tem). Arriscar um chute errado custa a confiança do cliente depois.",
    technique: "Honestidade rápida + prazo de retorno, nunca 'dar migué'",
    script: "Boa pergunta! Deixa eu confirmar esse detalhe certinho com nosso time pra não te passar informação errada, te retorno rapidinho, pode ser?\n\n(Aí você já aciona o closer/especialista por dentro e volta com a resposta certa o quanto antes.)",
    tone: "Transparência tranquila, sem parecer despreparado. Nunca invente ou arrisque um número/dado que não tem certeza: isso quebra a confiança na hora que o cliente descobrir.",
    keywords: "não sei responder não sei a resposta não sei o que responder fiquei sem resposta não sei essa pergunta técnica pergunta difícil não sei falar"
  }
];
