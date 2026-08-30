import Ticket from '../models/Ticket.js';
import { emitTicketUpdate } from '../config/socket.js';

// ✅ Create Ticket – Manual ticketId generation
export const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    console.log('📝 Creating ticket for user:', req.user.id);

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title & description required' });
    }

    const count = await Ticket.countDocuments();
    const ticketId = `TKT-${String(count + 1).padStart(5, '0')}`;
    console.log(`🔢 Generated ticketId: ${ticketId}`);

    const aiSummary = `Issue: ${title.substring(0, 50)}... Customer reported: ${description.substring(0, 100)}...`;

    const ticket = new Ticket({
      ticketId,
      customer: req.user.id,
      title,
      description,
      category: category || 'General Inquiry',
      priority: priority || 'Medium',
      aiSummary,
    });

    await ticket.save();
    console.log('✅ Ticket saved with ID:', ticket.ticketId);

    const populated = await Ticket.findById(ticket._id).populate('customer', 'name email');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('❌ Create Ticket ERROR:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// ✅ Get all tickets (customer → own, admin → all)
export const getTickets = async (req, res) => {
  try {
    const query = req.user.role === 'user' ? { customer: req.user.id } : {};
    const tickets = await Ticket.find(query)
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    console.error('❌ Get Tickets Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ Get single ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('customer', 'name email');
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (req.user.role === 'user' && ticket.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    console.error('❌ Get Ticket Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ Update Ticket – with lock on resolved
export const updateTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    if (req.user.role === 'user' && ticket.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (req.user.role === 'user') {
      const { title, description, category } = req.body;
      ticket.title = title || ticket.title;
      ticket.description = description || ticket.description;
      ticket.category = category || ticket.category;
    } else {
      const { status, resolutionNote, priority, category, assignedTo, aiSummary } = req.body;

      if (ticket.isResolvedPermanently) {
        return res.status(400).json({ success: false, message: 'This ticket is permanently resolved and cannot be modified.' });
      }

      if (status === 'Resolved' && !resolutionNote && !ticket.resolutionNote) {
        return res.status(400).json({ success: false, message: 'Resolution note required for Resolved' });
      }

      if (status) ticket.status = status;
      if (resolutionNote) ticket.resolutionNote = resolutionNote;
      if (priority) ticket.priority = priority;
      if (category) ticket.category = category;
      if (assignedTo) ticket.assignedTo = assignedTo;
      if (aiSummary) ticket.aiSummary = aiSummary;

      if (status === 'Resolved' && ticket.status !== 'Resolved') {
        ticket.resolvedAt = new Date();
        ticket.isResolvedPermanently = true; // 🔒 LOCK
      }
      if (status !== 'Resolved' && ticket.status === 'Resolved') {
        ticket.resolvedAt = null;
        ticket.isResolvedPermanently = false;
      }
    }

    ticket.updatedBy = req.user.id;
    await ticket.save();
    const updated = await Ticket.findById(ticket._id).populate('customer', 'name email');

    emitTicketUpdate(ticket.customer.toString(), updated);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('❌ Update Ticket Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ Delete Ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (req.user.role === 'user' && ticket.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (req.user.role === 'user' && ticket.status !== 'New' && ticket.status !== 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot delete this ticket' });
    }
    await ticket.deleteOne();
    res.status(200).json({ success: true, message: 'Ticket deleted' });
  } catch (error) {
    console.error('❌ Delete Ticket Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ Stats with average rating
export const getTicketStats = async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const resolved = await Ticket.countDocuments({ status: 'Resolved' });
    const pending = await Ticket.countDocuments({ status: { $in: ['New', 'In Progress'] } });
    const highPriority = await Ticket.countDocuments({ priority: 'High', status: { $ne: 'Resolved' } });
    const ratedTickets = await Ticket.find({ rating: { $ne: null } });
    const averageRating = ratedTickets.length
      ? ratedTickets.reduce((acc, t) => acc + t.rating, 0) / ratedTickets.length
      : 0;
    res.status(200).json({
      success: true,
      data: { total, resolved, pending, highPriority, averageRating, totalRatings: ratedTickets.length }
    });
  } catch (error) {
    console.error('❌ Stats Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ Filter tickets by status/priority
export const getTicketsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatus = ['New','In Progress','Resolved','Cancelled'];
    const validPriority = ['High','Medium','Low'];
    let query = {};
    if (validStatus.includes(status)) query.status = status;
    else if (validPriority.includes(status)) query.priority = status;
    else if (status !== 'All') return res.status(400).json({ success: false, message: 'Invalid filter' });
    const tickets = await Ticket.find(query).populate('customer', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    console.error('❌ Filter Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ Submit Rating
export const submitRating = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (ticket.customer.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (ticket.status !== 'Resolved') return res.status(400).json({ success: false, message: 'Only resolved tickets can be rated' });
    if (ticket.rating) return res.status(400).json({ success: false, message: 'Already rated' });
    ticket.rating = rating;
    ticket.feedback = feedback || '';
    await ticket.save();
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    console.error('❌ Rating Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};