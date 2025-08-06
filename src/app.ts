import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import quotationRoutes from './routes/quotationRoutes';
import invoiceRoutes from './routes/invoiceRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/quotations', quotationRoutes);
app.use('/api/invoices', invoiceRoutes);

export default app;