const express = require('express');
const connectDB = require('./connection');
const User = require('./models/User');
const Appointment = require('./models/Appointment');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Route to create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Server-side validation
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (phone.length < 10) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to create a new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { fullName, email, phone, department, date, time, message } = req.body;

    // Server-side validation
    if (!fullName || !email || !phone || !department || !date || !time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (phone.length < 10) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));