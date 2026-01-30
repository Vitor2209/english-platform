🇬🇧 Inglês das Ruas — Quiz Platform
Plataforma de quiz interativo para aprendizado de inglês prático (“street English”), desenvolvida com HTML, CSS, JavaScript puro no frontend e Node.js no backend, consumindo uma API simples de perguntas.

O projeto foi pensado para ser simples, didático e evolutivo, servindo tanto como produto real quanto como portfólio.

📸 Preview
Interface de quiz com identidade visual do Inglês das Ruas, fundo temático e perguntas de múltipla escolha.

🧱 Tecnologias Utilizadas
Frontend
HTML5
CSS3 (responsivo)
JavaScript Vanilla
Fetch API
Backend
Node.js (HTTP nativo)
JSON como base de dados inicial
API REST simples
📂 Estrutura do Projeto
english-platform/ │ ├── backend/ │ ├── package.json │ ├── server.js │ └── questions.json │ ├── frontend/ │ ├── index.html │ ├── style.css │ ├── script.js │ └── images/ │ ├── logo.png │ └── london.png │ └── README.md

🚀 Como Rodar o Projeto Localmente
1️⃣ Backend
cd backend
npm install
npm start
O backend irá rodar em:

http://localhost:3000
Endpoint principal:

GET /quiz
2️⃣ Frontend
Abra o arquivo abaixo usando Live Server (recomendado):

frontend/index.html
⚠️ Evite abrir o HTML diretamente pelo navegador, pois isso pode causar problemas com fetch e CORS.

🧠 Como Funcionam as Perguntas
As perguntas ficam no arquivo:

backend/questions.json
Formato de cada pergunta:

{
  "question": "Choose the correct sentence:",
  "options": [
    "If I will see him, I tell you",
    "If I saw him, I tell you",
    "If I see him, I will tell you",
    "If I seen him, I will tell you"
  ],
  "answer": "If I see him, I will tell you"
}
📌 Importante:
O valor de "answer" deve ser exatamente igual a uma das opções.

🌍 Deploy (Hospedagem)
Recomendado:
Frontend: Vercel

Backend: Render

Após o deploy, basta atualizar a URL da API no script.js.

🛠️ Possíveis Evoluções Futuras
O projeto já foi pensado para crescer. Algumas ideias:

🔹 Níveis de Inglês
A1, A2, B1, B2, C1, C2

{
  "level": "B1",
  "question": "...",
  ...
}
🔹 Filtro por Tema
Grammar

Vocabulary

Street Expressions

Listening (futuro)

🔹 Sistema de Pontuação
Acertos / erros

XP

Progresso do usuário

🔹 Ranking
Ranking local

Ranking global

Ranking por nível

🔹 Usuários
Login / cadastro

Histórico de respostas

Progresso salvo

🔹 Banco de Dados
Migrar de JSON para:

MongoDB

PostgreSQL

Firebase

🔹 Frameworks (futuro)
React / Next.js no frontend

Express.js no backend

🎯 Objetivo do Projeto
Criar uma plataforma simples, prática e acessível para quem quer aprender inglês real, usado no dia a dia, com foco em:

Clareza

Usabilidade

Evolução contínua

🤝 Contribuição
Sinta-se à vontade para:

Sugerir melhorias

Criar novas perguntas

Refatorar código

Evoluir o projeto

📌 Autor
Projeto desenvolvido por Vitor Dutra Melo
Inspirado no método Inglês das Ruas 🇬🇧

✅ Status do Projeto
🟢 Funcional
🟡 Em evolução
🔵 Pronto para escalar

---
