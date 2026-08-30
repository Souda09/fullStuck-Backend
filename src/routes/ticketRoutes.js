import express from 'express';
import {
  createTicket, getTickets, getTicketById, updateTicket, deleteTicket,
  getTicketStats, getTicketsByStatus, submitRating
} from '../controllers/ticketController.js';
import { protect, admin } from '../middleware/authMiddleware.js';   // ← changed from auth.js

const router = express.Router();
router.use(protect);
router.route('/').get(getTickets).post(createTicket);
router.route('/:id').get(getTicketById).put(updateTicket).delete(deleteTicket);
router.get('/stats', admin, getTicketStats);
router.get('/filter/:status', admin, getTicketsByStatus);
router.post('/:id/rating', protect, submitRating);
export default router;