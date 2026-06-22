import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app =express();
app.use(express.json());
app.use(cookieParser());

// Make sure ye parsing body middlewares ke upar likha ho
app.use(cors({
  origin: 'https://india-temple.vercel.app', 
  credentials: true                
}));


import authRoutes from './routes/auth.route.js'
app.use('/api/auth', authRoutes);


export default app