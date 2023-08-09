const express = require("express");
const router = express.Router();
const task = require("../controller/task");
const { checkToken } = require('../controller/auth')

router.get("/", checkToken,  task.getTasks);
router.get("/:id", checkToken, task.getTask);
router.post("/", checkToken, task.addTask);
router.put("/:id", checkToken, task.editTask);
router.patch("/:id", checkToken, task.editTask);
router.delete("/:id", checkToken, task.deleteTask);

module.exports = router;
