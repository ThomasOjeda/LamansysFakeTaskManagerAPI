const express = require("express");
const router = express.Router();
const epic = require("../controller/epic");
const story = require("../controller/story");
const { checkToken } = require("../controller/auth");

router.get("/", checkToken, epic.getEpics);
router.get("/:id", checkToken, epic.getEpic);
router.get("/:id/stories", checkToken, story.getStoriesByEpic);
router.post("/", checkToken, epic.addEpic);
router.put("/:id", checkToken, epic.editEpic);
router.patch("/:id", checkToken, epic.editEpic);
router.delete("/:id", checkToken, epic.deleteEpic);

module.exports = router;
