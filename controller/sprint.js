const Project = require('../model/project')
const Sprint = require('../model/sprint')

module.exports.getSprints = (req, res) => {
  const limit = Number(req.query.limit) || 0
  const sort = req.query.sort == "desc" ? -1 : 1

  Sprint.find()
    .limit(limit).sort({
      id: sort
    })
    .then(sprints => {
      res.json(sprints)
    })
    .catch(err => console.log(err))
}

module.exports.getSprint = (req, res) => {
  const id = req.params.id

  Sprint.find({ id: id})
    .then(sprints => {
      res.json(sprints)
    })
    .catch(err => console.log(err))
}

module.exports.getSprintByProject = (req, res) => {
  const projectid = req.params.id

  Project.find({ id: projectid }).then(projects => {
    
    console.log(projects);
    Sprint.find({ project: projects[0].id })
      .then(sprints => {
        res.json(sprints)
      })
      .catch(err => console.log(err))
  })
}

module.exports.addSprint = (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined"
    })
  } else {
    let sprintCount = 0;

    Sprint.find().countDocuments(function (err, count) {
      sprintCount = count
    })
      .then(() => {
        const sprint = new Sprint({
          id: sprintCount + 1,
          name: req.body.name,
          description: req.body.description || null,
          start: req.body.start,
          finish: req.body.finish,
          project: req.body.project
        })
        sprint.save()
          .then(sprint => res.json(sprint))
          .catch(err => res.json(err))

      })

  }
}

module.exports.editSprint = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data"
    })
  } else {
    const id = req.params.id
    Sprint.findById(id)
      .then((sprint) => {
        sprint.name = req.body.name || sprint.name;
        sprint.description = req.body.description || sprint.description;
        sprint.start = req.body.start || sprint.start;
        sprint.finish = req.body.finish || sprint.finish;
        sprint.project = req.body.project || sprint.project;
        sprint.save().then(sprint => res.json(sprint))
      })
  }
}

/*
module.exports.deleteStore = (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "cart id should be provided"
    })
  } else {
    Store.findOneAndDelete({ _id: req.params.id })
      //.select(['-_id'])
      .then(store => {
        res.json(store)
      })
      .catch(err => res.json(err))
  }
}
*/