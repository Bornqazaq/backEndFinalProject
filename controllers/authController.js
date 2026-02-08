const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    
    username = username.trim();
    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    sendEmail(
      email,
      "Account Successfully Created",
      `Hello ${username},\n\nYour account has been successfully created!\n\nWelcome to TaskManager.`
    ).catch(emailError => {
      console.error("Failed to send email:", emailError.message);
    });

    res.status(201).json({ message: "Registered", user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error("Registration error:", error.message);
    next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    
    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};