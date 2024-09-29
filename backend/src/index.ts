import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { jobRouter } from './routes/job';
import { cors } from 'hono/cors';
import { companyRouter } from './routes/company';

export const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Authorization', 'Content-Type'],
}));

app.route('/api/v1/user', userRouter);
app.route('/api/v1/job', jobRouter);
app.route('/api/v1/company', companyRouter);

export default app;
