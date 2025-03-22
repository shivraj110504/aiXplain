const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json()); // Ensures JSON body is parsed correctly
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Medicare", { // Use the correct case
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Define User Schema
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

// Signup API
app.post("/signup", async (req, res) => {
    try {
        console.log("Received Data:", req.body);  // Debugging log

        const { fullName, email, phone, password } = req.body;

        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Save new user
        const user = new User({ fullName, email, phone, password });
        await user.save();
        
        console.log("User registered successfully:", user); // Debugging log
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
