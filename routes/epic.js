const express = require("express");
const router = express.Router();
const epic = require("../controller/epic");
const story = require("../controller/story");
const { checkToken } = require("../controller/auth");

//get all
router.get("/", checkToken, epic.getEpics);

//get one by id
router.get("/:id", checkToken, epic.getEpic);

//get epics for this project
router.get("/:id/stories", checkToken, story.getStoriesByEpic);

//add one
router.post("/", checkToken, epic.addEpic);

//edit one
router.put("/:id", checkToken, epic.editEpic);
router.patch("/:id", checkToken, epic.editEpic);

module.exports = router;
