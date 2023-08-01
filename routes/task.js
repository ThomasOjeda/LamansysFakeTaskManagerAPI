const express = require("express");
const router = express.Router();
const task = require("../controller/task");
const { checkToken } = require('../controller/auth')
//get all
router.get("/", checkToken,  task.getTasks);

//get one by id
router.get("/:id", checkToken, task.getTask);

//add one
router.post("/", checkToken, task.addTask);

//edit one
router.put("/:id", checkToken, task.editTask);
router.patch("/:id", checkToken, task.editTask);

router.delete("/:id", checkToken, task.deleteTask);

module.exports = router;
