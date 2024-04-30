const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  erp :{ type: String, required: true },
  title: { type: String, required: true, default: 'New Request' },
  content: { type: String, required: true },
  comment: { type: String},
  team: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  date: { type: Date, required: true,}
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
