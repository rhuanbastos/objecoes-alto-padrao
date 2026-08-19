# Como publicar a versão com IA (fallback por Gemini)

Esse guia é pra quem for publicar de verdade — não precisa saber programar, só seguir os passos. Leva uns 15-20 minutos.

**Importante entender antes de começar:** a conta Gemini Premium (a que você já usa pra conversar) é diferente da chave de API que essa ferramenta precisa. São produtos separados, com cobrança separada — isso é assim pra qualquer IA (o ChatGPT Plus também não dá acesso à API da OpenAI, por exemplo). A boa notícia é que criar a chave de API é gratuito e leva 2 minutos.

## Passo 1 — Criar a chave da API do Gemini

1. Acesse **aistudio.google.com/apikey** e entre com a conta Google da empresa.
2. Clique em **"Create API key"**.
3. Copie a chave gerada (uma sequência de letras e números) e guarde num lugar seguro por enquanto — você vai colar ela no Passo 4.

**Recomendação importante:** como os SDRs vão colar mensagens reais de clientes (nome, situação, às vezes detalhe financeiro), vale a pena **ativar o faturamento pago** logo de cara (em vez de deixar no plano gratuito). No plano gratuito, o Google pode usar o que é enviado pra melhorar os produtos deles; no plano pago, isso não acontece. O custo é bem baixo — cada resposta gerada custa uma fração de centavo.

## Passo 2 — Subir os arquivos pro GitHub (sem usar terminal)

1. Crie uma conta gratuita em **github.com**, se ainda não tiver.
2. Clique em **"New repository"**, dê um nome (ex: `objecoes-alto-padrao`) e marque como **privado**.
3. Dentro do repositório recém-criado, clique em **"uploading an existing file"** (ou arraste os arquivos direto pra área de upload do navegador).
4. Arraste esses 3 itens pra dentro (mantendo a estrutura de pastas):
   - `index.html`
   - a pasta inteira `api` (com o arquivo `responder.js` dentro)
   - `package.json`
5. Clique em **"Commit changes"**.

## Passo 3 — Publicar na Vercel

1. Crie uma conta gratuita em **vercel.com**, entrando com a mesma conta do GitHub (fica mais fácil).
2. Clique em **"Add New" → "Project"**.
3. Selecione o repositório que você acabou de criar (`objecoes-alto-padrao`) e clique em **"Import"**.
4. Antes de clicar em Deploy, abra **"Environment Variables"** e adicione:
   - Nome: `GEMINI_API_KEY` → Valor: cole a chave que você copiou no Passo 1.
   - (Opcional) Nome: `GEMINI_MODEL` → Valor: `gemini-2.5-flash` (ou outro modelo, se quiser trocar depois).
5. Clique em **"Deploy"**. Em menos de um minuto a Vercel te dá um link tipo `objecoes-alto-padrao.vercel.app` — esse já é o link funcionando, com IA de verdade por trás.

## Passo 4 — Conectar num domínio próprio (opcional)

Dentro do projeto na Vercel, vá em **Settings → Domains** e adicione o domínio que vocês tiverem (ex: `objecoes.suaimobiliaria.com.br`). A Vercel mostra exatamente qual registro DNS criar no seu provedor de domínio.

## Passo 5 — Testar

1. Abra o link publicado.
2. Cole uma objeção que **não está** nas 15 já cadastradas (ex: "o cliente falou que quer visitar mais 3 imóveis antes").
3. Deve aparecer "Montando uma resposta pra essa..." por 1-2 segundos, e depois a resposta pronta.
4. Se aparecer a mensagem "não consegui montar uma resposta agora", confira se a variável `GEMINI_API_KEY` foi salva certinho no Passo 3.

## Se quiser ajustar o tom da IA depois

Todo o "cérebro" que ensina a IA a responder do jeito certo está no arquivo `api/responder.js`, na constante `REGRAS_DE_TOM` (as regras de tom) e `EXEMPLOS` (os exemplos que ensinam o estilo). Edite esse arquivo direto no GitHub (lapisinho de editar em cima do arquivo), salve — a Vercel republica sozinha em menos de um minuto.

## Se quiser atualizar as 15 respostas fixas da base

Essas ficam no `index.html`, na lista `DATA`, no começo do `<script>`. Editar ali não precisa de nova chave nem nada — é só texto.
