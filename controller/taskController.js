const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { task } = require("../models");

const createTask = catchAsync(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User tidak diotentikasi");
  }

  const { tittle, status, deadline } = req.body;

  // create task
  const newTask = await task.create({
    user_id: req.user.id,
    tittle,
    status,
    deadline,
  });
  res.status(201).json({
    status: "success",
    data: {
      newTask,
    },
  });
});

const getAllTask = catchAsync(async (req, res) => {
  const token = req.headers.authorization; // Get token from Authorization header
  const tokenWithoutPrefix = token.split(" ")[1];
  // Verify the token and get user ID
  const decodedToken = jwt.verify(tokenWithoutPrefix, "rahasia"); // Use the corresponding secret key
  const userId = decodedToken.id;

  console.log(userId);
  const data = await task.findAll({
    where: { user_id: userId },
  });

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "tidak ada task");
  }

  res.status(200).json({
    status: "success",
    data,
  });
});

const deleteTask = catchAsync(async (req, res) => {
  const id = req.params.id;

  const dataTask = await task.findByPk(id);

  if (!dataTask) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Task with this id ${id} is not found`
    );
  }

  await task.destroy({
    where: {
      id,
    },
  });

  res.status(200).json({
    status: "Success",
    message: `Task dengan id ${id} terhapus`,
  });
});

const updateTask = catchAsync(async (req, res) => {
  const { tittle, status, deadline } = req.body;
  const id = req.params.id;

  const dataTask = await task.findByPk(id);

  if (!dataTask) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Task with this id ${id} is not found`
    );
  }

  await task.update(
    {
      tittle,
      status,
      deadline,
    },
    {
      where: {
        id,
      },
    }
  );
  res.status(200).json({
    status: "Success",
    data: {
      id,
      tittle,
      status,
      deadline,
    },
  });
});

module.exports = {
  createTask,
  getAllTask,
  deleteTask,
  updateTask,
};
