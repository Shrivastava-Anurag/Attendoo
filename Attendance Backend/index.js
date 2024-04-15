const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/config');
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');
const loggingMiddleware = require('./middleware/loggingMiddleware');
const userRoutes = require('./app/routes/userRoutes');
const adminRoutes = require('./app/routes/adminRoutes');

require('dotenv').config();

const app = express();
app.use(cors())

// Connect to the database
mongoose.connect(config.databaseUrl, {
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.json());


// Routes
app.use('/api/users', userRoutes);
app.use('/admin', adminRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
// Start the server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});