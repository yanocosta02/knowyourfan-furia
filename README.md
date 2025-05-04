# Fala Comigo, Furioso! 🐾

![Logo FURIA](https://camo.githubusercontent.com/7491ac5d25188335a9c17dac1c1d39a53b8d2871a098c03c82d603b36b5c155c/68747470733a2f2f696d616765732e73717561726573706163652d63646e2e636f6d2f636f6e74656e742f76312f3537383765333534316236333162313366613462343135342f313539353934383838363339392d6132643532663437336136373763636335663130386361612f46555249412d4c4f474f2d50414e544845522d424c41434b2e706e67)

## 🚀 Visão Geral

**Fala Comigo, Furioso!** é a plataforma definitiva para o torcedor da FURIA! Crie seu perfil de fã personalizado, compartilhe seus gostos, jogos favoritos, eventos que acompanha e muito mais.

Este MVP foi construído com **React (Vite)** e **Firebase**, com foco em:

- Coleta detalhada de informações do fã.
- Experiência fluida de cadastro por etapas (wizard).
- Geração dinâmica de emblemas com base nas preferências.
- Conexões sociais integradas.

🌐 **Deploy:** [knowyourfan-furia.vercel.app](https://knowyourfan-furia.vercel.app)  
📦 **Repositório:** [github.com/yanocosta02/knowyourfan-furia](https://github.com/yanocosta02/knowyourfan-furia)

---

## ✨ Funcionalidades

### Autenticação

- Login/Cadastro com **Email e Senha**.
- Login social com **Google** e **Twitter**.
- Vinculação e desvinculação de contas sociais.

### Wizard de Criação de Perfil (5 Etapas)

1. **Informações Pessoais:**

   - Nome completo, CPF, Data de Nascimento, Endereço.
   - Upload de Documento de ID (validação simulada).
   - Avatar via URL.

2. **Steam:**

   - Nickname ou ID do perfil Steam.

3. **Interesses:**

   - Time Favorito (único).
   - Tags com sugestões para jogos favoritos e eventos assistidos.

4. **Compras:**

   - Histórico de compras em games/esports (tags).

5. **Redes Sociais:**
   - Twitter, Twitch, Instagram.
   - Conexão com Google e Twitter.

### Visualização de Perfil

- Exibição do avatar, nome, nick Steam e time favorito.
- Selo "Verificado" (simulado).
- Até 5 emblemas automáticos com base nas informações.
- Links sociais clicáveis.
- Edição facilitada do perfil.

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- CSS puro ou módulos CSS

### Backend

- [Firebase](https://firebase.google.com/)
  - **Authentication** (Email/Senha, Google, Twitter)
  - **Firestore** (banco NoSQL para perfis)

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos

- Node.js (versão LTS)
- Conta Firebase
- npm ou yarn

### Passo a Passo

```bash
# Clone o repositório
git clone https://github.com/yanocosta02/knowyourfan-furia.git
cd knowyourfan-furia

# Instale as dependências
npm install
```
