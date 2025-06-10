const User = require("../models/User");
const jwt = require('jsonwebtoken');


const bcrypt = require('bcryptjs');  // Import bcryptjs

exports.createUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    // Ensure the required fields are provided
    if (!email || !phoneNumber || !password) {
      return res.status(400).json({
        status: false,
        message: "Email, phone number, and password are required."
      });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email is already in use."
      });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the salt rounds

    // Create the new user with the hashed password
    const user = await User.create({ name, email, phoneNumber, password: hashedPassword, role });

    // Respond with success message and user data (excluding password)
    res.status(201).json({
      status: true,
      message: "User created successfully.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role

        // Don't return the password in the response
      }
    });
  } catch (err) {
    console.error("User creation failed:", err);
    res.status(500).json({
      status: false,
      message: "User creation failed. Please try again later."
    });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Return the users data
    res.status(200).json({
      status: true,
      data: users,
    });
  } catch (err) {
    // Handle any errors
    res.status(500).json({
      status: false,
      message: 'An error occurred while fetching users.',
      error: err.message,
    });
  }
};




  exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ 
        status: false, 
        message: "Email and password are required" 
      });
    }

    // Step 1: Check if email exists in DB (signup hua hai ya nahi)
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      // If user is not found, return an error message
      return res.status(401).json({
        status: false, 
        message: "User not found. Please signup first."
      });
    }

    // Step 2: Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      // If password does not match, return an error message
      return res.status(401).json({
        status: false,
        message: "Incorrect password"
      });
    }

     // Step 3: Create a JWT token
    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email, role: existingUser.role },
      "a3b5c1d9e8f71234567890abcdef1234567890abcdefabcdef1234567890aber",  // Secret key from environment variables
      { expiresIn: '1h' }  // Token expiration time (1 hour)
    );

    // Step 3: Login success, send back the user data (including role, excluding password)
    res.status(200).json({
      status: true,
      message: "Login successful",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        phoneNumber: existingUser.phoneNumber,
        role: existingUser.role  // Include the role in the response
      },
      token  
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
};
