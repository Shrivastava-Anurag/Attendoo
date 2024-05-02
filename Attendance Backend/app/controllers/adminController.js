const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserDetails = require('../models/userDetails');
const Announcement = require('../models/announcementModel');
const Team = require('../models/teamsModel');
const Admin = require('../models/adminModel')
const Request = require('../models/requestModel');
const ExcelJS = require('exceljs');
const fs = require('fs');
const moment = require('moment');
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

exports.createUser = async (req, res) => {
    try {
        const { email, password, name, erp, teamId, teamName, contactDetails, year, semester, branch } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with hashed password
        const user = new User({ email, password: hashedPassword });
        await user.save();

        // Create user details and associate them with the user's ID
        const userDetails = new UserDetails({
            userId: user._id, // Associate with the newly created user's ID
            name,
            erp,
            teamId,
            teamName,
            contactDetails,
            year,
            semester,
            branch
        });
        await userDetails.save();

        res.status(201).json({ status: 'success', message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


exports.getAllUsers = async (req, res) => {
  try {
    const { team, month, year } = req.params;
    
    // Get the current month and year
    const targetMonth = parseInt(month, 10);
    const targetYear = parseInt(year, 10);

  // const currentDate = new Date();
  // const currentMonth = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
  // const currentYear = currentDate.getFullYear();

    // Construct the query based on team name and present/absent status
    const query = {
      team: (team === 'all') ? {$exists: true} : team,
    };
    // Fetch users based on the constructed query
    const users = await User.aggregate([
      { $match: query }, // Match users based on the constructed query
      {
        $project: {
          _id: 1,
          email: 1,
          password: 1,
          name: 1,
          team: 1,
          erp: 1,
          deviceId: 1,
          college : 1,
          course: 1,
          semester: 1,
          mobile: 1,
          role: 1,
          // Add other fields you want to include
          attendance: {
            $filter: {
              input: '$attendance',
              as: 'att',
              cond: {
                $and: [
                  { $eq: [{ $year: '$$att.date' }, targetYear] }, // Match year equal to current year
                  { $eq: [{ $month: '$$att.date' }, targetMonth] } // Match month equal to current month
                ]
              }
            }
          }
        }
      }
    ]);
    
    res.status(200).json({ success: true, data: users });
} catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
}
};

exports.getUsersByTeam = async (req, res) => {
  try {
    const { team, month, year } = req.params;
    
    // Get the current month and year
    const targetMonth = parseInt(month, 10);
    const targetYear = parseInt(year, 10);
      const presentStatus = req.query.present === 'present' ? true : false ;// 'present' or 'absent'
      
      // // Get today's date in the format 'YYYY-MM-DD'
      const currentDate = new Date();
      // const currentMonth = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
      // const currentYear = currentDate.getFullYear();
      const Day = currentDate.getDay();
      // const Day = 25;
      
      // Construct the query based on team name and present/absent status
      let query;

      if(!presentStatus) {
        query = {
          team: (team === 'all') ? { $exists: true } : team,
          $or: [
            // Include users with an empty attendance array
            { attendance: [] },
            // Include users whose attendance array does not match the specified date and presentStatus
            {
              $and: [
                { attendance: { $exists: true } }, // Ensure attendance array exists
                {
                  attendance: {
                    $not: {
                      $elemMatch: {
                        day: Day,
                        status: { $in: ['present', 'half-day'] },

                      }
                    }
                  }
                }
              ]
            }
          ]
        };
        
      }
      else {
      query = {
        team : (team === 'all') ? {$exists: true} : team,
        $or: [
          (presentStatus === false) ? { attendance: [] } : {attendance: {
            $exists: false // Used this to stop using this conditional query from executing. IDK it's main purpose but change only if you know what youre doing
              }}, 
              // {
              //   attendance: []
              // },
                { 
                    attendance: { 
                        $elemMatch: {
                            day: Day,
                            status: 'present',
                        } 
                    } 
                },
                { 
                  attendance: { 
                      $elemMatch: {
                          day: Day,
                          status: 'half-day',
                      } 
                  } 
              }
            ]
    };
      }


      // Fetch users based on the constructed query
      const users = await User.aggregate([
        { $match: query }, // Match users based on the constructed query
        {
          $project: {
            _id: 1,
            email: 1,
            password: 1,
            name: 1,
            team: 1,
            erp: 1,
            deviceId: 1,
            college : 1,
            course: 1,
            semester: 1,
            mobile: 1,
            role: 1,
            // Add other fields you want to include
            attendance: {
              $filter: {
                input: '$attendance',
                as: 'att',
                cond: {
                  $and: [
                    { $eq: [{ $year: '$$att.date' }, targetYear] }, // Match year equal to current year
                    { $eq: [{ $month: '$$att.date' }, targetMonth] } // Match month equal to current month
                  ]
                }
              }
            }
          }
        }
      ]);
      console.log(users)  
      
      res.status(200).json({ success: true, data: users });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

// Controller function to retrieve details of a specific user by ID
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user details', error: error.message });
    }
};

// Controller function to update user information
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userData = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
    }
};

// Controller function to delete a user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId)
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
    }
};

exports.getUserAttendanceCurrentDay = async (req, res) => {
    try {
        // Get current date
        const currentDate = moment().startOf('day');

        // Find users with attendance for the current day
        const users = await User.find({
            'attendance.date': { $eq: currentDate.toDate() }
        }).select('teamId teamName name erp attendance');

        // Format response data
        const formattedData = users.map(user => ({
            teamId: user.teamId,
            teamName: user.teamName,
            name: user.name,
            erp: user.erp,
            attendance: user.attendance.length > 0 ? 'Present' : 'Absent'
        }));

        res.status(200).json({ status: 'success', data: formattedData });
    } catch (error) {
        console.error('Error fetching user attendance:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

exports.sendAnnouncement = async(req, res) => {
    try{
        const {message, team} = req.body;
        const today = new Date();

        const announcementData = new Announcement({content: message, team: team, date: today});
        await announcementData.save()
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



exports.getAnnouncements = async(req, res) => {
    try{
        const team = req.params.team;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const teams = ['All', team] //to fetch the data of specific team and public announcement

        const announcements = await Announcement.find({
            team: teams,
            date: {
              $gte: today, // Match announcements with a date greater than or equal to today
              $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Match announcements before tomorrow
            }
          });
          const cloneAnnouncements = JSON.parse(JSON.stringify(announcements));

          cloneAnnouncements.forEach((announcement, index) => {
            const hours = announcements[index].date.getHours();
            const minutes = announcements[index].date.getMinutes();
              announcement.date = `${hours} : ${minutes}`;
          });
        res.status(200).json({ success: true, data: cloneAnnouncements });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch announcements', error: error.message });
    }
}


exports.updateRequest = async (req, res) => {
  try {
    const requestData = req.body
    const requestId = req.params.requestId;
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    // Extract the user ID from the request data
    const userId = request.user;
    const day = request.date.getDate();
    const status = requestData.status;
    if (status === 'approved' && request.title === 'half-day') {
      await approveHalfDay( day, userId, accountSid, authToken, client);
    }
    if (status === 'approved' && request.title === 'leave') {
      await approveLeave( request.from, request.to, userId, accountSid, authToken, client);
    }

      const updatedRequest = await Request.findByIdAndUpdate(requestId, requestData, { new: true });
      if (!updatedRequest) {
          return res.status(404).json({ success: false, message: 'Request not found' });
      }
      res.status(200).json({ success: true, message: 'Request updated successfully', data: updatedRequest });
  } catch (error) {
      console.error('Error updating Request:', error);
      res.status(500).json({ success: false, message: 'Failed to update Request', error: error.message });
  }
};


exports.getAllRequests = async (req, res) => {
  try{
      const requests = await Request.find();
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
};

async function markUsersAbsent() {
  try {
    // Update documents where attendance array exists and presentStatus is true
    const result = await User.find({ 'attendance.presentStatus': true })

    console.log(`${result.nModified} users marked as absent.`);
  } catch (error) {
    console.error('Error marking users absent:', error);
  }
}


exports.getAllTeams = async (req, res) => {
    try {
      // Fetch all teams
      const teams = await Team.find({}, 'name');
      console.log(teams);
  
      // Extract team names from the result
      const teamNames = teams.map(team => team.name);
  
      res.status(200).json({ success: true, data: teamNames });
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch teams', error: error.message });
    }
  };

  exports.registerAdmin = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
      const newAdmin = new Admin({
        email: email,
        password: hashedPassword,
        name: name,
      });
  
      const savedAdmin = await newAdmin.save()

      res.status(200).json({ success: true, message: 'Admin registered successfully', data: savedAdmin });
    } catch (error) {
      console.error('Error Registering Admin:', error);
      res.status(500).json({ status: "error", message: 'Internal server error', data: null });
    }
  };

  exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const newEmail = email.trim().toLowerCase();
      const admin = await Admin.findOne({ email: newEmail });
      if (!admin) {
        return res.status(404).json({ status: "error", message: 'User not found', data: null });
      }
  
      // Check if the password matches
      const passwordMatch = await bcrypt.compare(password, admin.password)
      if (!passwordMatch) {
        return res.status(401).json({ status: "error", message: 'Invalid password', data: null });
      }
  
  
      // Generate JWT token
      const token = jwt.sign({ adminId: admin._id }, process.env.SECRET_KEY, { expiresIn: '8h' });
  
      res.status(200).json({ status: "success", message: "Login successful", data: { token, name: admin.name, email: admin.email, role:admin.role} });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ status: "error", message: 'Internal server error', data: null });
    }
  };

  exports.downloadAttendance = async (req, res) => {
    try {
      // Fetch user data with attendance from MongoDB
      const users = await User.find().populate('attendance');
  
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Attendance');
  
      // Add headers to the worksheet
      const columns = [
        { header: 'Name', key: 'name', width: 20 },
        {header: 'Team', key: 'team', width: 20},
        {header: 'ERP Id', key: 'erp', width: 20},
        {header: 'Branch', key: 'branch', width: 20},
        {header: 'Contact', key: 'contact', width: 20},
      ];

      for(i=1; i<=31; i++){
        columns.push({
            header: `${i}`, key: `${i}`, width: 20
        })
      }

      worksheet.columns = columns;

      // Add attendance data to the worksheet
      users.forEach(user => {
        const row = {
          name: user.name,
          team: user.team,
          erp: user.erp,
          branch: user.course,
          contact: user.mobile,
        };
        let flag = 0;

        if (user.attendance.length > flag) {
          // for (let i = 1; i <= user.attendance[user.attendance.length - 1].day; i++) {
          //   row[i] = att.day == i ? 
          //           (att.presentStatus ? 'True' : '') : ''
          // }
          user.attendance.forEach(att => {
            row[att.day] = att.presentStatus ? 'Present' : (att.halfDayStatus ? 'Half-Day' : '')
          });
        }

        worksheet.addRow(row);
      });
  
      // Generating a unique file name heheboii
      const fileName = `attendance_${Date.now()}.xlsx`;
      
  
      // Save the workbook to a file
      await workbook.xlsx.writeFile(fileName);
  
      // Send the Excel file as a response
      res.download(fileName, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Internal server error');
        } else {
          // To delete the file so that it doesn't stack up
          fs.unlinkSync(fileName);
        }
      });
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).send('Internal server error');
    }
  };

  const approveHalfDay = async (day, userId, content) => {
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      console.log(user)
      if (!user) {
        // Handle case where user is not found
        console.log('User not found');
        return;
      }
  
      // Find the attendance entry for the specified day
      const attendanceEntry = user.attendance.find(entry => entry.day === day);
      console.log(attendanceEntry)
      if (!attendanceEntry) {
        const time = new Date();
        user.attendance.push({ date: time, punchIn: time, day: day, status: 'half-day' }); // Store the punchIn time as Date object
        await user.save();
        return;
      }
  
      // Update the presentStatus to "half-day"
      attendanceEntry.status = 'half-day';
  
      // Save the updated user document
      await user.save();
      
      // client.messages
      // .create({
      //   body: 'Half Day Approved',
      //   from: '+13308717064',
      //   to: '+916232955569'
      // })
      // .then(message => console.log(message.sid));
  
      console.log('User attendance updated to half-day for day', day);
    } catch (error) {
      // Handle any errors
      console.error('Error updating user attendance:', error);
    }
  
  }

  const approveLeave = async (from, to, userId,) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);
        console.log(user)
        if (!user) {
          // Handle case where user is not found
          console.log('User not found');
          return;
        }
         const time = new Date();
        let start = from;

        while ( start <= to ) {
          const day = start.getDate();
          user.attendance.push({ date: time, punchIn: time, day: day, status: 'leave' }); // Store the punchIn time as Date object
          start.setDate(start.getDate() + 1);
        }
        await user.save();

        // client.messages
        // .create({
        //   body: 'Leave Approved',
        //   from: '+13308717064',
        //   to: '+916260278503'
        // })
        // .then(message => console.log(message.sid));
  
      console.log('User attendance updated to leave for day');

    }
    catch (error) {
      console.log(error)
      console.error('Error updating user leave')
    }
  }

  const calculateDaysBetweenDates = (fromDate, toDate) => {
    // Calculate the difference in milliseconds
    const differenceInMs = toDate.getTime() - fromDate.getTime();
  
    // Convert milliseconds to days
    const daysDifference = differenceInMs / (1000 * 60 * 60 * 24);
  
    // Round the result to get the integer number of days
    const roundedDaysDifference = Math.round(daysDifference);
  
    return roundedDaysDifference;
  };