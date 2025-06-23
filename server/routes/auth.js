import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Generate OTP
const generateOTP = () => {
  // return Math.floor(100000 + Math.random() * 900000).toString();
  return 1111;
};

// Citizen OTP Login
router.post('/citizen-login', async (req, res) => {
  try {
    const { phone } = req.body;
    
    let user = await User.findOne({ phone, role: 'citizen' });
    if (!user) {
      user = new User({
        phone,
        role: 'citizen'
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // In production, send OTP via SMS
    console.log(`OTP for ${phone}: ${otp}`);
    
    res.json({ message: 'OTP sent successfully', otp }); // Remove otp in production
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    const user = await User.findOne({ 
      phone, 
      role: 'citizen',
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: user.role, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Supervisor/Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: user.role, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create default users (for development)
router.post('/create-defaults', async (req, res) => {
  try {
    const defaultUsers = [
      { username: 'supervisor1', password: 'supervisor123', role: 'supervisor' },
      { username: 'admin1', password: 'admin123', role: 'admin' }
    ];

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
      }
    }

    res.json({ message: 'Default users created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;