# CreatorHub

CreatorHub é uma plataforma de conteúdo por assinatura que conecta criadores e assinantes. Criadores podem monetizar seu conteúdo enquanto assinantes têm acesso a conteúdo exclusivo.

## 🚀 Tecnologias

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- JWT para autenticação
- Multer para upload de arquivos
- Stripe para pagamentos
- Socket.io para chat em tempo real

### Frontend
- Next.js
- TypeScript
- TailwindCSS
- Context API para gerenciamento de estado
- Axios para requisições HTTP
- React Icons

## 📋 Pré-requisitos

- Node.js 18+
- MongoDB
- Conta Stripe (para processamento de pagamentos)
- Variáveis de ambiente configuradas

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/creatorhub.git
cd creatorhub
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Instale as dependências do frontend:
```bash
cd ../frontend
npm install
```

4. Configure as variáveis de ambiente conforme os exemplos em:
- backend/.env.example
- frontend/.env.example

5. Inicie o servidor de desenvolvimento:

Backend:
```bash
npm run dev
```

Frontend:
```bash
npm run dev
```

## 🌟 Funcionalidades

### Criadores
- Upload de conteúdo (imagens, vídeos, áudio)
- Definição de preço de assinatura
- Dashboard com métricas
- Chat com assinantes
- Relatórios financeiros

### Assinantes
- Descoberta de criadores
- Assinatura de conteúdo
- Salvamento de conteúdo favorito
- Chat com criadores
- Histórico de visualiz 