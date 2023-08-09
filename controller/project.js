const Project = require('../model/project')
const user = require('../model/user')

module.exports.getProjects = (req, res) => {

  const limit = Number(req.query.limit) || 0
  const sort = req.query.sort == "desc" ? -1 : 1

  Project.find(
    {
      $or: [
        {
          'members': {
            "$in": [req.userFromJWT]
          }
        },
        {
          'owner': req.userFromJWT
        }
      ]

    }
  )
    .limit(limit).sort({
      name: sort
    })
    .then(projects => {
      res.status(200).json({
        status: "success",
        data: projects
      })
    })
    .catch(err => {
      res.status(500).json({
        status: "error",
        message: err
      });
    })
}

module.exports.getProject = (req, res) => {
  const id = req.params.id

  if (id == null) {
    res.status(400).json({
      status: "fail",
      data: { id: "Project Id is required!" }
    })
  }

  Project.findById(id)
    .then(project => {
      res.status(200).json({
        status: "success",
        data: project
      })
    })
    .catch(err => {
      res.status(500).json({
        status: "error",
        message: err
      });
    })
}

module.exports.addProject = (req, res) => {
  // check if body is empty
  if (req.body.name == null || req.body.name == "") {
    res.status(400).json({
      status: "fail",
      data: { name: "Project name is required!" }
    })
  } else {

    const project = new Project({
      name: req.body.name,
      description: req.body.description || null,
      members: req.body.members || [],
      owner: req.userFromJWT._id,
      icon: req.body.icon || null
    })
    project.save()
      .then(project => res.status(201).json({
        status: "success",
        data: project
      }))
      .catch(err => res.status(500).json({
        status: "error",
        message: err
      }))
  }
}

module.exports.editProject = (req, res) => {
  if (req.params.id == undefined || req.params.id == null) {
    res.status(400).json({
      status: "fail",
      message: { id: "Missing project id!" }
    })
  } else if (typeof req.body == undefined) {
    res.status(400).json({
      status: "fail",
      message: { body: "The request is missing a valid JSON body." }
    })
  } else {
    const id = req.params.id
    Project.findById(id)
      .then((project) => {
        project.name = req.body.name || project.name;
        project.description = req.body.description || project.description;
        project.icon = req.body.icon || project.icon;
        project.members = req.body.members || project.members;
        project.save().then(project => res.status(200).json({
          status: "success",
          data: project
        }))
      })
  }
}

module.exports.deleteProject = (req, res) => {
  if (typeof req.params.id == undefined) {
    res.status(400).json({
      status: "fail",
      data: { id: "Missing project id!" }
    })
  } else {
    const id = req.params.id
    Project.findByIdAndDelete(id)
      .then((project) => {
        res.status(200).json({
          status: "success",
          message: "Project deleted successfully!"
        })
      })
      .catch(err => res.status(500).json({
        status: "error",
        message: err
      }))
  }
}