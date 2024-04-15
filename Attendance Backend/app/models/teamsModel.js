const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Team name
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Reference to users who are members of this team
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;