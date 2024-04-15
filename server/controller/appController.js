// import UserModel from '../model/User.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import ENV from '../config.js';
// import otpGenerator from 'otp-generator';

const UserModel = require("../models/schema/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ENV = require("../config.js");
const otpGenerator = require("otp-generator");

/**
 * Middleware for verifying user...
 */
async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    // checking for user existence

    let exist = await UserModel.findOne({ username });
    if (!exist) {
      return res.status(400).send({ error: "Cannot Find The User...!" });
    }
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error...!" });
  }
}

async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      profile: profile || "",
      email,
    });

    // Save user to the database
    await newUser.save();
    return res.status(201).json({ msg: "User Registered Successfully" });
  } catch (error) {
    console.error("eiuf7gqiu");
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Username not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Password does not match" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      ENV.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send token and username in the response
    return res.status(200).json({
      msg: "Login successful",
      username: user.username,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) {
      return res.status(501).send({ error: "Invalid Username...!" });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(501).send({ error: "Cannot find the User!" });
    }

    // BY THIS CHANGE, I HAVE REMOVED THE PASSWORD FIELD WHEN WE TRY TO RETRIEVE THE DATA OF A USER USING GET.
    const { password, ...rest } = Object.assign({}, user.toJSON());

    return res.status(201).send(rest);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(404).send({ error: "Cannot Find the User Data...!" });
  }
}

async function updateUser(req, res) {
  try {
    const { userId } = req.user; // Assuming req.user contains userId

    // Check if userId exists
    if (userId) {
      const body = req.body;

      // Update the user data
      const result = await UserModel.updateOne({ _id: userId }, { $set: body });

      if (result.nModified === 0) {
        return res
          .status(404)
          .send({ error: "User not found or no changes made" });
      }

      return res.status(201).send({ msg: "Record Updated" });
    } else {
      return res.status(401).send({ error: "User Not Found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Cannot Update User Details" });
  }
}

async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
  // res.json('generateOTP route');
}

async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // this will help to reset the OTP
    req.app.locals.resetSession = true; // set the session for reset password
    return res.status(201).send({ msg: "OTP Verified Successfully" });
  }
  return res.status(400).send({ error: "Invalid OTP" });

  // res.json('verifyOTP route');
}

async function createResetSession(req, res) {
  // res.json('createResetSession route');
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false; // by doing this, we will allow access to this routr only once
    return res.status(201).send({ msg: " Access Granted...!" });
  }

  return res.status(440).send({ msg: "Session Expired...!" });
}

async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(403).send({ msg: "Session Expired...!" });
    }

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Username Not Found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );
    req.app.locals.resetSession = false;

    return res.status(201).send({ msg: "Password Reset Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

module.exports = {
  verifyUser,
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
};
