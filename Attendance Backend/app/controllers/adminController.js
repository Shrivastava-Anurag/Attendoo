const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserDetails = require('../models/userDetails');
const Announcement = require('../models/announcementModel');
const Team = require('../models/teamsModel');
const Admin = require('../models/adminModel')
const ExcelJS = require('exceljs');
const fs = require('fs');
const moment = require('moment');

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
    const team = req.params.team;// 'present' or 'absent'
    
    
    // Construct the query based on team name and present/absent status
    const query = {
      team : (team === 'all') ? {$exists: true} : team,
  };
    // Fetch users based on the constructed query
    const users = await User.find(query);
    console.log(users)
    
    res.status(200).json({ success: true, data: users });
} catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
}
};

exports.getUsersByTeam = async (req, res) => {
  try {
      const team = req.params.team;
      const presentStatus = req.query.present === 'present' ? true : false ;// 'present' or 'absent'
      console.log("query is" + presentStatus)
      
      // Get today's date in the format 'YYYY-MM-DD'
      const today = new Date();
      const Day = today.getDate();
      
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
                        presentStatus: presentStatus,
                        halfDayStatus: false,
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
                            presentStatus: presentStatus,
                            halfDayStatus: true,
                        } 
                    } 
                }
            ]
    };
      }


      // Fetch users based on the constructed query
      const users = await User.find(query);
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
            row[att.day] = att.presentStatus ? 'Present' : ''
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