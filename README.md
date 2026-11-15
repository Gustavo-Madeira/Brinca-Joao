# Brinca João 💙

**Um mundo de brincadeiras feito com carinho!**

O Brinca João é um site de minigames infantis acessíveis, calmos e gratuitos, para brincar no
próprio ritmo. Não tem anúncios, cadastro nem coleta de dados: tudo roda no navegador.

_Feito com amor para João Lucas 💙_

---

## O que tem no site

| Jogo | O que a criança faz |
| --- | --- |
| 🎨 **Mundo das Cores** | Toca na figura que tem a mesma cor do modelo. Cada cor tem nome e um símbolo próprio. |
| 🔷 **Encaixe as Formas** | Coloca cada forma no seu lugar, tocando ou arrastando. |
| 🧠 **Jogo da Memória** | Encontra os pares. Cartas diferentes ficam abertas até o próximo toque, sem relógio. |
| 🧩 **Quebra-Cabeça do João** | Monta seis figuras com peças de encaixe, com modelo, imagem de fundo e botão de ajuda. |
| 🐶 **Descubra os Animais** | Explora doze animais: nome, som escrito, uma curiosidade e (se quiser) a voz. |
| 🖍️ **Desenho Livre** | Desenha com doze cores, três espessuras, borracha, desfazer, limpar e baixar a imagem. |

Os jogos com desafio têm três níveis — **Fácil**, **Médio** e **Desafio**. Todos começam no Fácil
e a criança pode ficar no mesmo nível pelo tempo que quiser.

O mascote é o **Pipo**, um balãozinho azul que dá as instruções e comemora junto.

## Acessibilidade e conforto sensorial

A acessibilidade faz parte do projeto desde a primeira linha:

- **Sons desligados por padrão.** Nenhum áudio começa sozinho; som e voz só existem depois de um
  toque, e só com "Sons" ligado nas configurações.
- **Sem punição.** Não há cronômetro, tela de derrota, placar negativo nem som de erro. Errar
  mostra uma mensagem gentil e a criança tenta de novo.
- **Mouse, toque e teclado.** Nada depende de arrastar: os jogos de encaixe funcionam com dois
  toques (peça e lugar) e o arrasto é só um atalho. O desenho também funciona pelo teclado
  (setas movem o pincel, espaço abaixa ou levanta).
- **Movimento sob controle.** O site respeita o "movimento reduzido" do aparelho, tem um
  interruptor de animações e um **modo calmo** (sem enfeites, sem movimento, sons mais baixos).
  Nada pisca.
- **Não depende só de cor nem de leitura.** Cores vêm com nome e símbolo; estados (selecionado,
  certo, ligado) aparecem também em forma, posição e ícone; as instruções são curtas e podem ser
  ouvidas.
- **Áreas de toque grandes** e um ajuste de **tamanho** (Normal, Grande, Bem grande) que aumenta
  botões, letras e figuras de uma vez.
- **Leitores de tela:** HTML semântico, nomes acessíveis em todos os controles, mensagens
  anunciadas, foco visível e gerenciado (diálogos prendem o foco e o devolvem ao fechar).
- **Navegação previsível:** "Voltar" sempre à esquerda, configurações sempre à direita, e todos
  os jogos na mesma ordem: instrução → brincadeira → botões → nível.

As decisões seguem as recomendações da WCAG 2.2 nível AA sempre que aplicáveis.

## Privacidade

- Sem anúncios, sem rastreadores, sem cadastro e sem links para fora do site.
- Fontes e imagens ficam no próprio site: nenhuma requisição vai para terceiros.
- O `localStorage` guarda apenas preferências, progresso e o desenho em andamento — sempre no
  próprio aparelho. Em **Configurações → Para a família** há um botão para apagar tudo.

---

## Como rodar no computador

Você precisa do [Node.js](https://nodejs.org) 22.12 ou mais novo (o projeto foi feito com o 24).

```bash
npm install
```

```bash
npm run dev
```

O endereço local aparece no terminal (normalmente `http://localhost:5173`).

Outros comandos:

| Comando | Para que serve |
| --- | --- |
| `npm run build` | Confere os tipos e gera a versão de produção na pasta `dist` |
| `npm run preview` | Abre a versão de produção já gerada |
| `npm test` | Roda os testes automatizados uma vez |
| `npm run test:watch` | Roda os testes a cada alteração |
| `npm run lint` | Confere o código, incluindo regras de acessibilidade |
| `npm run typecheck` | Confere só os tipos do TypeScript |

## Como publicar no Netlify (pelo GitHub)

O projeto já vem pronto para o Netlify: o arquivo [`netlify.toml`](netlify.toml) define o comando
de build, a pasta publicada, a versão do Node, as rotas e os cabeçalhos de segurança. Você não
precisa preencher nada à mão. O plano gratuito é suficiente.

**1. Envie o projeto para o GitHub**

Crie um repositório vazio no GitHub (por exemplo `brinca-joao`) e, na pasta do projeto, rode:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Primeira versão do Brinca João"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/SEU-USUARIO/brinca-joao.git
```

```bash
git push -u origin main
```

**2. Conecte o repositório ao Netlify**

1. Entre em [app.netlify.com](https://app.netlify.com) com a sua conta do GitHub.
2. Escolha a opção de **adicionar um novo site importando um projeto existente** e selecione o
   GitHub (os nomes exatos dos botões mudam de tempos em tempos).
3. Autorize o Netlify a ver o repositório e escolha `brinca-joao`.
4. Na tela de configuração, o Netlify já lê o `netlify.toml`. Confira apenas se aparece:
   - comando de build: `npm run build`
   - pasta publicada: `dist`
5. Confirme a publicação. Em um ou dois minutos o site ganha um endereço `algum-nome.netlify.app`.

**3. Depois de publicar**

- **Atualizações:** todo `git push` na branch `main` publica uma versão nova sozinho.
- **Nome do site:** nas configurações do site no Netlify dá para trocar o nome do endereço ou
  ligar um domínio próprio.
- **Rotas diretas:** abrir `https://seu-site/jogos/memoria` direto funciona, porque o
  `netlify.toml` devolve o `index.html` para qualquer endereço.
- **Imagem de compartilhamento (opcional):** para a prévia aparecer no WhatsApp e em redes
  sociais, troque no [`index.html`](index.html) o valor de `og:image` pelo endereço completo, por
  exemplo `https://seu-site.netlify.app/social-card.png`.

> O site define uma política de segurança de conteúdo que só permite recursos do próprio site.
> Se um dia você incluir algo de outro endereço (uma fonte, um vídeo, um serviço), será preciso
> liberar esse endereço em `Content-Security-Policy`, no `netlify.toml`.

---

## Tecnologias

- **React 19 + TypeScript + Vite 8**, como aplicação estática (sem servidor, banco ou APIs).
- **CSS moderno** com CSS Modules e variáveis; ilustrações em **SVG** desenhadas à mão no código.
- **wouter**, um roteador bem leve, para as páginas.
- **Web Audio** para os sons (gerados na hora, sem arquivos) e **Web Speech** para a voz.
- **Vitest + Testing Library** nos testes e **oxlint** (com regras de acessibilidade) no lint.

A página inicial baixa cerca de 100 kB de JavaScript e CSS compactados, mais 70 kB de fontes. O
código de cada jogo (de 2 a 6 kB) só é baixado quando o jogo é aberto.

## Estrutura do projeto

```
├── index.html               Página única (metadados, ícones, fontes)
├── netlify.toml             Build, rotas e cabeçalhos do Netlify
├── public/                  Ícones, manifesto e cartão de compartilhamento
└── src/
    ├── main.tsx             Ponto de entrada
    ├── App.tsx              Rotas do site
    ├── assets/fonts/        Fontes Nunito e Fredoka (com as licenças)
    ├── components/
    │   ├── brand/           Pipo, logotipo e ilustração da página inicial
    │   ├── game/            Moldura comum dos jogos, seletor de nível, estrelas
    │   ├── layout/          Barra do topo, rodapé, esqueleto das páginas
    │   ├── settings/        Painel e diálogo de configurações
    │   └── ui/              Botões, diálogo, interruptor, mensagens, comemoração...
    ├── config/              Níveis, preferências padrão e frases de incentivo
    ├── context/             Preferências e progresso (salvos no navegador)
    ├── games/
    │   ├── registry.ts      Catálogo de jogos (a lista que o site inteiro lê)
    │   ├── thumbs.tsx       Ilustrações dos cartões
    │   ├── cores/           Mundo das Cores
    │   ├── formas/          Encaixe as Formas
    │   ├── memoria/         Jogo da Memória
    │   ├── quebra-cabeca/   Quebra-Cabeça do João
    │   ├── animais/         Descubra os Animais
    │   └── desenho/         Desenho Livre
    ├── hooks/               Som, nível do jogo, arrastar, foco, estado da partida...
    ├── illustrations/       Animais, frutas e brinquedos (acervo de figuras)
    ├── pages/               Início, jogos, tela de jogo, configurações, não encontrada
    ├── styles/              Cores e medidas, base, animações e fontes
    ├── test/                Preparação e utilitários dos testes
    ├── types/               Tipos compartilhados
    └── utils/               Armazenamento, sorteio, áudio, voz, geometria
```

Cada jogo fica na própria pasta, com a tela (`*Game.tsx`), o estilo (`*.module.css`), a lógica
pura (`logic.ts`), os dados e os testes.

## Como criar um jogo novo

1. Crie a pasta `src/games/<nome>/` com um componente que tenha `export default` e receba
   `GameProps`. Use o `GameShell` para ganhar a moldura comum (instrução, botões, nível).
2. Acrescente o identificador em `GameId` (`src/types/index.ts`) e em `GAME_IDS`
   (`src/context/progress-context.ts`).
3. Desenhe a ilustração do cartão em `src/games/thumbs.tsx`.
4. Adicione a ficha do jogo em `src/games/registry.ts`.

A página inicial, a lista de jogos e as rotas passam a mostrar o jogo novo sozinhas.

Para ampliar o conteúdo que já existe:

- **Figuras da memória:** desenhe em `src/illustrations/` e inclua em `catalog.ts`.
- **Animais:** desenhe em `src/illustrations/animals.tsx` e inclua em `src/games/animais/data.ts`.
- **Imagens do quebra-cabeça:** desenhe em `SceneArt.tsx` e inclua em `scenes.ts`.
- **Cores e figuras do Mundo das Cores:** `colors.ts`, `ObjectArt.tsx` e `objects.ts`.

## Testes

`npm test` roda 165 testes em 18 arquivos:

- **Lógica de cada jogo:** toda rodada de cores tem exatamente uma resposta certa, cada forma tem
  um lugar, o baralho tem pares completos, as peças vizinhas do quebra-cabeça se encaixam.
- **Partidas completas** dos seis jogos, do começo à comemoração, inclusive só pelo teclado.
- **Garantias do projeto:** sons desligados na primeira visita, nenhum áudio ao abrir uma tela,
  errar não bloqueia nem pune, cartas diferentes não fecham por tempo.
- **Configurações, diálogo, rotas** (incluindo endereço direto e endereço que não existe) e o
  botão de apagar os dados.

## Limites conhecidos

- **Sons dos animais:** são falados pela voz do próprio aparelho (nome, onomatopeia e uma frase).
  A qualidade e a existência de voz em português dependem do aparelho. Não há gravações reais.
- **Internet:** o site precisa de conexão para abrir. Ainda não funciona offline.
- **Testes em aparelhos:** a validação foi feita com testes automatizados e em um navegador de
  computador simulando celular. Vale conferir em um iPhone e em um Android de verdade antes de
  divulgar.

## Ideias para evoluir

- Gravações reais dos sons dos animais, com volume nivelado.
- Funcionar offline e poder ser instalado como aplicativo completo.
- Novos jogos: sequências, contagem, pareamento de sombras, labirintos simples.
- Mais figuras para a memória e mais imagens para o quebra-cabeça.
- Perfis locais para irmãos ou turmas, cada um com seu nível e progresso.
- Contraste alto e fonte para dislexia como opções extras.
- Um modo de turnos para brincar a dois.

## Créditos

- Ilustrações, mascote e código: feitos para este projeto.
- Fontes [Nunito](https://github.com/googlefonts/nunito) e
  [Fredoka](https://github.com/hafontia/Fredoka-One), sob a SIL Open Font License 1.1 (as licenças
  estão em `src/assets/fonts/`).
