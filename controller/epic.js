const Project = require('../model/project')
const Epic = require('../model/epic')

module.exports.getEpics = (req, res) => {

  const limit = Number(req.query.limit) || 0
  const sort = req.query.sort == "desc" ? -1 : 1

  Epic.find()
    .limit(limit).sort({
      name: sort
    })
    .then(epics => {
      res.status(200).json({
        status: "success",
        data: epics
      })
    })
    .catch(err => {
      res.status(500).json({
        status: "error",
        message: err
      });
    })
}

module.exports.getEpic = (req, res) => {
  const id = req.params.id

  if (id == null || id == undefined) {
    res.status(400).json({
      status: "fail",
      data: { id: "Project Id is required!" }
    })
  }

  Epic.findById(id)
    .then(epic => {
      res.status(200).json({
        status: "success",
        data: epic
      })
    })
    .catch(err => {
      res.status(500).json({
        status: "error",
        message: err
      });
    })
}

module.exports.getEpicsByProject = (req, res) => {
  const projectid = req.params.id

  if (projectid == null || projectid == undefined) {
    res.status(400).json({
      status: "fail",
      data: { id: "Project Id is required!" }
    })
  } else {
    Project.findById(projectid).then(project => {
      // find epic by id and get tasks
      if (project) {
        Epic.find({project: project._id})
          .then(epics => {
            res.status(200).json({
              status: "success",
              data: epics
            })
          })
          .catch(err => {
            res.status(500).json({
              status: "error",
              message: err
            });
          })
      } else {
        res.status(500).json({
          status: "error",
          data: null,
          message: { project: "Project not found" }
        })
      }
    })
  }

}

module.exports.addEpic = (req, res) => {
  if (typeof req.body == undefined) {
    res.status(400).json({
      status: "fail",
      message: { body: "The request is missing a valid JSON body." }
    })
  } else if (req.body.project == null || req.body.project == undefined) {
    res.status(400).json({
      status: "fail",
      message: { project: "Project id is required!" }
    })
  } else if (req.body.name == null || req.body.name == undefined) {
    res.status(400).json({
      status: "fail",
      message: { name: "Epic name is required!" }
    })
  } else {

    const epic = new Epic({
      project: req.body.project,
      name: req.body.name,
      description: req.body.description || null,
      icon: req.body.icon || null
    })
    epic.save()
      .then(epic => res.status(201).json({
        status: "success",
        data: epic
      }))
      .catch(err => res.status(500).json({
        status: "error",
        message: err
      }))
  }
}

module.exports.editEpic = (req, res) => {
  if (req.params.id == undefined || req.params.id == null) {
    res.status(400).json({
      status: "fail",
      message: { id: "Missing Epic id!" }
    })
  } else if (typeof req.body == undefined) {
    res.status(400).json({
      status: "error",
      message: { body: "The request is missing a valid JSON body." }
    })
  } else {
    const id = req.params.id
    Epic.findById(id)
      .then((epic) => {
        epic.name = req.body.name || epic.name;
        epic.description = req.body.description || epic.description;
        epic.icon = req.body.icon || epic.icon;
        epic.project = req.body.project || epic.project;
        epic.save().then(epic => res.status(200).json({
          status: "success",
          data: epic
        }))
      })
  }
}

module.exports.deleteEpic = (req, res) => {
  if (typeof req.params.id == undefined) {
    res.status(400).json({
      status: "fail",
      data: { id: "Missing epic id!" }
    })
  } else {
    const id = req.params.id
    Epic.findByIdAndDelete(id)
      .then((epic) => {
        res.status(200).json({
          status: "success",
          message: "Epic deleted successfully!"
        })
      })
      .catch(err => res.status(500).json({
        status: "error",
        message: err
      }))
  }
}