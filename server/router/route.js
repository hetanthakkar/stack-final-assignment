// import { Router } from "express";
// import { registerMail } from "../controller/mailer.js";
// import Auth, { OTPLocalVariables } from "../middleware/auth.js";

const express = require("express");
const router = express.Router();
const { registerMail } = require("../controller/mailer.js");
const { OTPLocalVariables, Auth } = require("../middleware/auth.js");

// This is the code where we import all our controllers from the appController.js
// import * as controller from "../controller/appController.js";
const controller = require("../controller/appController.js");

/**
 * POST
 */
router.route("/register").post(controller.register);
router.route("/registerMail").post(registerMail); //send email for verification
router
  .route("/authenticate")
  .post(controller.verifyUser, (req, res) => res.end()); //authenticate the user
router.route("/login").post(controller.verifyUser, controller.login); //login into the app
router.route("/login").post(controller.verifyUser, controller.login); //login into the app
/**
 * GET
 */
router
  .route("/user/:username")
  .get(controller.validateBearerToken, controller.getUser); //username with the user
router
  .route("/generateOTP")
  .get(controller.verifyUser, OTPLocalVariables, controller.generateOTP); //generate random OTP
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP); //verify the OTP
router.route("/createResetSession").get(controller.createResetSession); //reset all the variables

/**
 * PUT
 */
router.route("/updateUser").put(Auth, controller.updateUser); //used to update the user profile
router
  .route("/resetPassword")
  .put(controller.verifyUser, controller.resetPassword); //used to reset the password

module.exports = router;
