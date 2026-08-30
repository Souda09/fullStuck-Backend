import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { errorHandler } from './src/middleware/errorHandler.js';   // ✅ added src/
import { initializeSocket } from './src/config/socket.js';           // ✅ added src/

// Route imports
import authRoutes from './src/routes/authRoutes.js';               // ✅ added src/
import ticketRoutes from './src/routes/ticketRoutes.js';           // ✅ added src/

dotenv.config();

const app = express();
const server = createServer(app);

const io = initializeSocket(server);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGOURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => { console.error(err); process.exit(1); });

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'OK', message: 'SupportFlow API is running' });
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to SupportFlow API', version: '1.0.0' });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.Port || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;