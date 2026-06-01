// // import express from 'express';
// // import dotenv from 'dotenv';
// // import cors from 'cors';
// // import connectDB from './src/config/db.js';
// // import authRoutes from './src/routes/authRoutes.js';

// // import dns from 'dns'

// // dns.setServers(["8.8.8.8", "1.1.1.1"])

// // // Environment variables (.env) load karna
// // dotenv.config();

// // // MongoDB Database connect karna (using MONGOURI from your .env)
// // connectDB();

// // const app = express();

// // // ==========================================
// // // 🛡️ SECURE CORS WITH CREDENTIALS SETUP
// // // ==========================================

// // app.use(
// //   cors({
// //     origin:   ['http://localhost:5173'], // React/Vite frontend URL
// //     credentials: true,               // Allow Cookies & Authorization headers
// //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed actions
// //     allowedHeaders: ['Content-Type', 'Authorization'],    // Allowed Headers
// //   })
// // );


// // // Body Parser Middleware (JSON parsing)
// // app.use(express.json());

// // // API Auth Routes mount karna (/api/auth/login, /api/auth/register, etc.)
// // app.use('/api/auth', authRoutes);

// // // Server baseline route (API Verification)
// // app.get('/', (req, res) => {
// //   res.send('🔑 Secure Authentication API is running on index.js with CORS credentials active!');
// // });

// // // Port configuration (Using 'Port' from your .env, with fallback 7000)
// // const PORT = process.env.Port || 7000;

// // app.listen(PORT, () => {
// //   console.log(`\n ==================================================`);
// //   console.log(` BACKEND SERVER INITIALIZED SUCCESSFULLY!`);
// //   console.log(` RUNNING ON PORT: ${PORT}`);
// //   console.log(` CORS ALLOWED ORIGIN: http://localhost:5173`);
// //   console.log(` CORS CREDENTIALS STATUS: ACTIVE (TRUE)`);
// //   console.log(` ==================================================\n`);
// // });





// import dotenv from 'dotenv'
// import express from 'express';

// import cors from 'cors';
// import connectDB from './src/config/db.js';
// import authRoutes from './src/routes/authRoutes.js';
// import dns from 'dns';

// dns.setServers(["8.8.8.8", "1.1.1.1"]);
// dotenv.config();
// connectDB();

// const app = express();

// // 1. CORS CONFIGURATION (Hamesha sabse upar)
// const corsOptions = {
//   // Sirf Domain likhein, path (/login) hata dein
//   origin: [
//     'http://localhost:5173',
//     'https://full-stuck-frontend.vercel.app' 
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));

// // 2. PRE-FLIGHT FIX (Ye har kism ke CORS error ko khatam kar dega)
// const corsOptions = {
//   // Sirf Domain likhein, path (/login) hata dein
//   origin: [
//     'http://localhost:5173',
//     'https://full-stuck-frontend.vercel.app' 
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));

// // 3. OTHER MIDDLEWARES
// app.use(express.json());

// // 4. ROUTES
// app.use('/api/auth', authRoutes);

// app.get('/', (req, res) => {
//   res.send('Souda project is runinig !');
// });

// // PORT FIX: .env mein agar Port (P capital) hai toh woh use hoga warna 5000
// const PORT = process.env.Port || process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`\n SERVER RUNNING ON PORT: ${PORT}`);
// });

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();
connectDB();

const app = express();

/// ✅ 1. CLEAN CORS CONFIGURATION
const allowedOrigins = [ 
  'https://full-stuck-frontend.vercel.app',
  'http://localhost:5173' 
];

app.use(cors({
  origin: allowedOrigins, // Seedha array dein
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ 2. PRE-FLIGHT (OPTIONS) HANDLER - Ye sabse zaroori hai
// Har route se pehle ye check karega
app.options('*', cors()); 

app.use(express.json());
// ... baaki routes niche

// ✅ 3. ROUTES
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Souda project is running successfully!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n SERVER RUNNING ON PORT: ${PORT}`);
});