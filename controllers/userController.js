const UserProfile = require('../models/UserProfile');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
  try {
    const { name, username, password, mobile, email } = req.body;

    const existingUsername = await UserProfile.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const existingEmail = await UserProfile.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new UserProfile({ name, username, mobile, email });
    user.setPassword(password);

    await user.save();

    res.status(201).json({ message: 'User registered successfully', user: { name, username, email, mobile } });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserProfile.findOne({ username });

    if (!user || !user.validatePassword(password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,         // Railway is HTTPS; must be true when sameSite is None
      sameSite: "None",     // Allows cross-origin cookie usage
      maxAge: 3600000 * 24 * 7, // 7 days
    });


    res.status(200).json({
      message: 'Login successful',
      user: {
        name: user.name,
        username,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
exports.logoutUser = (req, res) => {
 res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "None",
    secure: true,
  });

  res.json({ message: "Logged out successfully" });
};
exports.getUserProfile = async (req, res) => {
  try {
    const userProfile = await UserProfile.findById(req.user.id).select("-password"); // exclude password if exists

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};



exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const username = req.user.username;
    // Check new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    // Find user by username
    const user = await UserProfile.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate old password
    if (!user.validatePassword(oldPassword)) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Check if new password is same as old password
    if (oldPassword === newPassword) {
      return res.status(400).json({ message: 'New password must be different from old password' });
    }

    // Set new password
    user.setPassword(newPassword);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
