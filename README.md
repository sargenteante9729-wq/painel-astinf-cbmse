# Painel ASTINF / CBMSE

Painel inicial em React + TypeScript + Vite, preparado para versionamento no Git.

## Requisitos
- Node.js 20 ou superior
- npm

## Executar localmente

```bash
npm install
npm run dev
```

Abra o endereço local informado pelo Vite.

## Gerar versão de produção

```bash
npm run build
npm run preview
```

## Publicar em repositório Git

Crie um repositório vazio no GitHub/GitLab e execute, na pasta do projeto:

```bash
git init
git add .
git commit -m "feat: painel inicial ASTINF CBMSE"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

Substitua a URL pelo endereço real do repositório.

## Conteúdo incluído
- Logo ASTINF enviada pelo usuário.
- Brasão CBMSE enviado pelo usuário.
- Vídeo MP4 de abertura enviado pelo usuário.
- Dashboard responsivo com busca, seleção de setores, visão em cartões, lista e organograma.
- Dados de exemplo claramente centralizados em `src/lib/sectors.ts`.

## Importante
Os fragmentos fornecidos anteriormente indicavam cinco setores, dez registros de equipe e quinze atribuições, mas não continham a relação completa e verificável de setores, nomes e responsabilidades. Para não inventar dados institucionais, esta versão usa cinco setores de exemplo com descrições genéricas e equipe/atribuições não individualizadas. Substitua os dados de `src/lib/sectors.ts` pelo conteúdo oficial antes de usar operacionalmente.