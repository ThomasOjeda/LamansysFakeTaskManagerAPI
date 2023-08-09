const express = require("express");
const router = express.Router();
const sprint = require("../controller/sprint");
const story = require("../controller/story");

router.get("/", sprint.getSprints);
router.get("/:id", sprint.getSprint);
router.get("/:id/stories", story.getStoriesBySprint);
router.post("/", sprint.addSprint);
router.put("/", sprint.editSprint);
router.patch("/", sprint.editSprint);

module.exports = router;
