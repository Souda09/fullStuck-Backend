import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    category: { type: String, enum: ['Billing', 'Technical', 'General Inquiry', 'Account'], default: 'General Inquiry' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['New', 'In Progress', 'Resolved', 'Cancelled'], default: 'New' },
    aiSummary: { type: String, default: '', maxlength: 500 },
    resolutionNote: { type: String, default: '', maxlength: 1000 },
    resolvedAt: { type: Date, default: null },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isResolvedPermanently: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5, default: null },
    feedback: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true }
);

TicketSchema.index({ customer: 1, status: 1 });
TicketSchema.index({ priority: 1 });
TicketSchema.index({ status: 1 });

const Ticket = mongoose.model('Ticket', TicketSchema);
export default Ticket;