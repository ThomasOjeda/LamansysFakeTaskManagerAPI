const express = require("express");
const router = express.Router();
const sprint = require("../controller/sprint");
const story = require("../controller/story");

//get all
router.get("/", sprint.getSprints);

//get one by id
router.get("/:id", sprint.getSprint);

//get epics for this project
router.get("/:id/stories", story.getStoriesBySprint);

//add one
router.post("/", sprint.addSprint);

//edit one
router.put("/", sprint.editSprint);
router.patch("/", sprint.editSprint);

module.exports = router;
