const Project = require('../model/project')
const Epic = require('../model/epic')
const { response } = require('express')

module.exports.getEpics = (req, res) => {
  const limit = Number(req.query.limit) || 0
  const sort = req.query.sort == "desc" ? -1 : 1

  Epic.find()
    .limit(limit).sort({
      id: sort
    })
    .then(epics => {
      const data = {
        success: true,
        data: epics
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

module.exports.getEpic = (req, res) => {
  const id = req.params.id

  Epic.find({ id: id })
    .then(epic => {
      let data = {
        success: true,
        data: epic
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

module.exports.getEpicsByProject = (req, res) => {
  const projectid = req.params.id
  //console.log(projectid);

  Project.find({ id: projectid }).then(project => {
    // find epic by id and get tasks
    //console.log(project);
    if (project.length > 0) {
      Epic.find({ project: project[0]._id })
        .then(epics => {
          let data = {
            success: true,
            data: epics
          };
          res.json(data)
        })
        .catch(err => {
          res.json({
            success: false,
            message: err
          });
        })
    } else {
      let data = {
        success: false,
        data: null,
        message: "project not found"
      };
      res.json(data)
    }
  })
}

module.exports.addEpic = (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined"
    })
  } else {
    let epicCount = 0;

    Epic.find().countDocuments(function (err, count) {
      epicCount = count
    })
      .then(() => {
        const epic = new Epic({
          id: epicCount + 1,
          project: req.body.project,
          name: req.body.name,
          description: req.body.description || null,
          icon: req.body.icon || null
        })
        epic.save()
          .then(epic => res.json(epic))
          .catch(err => res.json(err))

      })

  }
}

module.exports.editEpic = (req, res) => {
  //console.log("req.id = " + req.params.id);
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data"
    })
  } else {
    const id = req.params.id
    Epic.findOne({ id: id })
      .then((epic) => {
        epic.name = req.body.name || epic.name;
        epic.description = req.body.description || epic.description;
        epic.icon = req.body.icon || epic.icon;
        epic.project = req.body.project || epic.project;
        epic.save().then(epic => res.json(epic))
      })
  }
}