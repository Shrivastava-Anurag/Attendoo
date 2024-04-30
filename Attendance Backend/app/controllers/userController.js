const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/userModel');
const Team = require('../models/teamsModel');
const Request = require('../models/requestModel');
const config = require('../../config/config');

exports.registerUser = async (req, res) => {
  const { email, password, name, erp, team, college, contact, semester, course } = req.body;

  try {
    // Check if the team already exists
    let existingTeam = await Team.findOne({ name: team });

    if (!existingTeam) {
      // If the team does not exist, create a new team
      existingTeam = await Team.create({ name: team });
    }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      deviceId: crypto.randomBytes(16).toString('hex'),
      name: name,
      erp: erp,
      team: team,
      college: college,
      mobile: contact,
      semester: semester,
      course: course,
      attendance: [] // Empty attendance list
    });

    const savedUser = await newUser.save()

    // Add the user to the team's members array
    existingTeam.members.push(savedUser._id);
    await existingTeam.save();
    
    res.status(200).json({ success: true, message: 'User registered successfully', data: savedUser });
  } catch (error) {
    console.error('Error Registering User:', error);
    res.status(500).json({ status: "error", message: 'Internal server error', data: null });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const newEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return res.status(404).json({ status: "error", message: 'User not found', data: null });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ status: "error", message: 'Invalid password', data: null });
    }

    // Check if the user already has a device ID
    if (!user.deviceId) {
      // Generate a unique device ID
      const generatedDeviceId = crypto.randomBytes(16).toString('hex');

      // Update user document with device ID
      user.deviceId = generatedDeviceId;
      await user.save(); // Save the updated user document
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '8h' });

    res.status(200).json({ status: "success", message: "Login successful", data: { token, name: user.name, email: user.email, team: user.team, erp: user.erp, role:user.role ,deviceId: user.deviceId, userId: user._id } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: "error", message: 'Internal server error', data: null });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    console.log(req.headers)
    const token = req.headers.authorization.split(' ')[1]; // Extract the token part after 'Bearer '

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Token verification succeeded, log the decoded token
    console.log('Decoded token:', decoded);

    // Token is valid
    res.status(200).json({ verified: true, decoded });
  } catch (error) {
    // Token verification failed, log the error
    console.error('Token verification failed:', error);
    // Token is invalid
    res.status(401).json({ verified: false, error: 'Invalid token' });
  }
};


exports.punchOut = async (req, res) => {
  console.log(req.user.userId)
  const userId = req.user.userId;
  const deviceId = req.headers['x-deviceid']
  const { ip, latitude, longitude } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found', data: null });
    }

    // Verify device ID
    if (user.deviceId !== deviceId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized device', data: null });
    }

    // Verify IP address
    const storedIpAddress = process.env.STORED_IP_ADDRESS;
    if (ip !== storedIpAddress) {
      return res.status(401).json({ status: 'error', message: 'Invalid IP address', data: null });
    }

    // Calculate distance from center point
    const storedLatitude = parseFloat(process.env.STORED_LATITUDE);
    const storedLongitude = parseFloat(process.env.STORED_LONGITUDE);
    const distanceFromCenter = haversineDistance(latitude, longitude, storedLatitude, storedLongitude);

    // Check if distance is within 50 meters
    if (distanceFromCenter > 2600) {
      return res.status(403).json({ status: 'error', message: 'Location outside allowed range', data: null });
    }

    // Check if user has punched in today
    const today = new Date().setHours(0, 0, 0, 0);
    const attendanceIndex = user.attendance.findIndex(entry => entry.date.setHours(0, 0, 0, 0) === today);
    if (attendanceIndex === -1 || user.attendance[attendanceIndex].punchIn === false) {
      return res.status(400).json({ status: 'error', message: 'User has not punched in today', data: null });
    }

    // Check if user already punched out today
    if (user.attendance[attendanceIndex].punchOut instanceof Date) {
      return res.status(402).json({ status: 'error', message: 'User already punched out today', data: null });
    }

    // Note punch-out time
    const punchOutTime = new Date();
    const formattedPunchOutTime = punchOutTime.toLocaleTimeString();

    // Calculate total working hours
    const punchInTime = user.attendance[attendanceIndex].punchIn;
    const workingHoursMs = punchOutTime - punchInTime;
    const hours = Math.floor(workingHoursMs / (1000 * 60 * 60));
    const minutes = Math.floor((workingHoursMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((workingHoursMs % (1000 * 60)) / 1000);
    const totalWorkingHours = `${hours}h ${minutes}m ${seconds}s`;
    user.attendance[attendanceIndex].punchOut = punchOutTime;
    user.attendance[attendanceIndex].totalWorkingHours = totalWorkingHours;
    user.attendance[attendanceIndex].status = hours > 5 ? 'present' : 'absent'; //Set the Present or Absent Status

    await user.save();

    res.status(200).json({ status: 'success', message: 'Punch-out successful', data: { punchOutTime: formattedPunchOutTime, totalWorkingHours } });

  } catch (error) {
    console.error('Punch-out error:', error);
    res.status(500).json({ status: 'error', message: 'this is Internal server error', data: null });
  }
};

exports.punchIn = async (req, res) => {
  console.log(req.user)
  const userId = req.user.userId;
  const deviceId = req.headers['x-deviceid'];
  console.log(req.body)
  const { ip, latitude, longitude } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found', data: null });
    }

    // Verify device ID
    console.log(user.deviceId)
    console.log(deviceId)

    if (user.deviceId !== deviceId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized device', data: null });
    }

    // Verify IP address
    const storedIpAddress = process.env.STORED_IP_ADDRESS;
    if (ip !== storedIpAddress) {
      return res.status(401).json({ status: 'error', message: 'Invalid IP address', data: null });
    }

    // Calculate distance from center point
    const storedLatitude = parseFloat(process.env.STORED_LATITUDE);
    const storedLongitude = parseFloat(process.env.STORED_LONGITUDE);
    const distanceFromCenter = haversineDistance(latitude, longitude, storedLatitude, storedLongitude);
    console.log(storedLongitude, storedLatitude, distanceFromCenter)

    // Check if distance is within 50 meters
    if (distanceFromCenter > 2600) {
      return res.status(403).json({ status: 'error', message: 'Location outside allowed range', data: null });
    }
    // Check if user already punched in today
    const today = new Date().setHours(0, 0, 0, 0);
    const alreadyPunchedIn = user.attendance.some(entry => entry.date.setHours(0, 0, 0, 0) === today && entry.punchIn);
    if (alreadyPunchedIn) {
      return res.status(400).json({ status: 'error', message: 'User already punched in today', data: null });
    }

    // Record punch-in time
    const punchInTime = new Date();
    const punchInDay = punchInTime.getDate();
    user.attendance.push({ date: punchInTime, punchIn: punchInTime, day: punchInDay, status: 'present' }); // Store the punchIn time as Date object
    await user.save();

    res.status(200).json({ status: 'success', message: 'Punch-in successful', data: { punchInTime: punchInTime.toLocaleTimeString() } });

  } catch (error) {
    console.error('Punch-in error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
  }
};

exports.sendRequest = async(req, res) => {
  try{
      const {name, erp, content, title, team, from, to, user } = req.body;
      console.log(user)
      const today = new Date();

      const requestData = new Request({content: content, team: team, date: today, name: name, erp: erp, title: title, from: from, to: to, user: user});
      await requestData.save()
      .then((savedData) => {
          console.log('User saved successfully:', savedData);
          
          res.status(200).json({ status: "success", message: "user saved successfully", data: savedData });
        })
        .catch((error) => {
          console.error('Error saving user:', error);
          res.status(404).json({ status: "error", message: "error saving user", data: savedData });
        });  


  }
  catch(err) {
      console.log(err)
  }
}

exports.getRequest = async(req, res) => {
  try{
      const team = req.params.team;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const teams = ['All', team] //to fetch the data of specific team and public announcement

      const requests = await Request.find({
          team: teams,
        });
        const cloneRequests = JSON.parse(JSON.stringify(requests));

        cloneRequests.forEach((request, index) => {
          const hours = requests[index].date.getHours();
          const minutes = requests[index].date.getMinutes();
          const amPM = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12; 
          request.date = requests[index].date.toLocaleDateString('en-GB');
          request.from = requests[index].from.toLocaleDateString('en-GB');
          request.to = requests[index].to.toLocaleDateString('en-GB');
          request['time'] = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${amPM}`;
        });

      res.status(200).json({ success: true, data: cloneRequests });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch announcements', error: error.message });
  }
}



const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // Distance in meters
  console.log(d)
  return d;
};