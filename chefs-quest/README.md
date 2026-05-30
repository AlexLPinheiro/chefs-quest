# Chef's Quest

Jogo educativo web sobre culinária, onde o jogador explora um mapa coletando ingredientes, responde quizzes e completa etapas de preparo arrastando itens para a panela. O projeto foi feito com Next.js, React e PostgreSQL.

## Como rodar

Pré-requisitos: Node.js 20+ e pnpm 10+.

```bash
# Na raiz do projeto (pasta chefs-quest), instalar dependências
pnpm install

# Ainda na raiz, rodar em modo de desenvolvimento
pnpm dev
```

O projeto vai abrir em `http://localhost:3000`.

## Variável de ambiente

Antes de rodar, crie o arquivo `apps/web/.env.local` (dentro da pasta do projeto web) com o seguinte conteúdo:

```
DATABASE_URL=<valor>
```

O valor dessa variável eu vou mandar no chat do Teams.
