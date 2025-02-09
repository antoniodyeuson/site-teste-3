import express from 'express';
import cors from 'cors';
import creatorRoutes from './routes/creator';
import contentRoutes from './routes/content';
import authRoutes from './routes/auth';
import paymentRoutes from './routes/payment';
import subscriberRoutes from './routes/subscriber';
import adminRoutes from './routes/admin';
// ... outros imports

const app = express();

// Middlewares
app.use(cors()); // Simplificando o CORS para desenvolvimento
app.use(express.json());

// Log de requisições em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    next();
  });
}

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscriber', subscriberRoutes);
app.use('/api/admin', adminRoutes);

// Tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Rota 404
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

export default app; 