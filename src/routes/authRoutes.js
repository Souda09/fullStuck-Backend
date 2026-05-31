import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

export default router;