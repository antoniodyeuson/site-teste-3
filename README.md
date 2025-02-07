# CreatorHub

CreatorHub é uma plataforma de conteúdo por assinatura que conecta criadores e assinantes. Criadores podem monetizar seu conteúdo enquanto assinantes têm acesso a conteúdo exclusivo.

## 🚀 Tecnologias

### Backend
- Node.js com Express
- TypeScript
- MongoDB com Mongoose
- JWT para autenticação
- Bcrypt para criptografia
- Cors para segurança
- Express Validator

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- Context API para gerenciamento de estado
- Axios para requisições HTTP
- React Icons
- HeadlessUI para componentes acessíveis
- Dark mode com next-themes

## 🛠️ Instalação

### Pré-requisitos
- Node.js >= 18
- MongoDB
- Variáveis de ambiente configuradas

### Backend
```bash
# Instalar dependências
cd backend
npm install

# Configurar ambiente
cp .env.example .env

# Iniciar em desenvolvimento
npm run dev
```

### Frontend
```bash
# Instalar dependências
cd frontend
npm install

# Configurar ambiente
cp .env.example .env.local

# Iniciar em desenvolvimento
npm run dev
```

## 🌟 Funcionalidades

### Criadores
- Upload de conteúdo
- Definição de preço de assinatura
- Dashboard com métricas
- Personalização de perfil

### Assinantes
- Descoberta de criadores
- Assinatura de conteúdo
- Salvamento de conteúdo favorito
- Histórico de visualizações
- Dark/Light mode

### Admin
- Gestão de usuários
- Moderação de conteúdo
- Relatórios básicos

## 🔒 Segurança
- JWT para autenticação de API
- Proteção de rotas por papel (admin/creator/subscriber)
- Validação de dados
- HTTPS em produção
- Headers de segurança básicos

## 💅 UI/UX
- Design responsivo
- Tema escuro/claro
- Loading states
- Feedback de erro
- Componentes acessíveis

## 📦 Estrutura do Projeto

```
├── backend/
│   ├── src/
│   │   ├── middleware/  # Middlewares
│   │   ├── models/      # Modelos
│   │   ├── routes/      # Rotas
│   │   └── types/       # Tipos
│   └── ...
└── frontend/
    ├── src/
    │   ├── components/  # Componentes
    │   ├── contexts/    # Contextos
    │   ├── pages/       # Páginas
    │   ├── services/    # Serviços
    │   └── styles/      # Estilos
    └── ...
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

Seu Nome - [@seutwitter](https://twitter.com/seutwitter) - email@exemplo.com

Link do Projeto: [https://github.com/seu-usuario/creatorhub](https://github.com/seu-usuario/creatorhub) 