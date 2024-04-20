const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  team: { type: String, required: true },
  erp: { type: String, required: true, unique: true },
  deviceId: { type: String, unique: true },
  college : { type: String, required: true },
  course: { type: String, required: true },
  semester: { type: String, required: true },
  mobile: { type: String, required: true },
  role: { type: String, default: 'student', enum: ['student', 'admin'] },
  attendance: [{
    day: { type: Number, required: true },
    date: { type: Date, required: true },
    punchIn: { type: Date }, // Store punch-in timestamp
    punchOut: { type: Date }, // Store punch-out timestamp
    totalWorkingHours: { type: String, default: 0 }, // Store total working hours
    presentStatus: { type: Boolean, default: false }, //
    halfDayStatus: { type: Boolean, default: false }, //
  }]
});

// Pre-save hook to calculate total working hours
userSchema.pre('save', function(next) {
  // Calculate total working hours if punchIn and punchOut timestamps are available
  if (this.punchIn && this.punchOut) {
    const workingHoursMs = this.punchOut - this.punchIn;
    this.totalWorkingHours = workingHoursMs / (1000 * 60 * 60); 
  } else {
    this.totalWorkingHours = 0; 
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
