// import dns from 'node:dns';

// // Agar project local machine par chal raha ho tabhi DNS change kare
// if (process.env.NODE_ENV !== 'production') {
//   dns.setServers(['8.8.8.8', '1.1.1.1']);
//   dns.setDefaultResultOrder('ipv4first');
// }
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { errorHandler } from './src/middleware/authMiddleware.js';
import { initializeSocket } from './src/config/socket.js';

import authRoutes from './src/routes/authRoutes.js';
import ticketRoutes from './src/routes/ticketRoutes.js';

dotenv.config();
const app = express();
const server = createServer(app);

// ✅ CORS Setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Socket.io
const io = initializeSocket(server);

// ✅ MongoDB
mongoose.connect(process.env.MONGOURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => { console.error(err); process.exit(1); });

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// ✅ Health check
app.get('/api/health', (req, res) => res.json({ success: true, status: 'OK' }));
app.get('/', (req, res) => res.json({ success: true, message: 'SupportFlow API' }));

// ✅ Error handler
app.use(errorHandler);
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

const PORT = process.env.Port || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
export default app;