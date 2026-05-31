import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Note the .js extension!

// 🔑 Route Protection Middleware (Logged in checks)
export const protect = async (req, res, next) => {
  let token;

  // Header check karein ke Bearer token hai ya nahi
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Header se Token alag karein (Bearer [token])
      token = req.headers.authorization.split(' ')[1];

      // Token verify karein process.env.JWT_SECRET ke sath
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Decoded ID se User fetch karein database se (password ke baghair)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Agle control handler/controller par bhej dein
    } catch (error) {
      console.error('❌ Token Verification Failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// 🛡️ Admin Verification Middleware (Role check)
export const admin = (req, res, next) => {
  // Check karein ke user exists karta hai aur uska role 'admin' hai
  if (req.user && req.user.role === 'admin') {
    next(); // Agar admin hai to access de dein
  } else {
    // Agar normal user hai to block kar dein
    res.status(403).json({ message: 'Not authorized as an admin, access denied' });
  }
};