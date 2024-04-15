
const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported as 'app'
const User = require('../app/models/userModel');

// Function to generate JWT token
const generateToken = (userId) => {
  // Generate a JWT token with a payload containing the user ID
  const token = jwt.sign({ userId }, 'RungtaTech', { expiresIn: '8h' });
  return token;
};

describe('Punch-In API', () => {
  let token;
  let deviceId;

  beforeAll(async () => {
    // Assuming you have a valid user for testing
    // You may need to adjust this part based on your setup
    const user = await User.findOne({ email: 'bhardwajraj354@gmail.com' });
    token = generateToken(user._id);
    deviceId = user.deviceId;
  });

  it('should punch in successfully', async () => {
    const res = await request(app)
      .post('/punch-in')
      .set('Authorization', `Bearer ${token}`)
      .set('deviceId', deviceId)
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Punch-in successful');
    
  });


});

describe('Punch-Out API', () => {
  let token;
  let deviceId;

  beforeAll(async () => {

    const user = await User.findOne({ email: 'bhardwajraj354@gmail.com' });
    token = generateToken(user._id);
    deviceId = user.deviceId;
  });

  it('should punch out successfully', async () => {
    const res = await request(app)
      .post('/punch-out')
      .set('Authorization', `Bearer ${token}`)
      .set('deviceId', deviceId)
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Punch-out successful');
   
  });

  // Add more test cases for unauthorized device, punch-out without punch-in, etc.
});
