const express = require("express");
const router = express.Router();
const project = require("../controller/project");
const epic = require("../controller/epic");
const { checkToken } = require("../controller/auth");

router.get("/", checkToken, project.getProjects);
router.get("/:id", checkToken, project.getProject);
router.get("/:id/epics", checkToken, epic.getEpicsByProject);
router.post("/", checkToken, project.addProject);
router.put("/:id", project.editProject);
router.patch("/:id", project.editProject);
router.delete("/:id", project.deleteProject);

module.exports = router;
