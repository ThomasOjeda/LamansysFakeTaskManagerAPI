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
      const data = {
        success: true,
        data: projects
      };
      res.json(data)
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      });
    })
}

module.exports.getProject = (req, res) => {
  const id = req.params.id

  Project.findById(id)
    .then(project => {
      const data = {
        success: true,
        data: project
      };
      res.json(data)
    })
    .catch(err => {
      res.json({
        success: false,
        message: err
      });
    })
}

module.exports.addProject = (req, res) => {
  console.log(req);
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined"
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
      .then(project => res.status("201").json(project))
      .catch(err => res.json(err))
  }
}

module.exports.editProject = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data"
    })
  } else {
    const id = req.params.id
    Project.findById(id)
      .then((project) => {
        project.name = req.body.name || project.name;
        project.description = req.body.description || project.description;
        project.icon = req.body.icon || project.icon;
        project.members = req.body.members || project.members;
        project.save().then(project => res.json(project))
      })
  }
}

module.exports.deleteProject = (req, res) => {
  if (typeof req.params.id == undefined) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data"
    })
  } else {
    const id = req.params.id
    Project.findByIdAndDelete(id)
      .then((project) => {
        res.json({
          status: "success",
          message: "project deleted"
        })
      })
  }
}