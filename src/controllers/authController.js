import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Note the .js extension!

// JWT Token Helper Function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Cookie options (Standard secure settings)
const getCookieOptions = () => {
  return {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days expiry
    httpOnly: true, // Secure against XSS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
};

// ==========================================
// 1. REGISTER USER
// ==========================================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    if (user) {
      const token = generateToken(user._id);
      
      // Cookie set karna
      res.cookie('token', token, getCookieOptions()).status(201).json({
        message: 'Registration successful!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 2. LOGIN USER
// ==========================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // Inspect Console print (Kaun login hua hai)
    console.log('\n--- 🔑 USER LOGIN SUCCESSFUL ---');
    console.log(`👤 Name: ${user.name}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🛡️ Role: ${user.role.toUpperCase()}`);
    console.log('--------------------------------\n');

    // Cookie set karna
    res.cookie('token', token, getCookieOptions()).status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 3. LOGOUT SESSION
// ==========================================
export const logoutUser = async (req, res) => {
  console.log(`\n🚪 User logged out session successfully.\n`);
  
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }).status(200).json({ message: 'Logged out successfully' });
};