import express from 'express';
import characterRoutes from './routes/characterRoutes';
import swaggerDocs from '../config/swagger';
import connectDB from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
swaggerDocs(app);
app.use('/', characterRoutes);

export default app;