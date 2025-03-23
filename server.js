const bcrypt = require("bcryptjs");
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB with better error handling
mongoose.connect("mongodb://localhost:27017/medicare", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected Successfully");
  // List all collections
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    if (err) {
      console.error("Error listing collections:", err);
    } else {
      console.log("📊 Available collections:", collections.map(c => c.name));
    }
  });
})
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);
});

// 1. User Schema for Login/Signup
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'users' }); // Explicitly set collection name

const User = mongoose.model("User", UserSchema);

// 2. Appointment Schema
const AppointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  doctor: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'appointments' }); // Explicitly set collection name

const Appointment = mongoose.model("Appointment", AppointmentSchema);

// 3. Bed Booking Schema
const BedBookingSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  email: { type: String, required: true },
  hospital: { type: String, required: true },
  bedType: { type: String, required: true },
  admissionDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
});

const BedBooking = mongoose.model('BedBooking', BedBookingSchema);

// 4. Medicine Order Schema
const MedicineOrderSchema = new mongoose.Schema({
  username: String,
  email: String,
  address: String,
  specialInstructions: String,
  subtotal: Number,
  deliveryFee: Number,
  total: Number,
  cart: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  prescriptionFile: String,
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'pending'
  }
});

const MedicineOrder = mongoose.model('MedicineOrder', MedicineOrderSchema);

// Multer storage setup for prescription uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// 1. User APIs
app.post("/signup", async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;
        console.log("📝 Received signup data:", { fullName, email, phone });

        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ fullName, email, phone, password: hashedPassword });
        await user.save();
        
        console.log("✅ User registered successfully:", user.email);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("❌ Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔐 Login attempt for:", email);
        
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("✅ Login successful for:", email);
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 2. Appointment APIs
app.post("/book-appointment", async (req, res) => {
  try {
    const { name, contact, email, doctor, date, time } = req.body;
    console.log("📅 New appointment request:", { name, doctor, date, time });

    if (!name || !contact || !email || !doctor || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const appointment = new Appointment({
      name, contact, email, doctor,
      date: new Date(date),
      time
    });

    await appointment.save();
    console.log("✅ Appointment booked successfully:", appointment._id);
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error("❌ Appointment Booking Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

app.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// 3. Bed Booking APIs
app.post('/bookBed', async (req, res) => {
    try {
        const {
            patientName,
            email,
            hospital,
            bedType,
            admissionDate
        } = req.body;

        // Basic validation
        if (!patientName || !email || !hospital || !bedType || !admissionDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create new booking
        const booking = new BedBooking({
            patientName,
            email,
            hospital,
            bedType,
            admissionDate: new Date(admissionDate)
        });

        // Save booking to database
        await booking.save();
        
        console.log('✅ Bed booked successfully:', booking._id);
        res.status(200).json({ message: 'Bed booked successfully', bookingId: booking._id });
    } catch (error) {
        console.error('❌ Error booking bed:', error);
        res.status(500).json({ message: 'Error booking bed' });
    }
});

// 4. Medicine Order APIs
app.post('/placeOrder', upload.single('prescription'), async (req, res) => {
    try {
        const { username, email, address, specialInstructions, subtotal, deliveryFee, total, cart } = req.body;
        
        // Basic validation
        if (!username || !email || !address || !cart) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create new order
        const order = new MedicineOrder({
            username,
            email,
            address,
            specialInstructions,
            subtotal: parseFloat(subtotal),
            deliveryFee: parseFloat(deliveryFee),
            total: parseFloat(total),
            cart: JSON.parse(cart),
            prescriptionFile: req.file ? req.file.filename : null
        });

        // Save order to database
        await order.save();
        
        console.log('✅ Medicine order placed successfully:', order._id);
        res.status(200).json({ message: 'Order placed successfully', orderId: order._id });
    } catch (error) {
        console.error('❌ Error placing medicine order:', error);
        res.status(500).json({ message: 'Error placing order' });
    }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await MedicineOrder.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Serve uploaded prescription files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
    console.log("📁 Created uploads directory");
}

// Start server
const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
