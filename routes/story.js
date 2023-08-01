const express = require("express");
const router = express.Router();
const story = require("../controller/story");
const task = require("../controller/task");
const { checkToken } = require("../controller/auth");

//get all
router.get("/", checkToken, story.getStories);

//get one by id
router.get("/:id", checkToken, story.getStory);

//get epics for this project
router.get("/:id/tasks", checkToken, task.getTasksByStory);

//add one
router.post("/", checkToken, story.addStory);

//edit one
router.put("/:id", checkToken, story.editStory);
router.patch("/:id", checkToken, story.editStory);

module.exports = router;
