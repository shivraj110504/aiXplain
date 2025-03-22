const express = require('express');
const connectDB = require('./connection');

const app = express();

// Connect to MongoDB
connectDB();

// ...existing code...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));