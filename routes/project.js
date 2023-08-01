const express = require("express");
const router = express.Router();
const project = require("../controller/project");
const epic = require("../controller/epic");
const { checkToken } = require("../controller/auth");

//get all
router.get("/", checkToken, project.getProjects);

//get one by id
router.get("/:id", checkToken, project.getProject);


//get epics for this project
router.get("/:id/epics", checkToken, epic.getEpicsByProject);

//add one
router.post("/", checkToken, project.addProject);

//edit one
router.put("/:id", project.editProject);
router.patch("/:id", project.editProject);

//delete one
router.delete("/:id", project.deleteProject);

module.exports = router;
