const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcrypt");
const generateOTP = require("../services/otpGenerator");
const sendOTPByEmail = require("../services/sendEmailOtp");
const sendEmailResetPassword = require("../services/sendEmailResetPassword");
const { user } = require("../models");

const getAllUsers = catchAsync(async (req, res) => {
  // Dapatkan semua pengguna dari database
  const allUsers = await user.findAll();

  res.status(200).json({
    status: "success",
    data: {
      users: allUsers,
    },
  });
});

const register = catchAsync(async (req, res) => {
  const { name, password, email } = req.body;

  // validation if email is already in use
  const User = await user.findOne({ where: { email: email } });
  if (User) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists!");
  }

  // validation for minimum password length
  const passwordLength = password.length >= 8;
  if (!passwordLength) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Minimum password length must be 8 characters or more"
    );
  }

  // encrypt password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // generate OTP
  const otp = generateOTP();

  // send OTP via email
  await sendOTPByEmail(email, otp);

  const newUser = await user.create({
    name,
    password: hashedPassword,
    email,
    otp,
  });

  const newUserResponse = newUser.toJSON();
  delete newUserResponse.otp;

  res.status(201).json({
    status: "success",
    data: {
      newUserResponse,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  //search user
  const User = await user.findOne({
    where: {
      email,
    },
  });

  // validation email user
  if (!User) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not Found");
  }

  // validation verified
  if (!User.verified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not verified");
  }

  if (User && bcrypt.compareSync(password, User.password)) {
    // generate token for user succesfull login
    const token = jwt.sign(
      {
        id: User.id,
        username: User.name,
        email: User.email,
      },
      "rahasia"
    );

    res.status(200).json({
      status: "Success",
      data: {
        username: User.name,
        email: User.email,
        token,
      },
    });
  } else {
    // validation password
    throw new ApiError(httpStatus.BAD_REQUEST, "Wrong Password");
  }
});

const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  // search user by email
  const User = await user.findOne({ where: { email: email } });
  if (!User) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // validation the otp
  if (otp != User.otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  // set status verification to true
  User.verified = true;
  await User.save();

  res.status(200).json({
    status: "success",
    message: "OTP verification successful",
  });
});

const resetGenerateLink = catchAsync(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const User = await user.findOne({
    where: {
      email,
    },
  });

  // If user doesn't exist
  if (!User) {
    return res.status(httpStatus.NOT_FOUND).json({
      status: "error",
      message: "User not found",
    });
  }

  // Generate reset token
  const resetToken = jwt.sign({ email: User.email }, "rahasia", {
    expiresIn: "1h",
  });

  // Set reset password token and expiration time
  User.resetPasswordToken = resetToken;
  User.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
  await User.save();

  // Generate the reset password link
  const resetPasswordLink = `http://localhost:5173/reset-password?token=${resetToken}`;

  // Send the reset password link via email
  await sendEmailResetPassword(User.email, resetPasswordLink);

  res.status(200).json({
    status: "success",
    message: "Reset password link has been sent to your email",
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;

  // Verify and decode the reset token
  const decodedToken = jwt.verify(token, "rahasia");

  // Retrieve the email from the decoded token
  const email = decodedToken.email;

  // Find user by email
  const User = await user.findOne({
    where: {
      email,
    },
  });

  if (!User) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }

  // Check if token has expired
  if (Date.now() > User.resetPasswordExpires) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Token has expired");
  }

  // Encrypt the new password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Update User's password
  User.password = hashedPassword;
  await User.save();

  res.status(200).json({
    status: "success",
    message: "Password has been reset",
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const User = await user.findByPk(id);

  if (!User) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Seat with this id ${id} is not found`
    );
  }

  await user.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({
    status: "success",
    message: `user dengan id ${id} terhapus`,
  });
});

module.exports = {
  getAllUsers,
  register,
  login,
  deleteUser,
  resetGenerateLink,
  verifyOTP,
  resetPassword,
};
