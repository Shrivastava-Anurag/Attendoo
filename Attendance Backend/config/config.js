require('dotenv').config(); // Import and load environment variables

module.exports = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  secretKey: process.env.SECRET_KEY,
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
  // Add other configuration variables as needed
};
