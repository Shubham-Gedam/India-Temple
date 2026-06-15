import express from 'express';
import cookieParser from 'cookie-parser';
import templeRoutes from './routes/temple.route.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/temples', templeRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: "Temple Service is running" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

export default app;