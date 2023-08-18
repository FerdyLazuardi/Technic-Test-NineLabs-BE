const router = require("express").Router();

// controller
const Task = require("../controller/taskController");

// middleware
const Authentication = require("../middlewares/authenticate");

// API auth
router.post("/create", Authentication, Task.createTask);
router.get("/", Authentication, Task.getAllTask);
router.delete("/:id", Authentication, Task.deleteTask);
router.put("/:id", Authentication, Task.updateTask);

module.exports = router;
