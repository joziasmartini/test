# Mevo 🚀

Este repositório contém um **teste de código** desenvolvido para a **Mevo**, uma startup de saúde. O projeto foi construído com **NestJS** e utiliza **Prisma** como ORM.

## Rodar localmente 🖥️

1. Clone o repositório com `git clone`
2. Instale as dependências com `npm install`
3. Crie um arquivo `.env` com as variáveis de ambiente necessárias (ver `.env.example`)
4. Execute o comando `npx prisma db push` para criar as tabelas no banco de dados
5. Execute o comando `npx prisma generate` para gerar o cliente Prisma
6. Inicie o projeto com `npm run start:dev`
7. Acesse o aplicativo em [http://localhost:3000](http://localhost:3000)

## Rodar com Docker 🐳

1. Certifique-se de ter o Docker instalado e em execução
2. Crie um arquivo `.env` com as variáveis de ambiente necessárias (ver `.env.example`)
3. Execute o comando `docker build -t nestjs-app .` para construir a imagem Docker
4. Execute o comando `docker run --env-file .env -p 3000:3000 nestjs-app` para rodar o container
5. Acesse o aplicativo em [http://localhost:3000](http://localhost:3000)

## Práticas de Segurança 🔐

- **Validação de Arquivos:** O módulo de upload valida a extensão e o header do arquivo para garantir que apenas arquivos válidos sejam processados.
- **Integridade de Dados:** Utiliza **transactions** do Prisma para garantir que operações no banco de dados sejam atômicas e consistentes.
