const express = require("express");
const router = express.Router();
const story = require("../controller/story");
const task = require("../controller/task");
const { checkToken } = require("../controller/auth");

router.get("/", checkToken, story.getStories);
router.get("/:id", checkToken, story.getStory);
router.get("/:id/tasks", checkToken, task.getTasksByStory);
router.post("/", checkToken, story.addStory);
router.put("/:id", checkToken, story.editStory);
router.patch("/:id", checkToken, story.editStory);

module.exports = router;
