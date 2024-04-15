const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, default: 'New Announcement' },
  content: { type: String, required: true },
  team: { type: String, required: true },
  date: { type: Date, required: true,}
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
