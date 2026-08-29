// // // import express from 'express';
// // // import dotenv from 'dotenv';
// // // import cors from 'cors';
// // // import connectDB from './src/config/db.js';
// // // import authRoutes from './src/routes/authRoutes.js';

// // // import dns from 'dns'

// // // dns.setServers(["8.8.8.8", "1.1.1.1"])

// // // // Environment variables (.env) load karna
// // // dotenv.config();

// // // // MongoDB Database connect karna (using MONGOURI from your .env)
// // // connectDB();

// // // const app = express();

// // // // ==========================================
// // // // 🛡️ SECURE CORS WITH CREDENTIALS SETUP
// // // // ==========================================

// // // app.use(
// // //   cors({
// // //     origin:   ['http://localhost:5173'], // React/Vite frontend URL
// // //     credentials: true,               // Allow Cookies & Authorization headers
// // //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed actions
// // //     allowedHeaders: ['Content-Type', 'Authorization'],    // Allowed Headers
// // //   })
// // // );


// // // // Body Parser Middleware (JSON parsing)
// // // app.use(express.json());

// // // // API Auth Routes mount karna (/api/auth/login, /api/auth/register, etc.)
// // // app.use('/api/auth', authRoutes);

// // // // Server baseline route (API Verification)
// // // app.get('/', (req, res) => {
// // //   res.send('🔑 Secure Authentication API is running on index.js with CORS credentials active!');
// // // });

// // // // Port configuration (Using 'Port' from your .env, with fallback 7000)
// // // const PORT = process.env.Port || 7000;

// // // app.listen(PORT, () => {
// // //   console.log(`\n ==================================================`);
// // //   console.log(` BACKEND SERVER INITIALIZED SUCCESSFULLY!`);
// // //   console.log(` RUNNING ON PORT: ${PORT}`);
// // //   console.log(` CORS ALLOWED ORIGIN: http://localhost:5173`);
// // //   console.log(` CORS CREDENTIALS STATUS: ACTIVE (TRUE)`);
// // //   console.log(` ==================================================\n`);
// // // });





// // import dotenv from 'dotenv'
// // import express from 'express';

// // import cors from 'cors';
// // import connectDB from './src/config/db.js';
// // import authRoutes from './src/routes/authRoutes.js';
// // import dns from 'dns';

// // dns.setServers(["8.8.8.8", "1.1.1.1"]);
// // dotenv.config();
// // connectDB();

// // const app = express();

// // // 1. CORS CONFIGURATION (Hamesha sabse upar)
// // const corsOptions = {
// //   // Sirf Domain likhein, path (/login) hata dein
// //   origin: [
// //     'http://localhost:5173',
// //     'https://full-stuck-frontend.vercel.app' 
// //   ],
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization'],
// // };

// // app.use(cors(corsOptions));

// // // 2. PRE-FLIGHT FIX (Ye har kism ke CORS error ko khatam kar dega)
// // const corsOptions = {
// //   // Sirf Domain likhein, path (/login) hata dein
// //   origin: [
// //     'http://localhost:5173',
// //     'https://full-stuck-frontend.vercel.app' 
// //   ],
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization'],
// // };

// // app.use(cors(corsOptions));

// // // 3. OTHER MIDDLEWARES
// // app.use(express.json());

// // // 4. ROUTES
// // app.use('/api/auth', authRoutes);

// // app.get('/', (req, res) => {
// //   res.send('Souda project is runinig !');
// // });

// // // PORT FIX: .env mein agar Port (P capital) hai toh woh use hoga warna 5000
// // const PORT = process.env.Port || process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //   console.log(`\n SERVER RUNNING ON PORT: ${PORT}`);
// // });


// import dns from 'dns';

// dns.setServers(["8.8.8.8", "1.1.1.1"]);
// import dotenv from 'dotenv';
// import express from 'express';
// import cors from 'cors';
// import connectDB from './src/config/db.js';
// import authRoutes from './src/routes/authRoutes.js';

// dotenv.config();
// connectDB();

// const app = express();

// // 1. CLEAN CORS SETUP (No duplicate declarations)
// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://full-stuck-frontend.vercel.app'
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS not allowed'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// // 2. MIDDLEWARES
// app.use(cors(corsOptions));
// app.use(express.json());

// // 3. PRE-FLIGHT FIX (Node v24 Compatible)
// // '*' crash kar raha tha, isliye hum isko manual middleware se handle karenge
// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
//   }
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }
//   next();
// });

// // 4. ROUTES
// app.use('/api/auth', authRoutes);

// app.get('/', (req, res) => {
//   res.send('Souda project is running successfully!');
// });

// const PORT = process.env.PORT || process.env.Port || 5000;

// app.listen(PORT, () => {
//   console.log(`\n ✅ SERVER IS LIVE ON PORT: ${PORT}`);
// });

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';

// Environment variables (.env) load karna
dotenv.config();

// MongoDB connect karna
connectDB();

const app = express();

// Allowed origins list (No trailing slash or path at the end!)
const allowedOrigins = [
  'http://localhost:5173',
  'https://full-stuck-frontend.vercel.app'
];

// ==========================================================
// 🛡️ DYNAMIC MANUAL CORS MIDDLEWARE (No duplicate headers)
// ==========================================================
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // OPTIONS (Pre-flight) request ko browser ke liye foran resolve karna
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// JSON parser
app.use(express.json());

// Main Auth Routes (/api/auth)
app.use('/api/auth', authRoutes);

// Baseline verification route
app.get('/', (req, res) => {
  res.send('🎉 Secure Backend API is running successfully on Vercel!');
});

// Port configuration
const PORT = process.env.PORT || process.env.Port || 5000;

app.listen(PORT, () => {
  console.log(`\n ✅ SERVER IS LIVE ON PORT: ${PORT}`);
});