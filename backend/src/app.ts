import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import creatorRoutes from './routes/creator';
import paymentRoutes from './routes/payment';
import subscriberRoutes from './routes/subscriber';
import adminRoutes from './routes/admin.routes';
// ... outros imports

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Antes de registrar as rotas
console.log('Registrando rotas...');

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/subscriber', subscriberRoutes);
app.use('/api/admin', adminRoutes);
console.log('Rotas admin registradas');

// Após registrar todas as rotas
console.log('Todas as rotas registradas');

// Tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Rota 404
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

export default app; 