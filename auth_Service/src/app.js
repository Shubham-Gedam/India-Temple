import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app =express();
app.use(express.json());
app.use(cookieParser());

// Make sure ye parsing body middlewares ke upar likha ho
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true                
}));


import authRoutes from './routes/auth.route.js'
app.use('/api/auth', authRoutes);


export default app