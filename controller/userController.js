const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { user } = require("../models");

const register = catchAsync(async (req, res) => {
  const { name, pin } = req.body;

  // validasi password
  const pinLength = pin.length == 4;
  if (!pinLength) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Pin harus berupa 4 angka");
  }

  // validasi same pin
  const existingUser = await user.findOne({ where: { pin } });
  if (existingUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Pin sudah digunakan oleh pengguna lain"
    );
  }

  //   validasi same name
  const existingUserName = await user.findOne({ where: { name } });
  if (existingUserName) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Nama sudah digunakan oleh pengguna lain"
    );
  }

  // register user
  const newUser = await user.create({
    name,
    pin,
  });

  res.status(201).json({
    status: "success",
    data: {
      name,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { pin } = req.body;

  //search user
  const User = await user.findOne({ where: { pin } });

  if (!User) {
    throw new ApiError(httpStatus.NOT_FOUND, "user tidak ada");
  }

  if (pin != User.pin) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "PIN salah");
  }

  const token = jwt.sign({ id: User.id, name: User.name }, "rahasia");
  console.log(User.id);

  res.status(200).json({
    status: "success ",
    data: {
      name: User.name,
      token,
    },
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
  register,
  login,
  deleteUser,
};
