const Epic = require('../model/epic')
const Sprint = require('../model/sprint')
const Story = require('../model/story')

module.exports.getStories = (req, res) => {

  const limit = Number(req.query.limit) || 0
  const sort = req.query.sort == "desc" ? -1 : 1

  Story.find(
    {
      $or: [
        { 'owner': req.userFromJWT },
        {
          'assignedTo': {
            "$in": [req.userFromJWT]
          }
        }
      ]
    }
  )
    .limit(limit).sort({
      name: sort
    })
    .then(stories => {
      res.status(200).json({
        status: "success",
        data: stories
      })
    })
    .catch(err =>
      res.status(500).json({
        status: "error",
        message: err
      })
    )
}

module.exports.getStory = (req, res) => {
  const id = req.params.id

  if (id == null || id == undefined) {
    res.status(400).json({
      status: "fail",
      data: { id: "Story Id is required!" }
    })
  }

  Story.findById(id)
    .then(story => {
      res.status(200).json({
        status: "success",
        data: story
      })
    })
    .catch(err => {
      res.status(500).json({
        status: "error",
        message: err
      });
    })
}

module.exports.getStoriesByEpic = (req, res) => {
  const epicid = req.params.id

  if (epicid == null || epicid == undefined) {
    res.status(400).json({
      status: "fail",
      data: { id: "Epic Id is required!" }
    })
  } else {
    Epic.findById(epicid).then(epics => {

      if (epics) {
        Story.find({ epic: epics._id })
          .then(stories => {
            res.status(200).json({
              status: "success",
              data: stories
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
          message: { epic: "Epic not found" }
        })
      }

    })
  }


}

module.exports.getStoriesBySprint = (req, res) => {
  const sprintid = req.params.id

  if (sprintid == null || sprintid == undefined) {
    res.status(400).json({
      status: "fail",
      data: { id: "Sprint Id is required!" }
    })
  } else {

    Sprint.findById(sprintid).then(sprint => {
      // find epic by id and get tasks 
      if (sprint) {
        Story.find({ sprint: sprint._id })
          .then(stories => {
            res.status(200).json({
              status: "success",
              data: stories
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
          message: { sprint: "Sprint not found" }
        })
      }
    })
  }
}

module.exports.addStory = (req, res) => {
  if (typeof req.body == undefined) {
    res.status(400).json({
      status: "fail",
      message: { body: "The request is missing a valid JSON body." }
    })
  } else if (req.body.name == null || req.body.name == undefined) {
    res.status(400).json({
      status: "fail",
      message: { name: "Story name is required!" }
    })
  } else if (req.body.epic == null || req.body.epic == undefined) {
    res.status(400).json({
      status: "fail",
      message: { epic: "Epic id is required!" }
    })
  } else {

    const story = new Story({
      name: req.body.name,
      description: req.body.description || null,
      epic: req.body.epic,
      sprint: req.body.sprint || null,
      owner: req.body.owner || null,
      assignedTo: req.body.assignedTo || [],
      points: req.body.points || null,
      created: req.body.created || Date.now(),
      due: req.body.due || null,
      started: req.body.started || null,
      finished: req.body.finished || null,
      status: req.body.status || "todo",
      icon: req.body.icon || null,
    })
    story.save()
      .then(story => res.status(201).json({
        status: "success",
        data: story
      }))
      .catch(err => res.status(500).json({
        status: "error",
        message: err
      }))
  }
}

module.exports.editStory = (req, res) => {
  if (req.params.id == undefined || req.params.id == null) {
    res.status(400).json({
      status: "fail",
      message: { id: "Missing Story id!" }
    })
  } else if (typeof req.body == undefined) {
    res.status(400).json({
      status: "error",
      message: { body: "The request is missing a valid JSON body." }
    })
  } else {
    const id = req.params.id
    Story.findById(id)
      .then((story) => {
        story.name = req.body.name || story.name;
        story.description = req.body.description || story.description;
        story.epic = req.body.epic || story.epic;
        story.sprint = req.body.sprint || story.sprint;
        story.owner = req.body.owner || story.owner;
        story.assignedTo = req.body.assignedTo || story.assignedTo
        story.points = req.body.points || story.points;
        story.created = req.body.created || story.created;
        story.due = req.body.due || story.due;
        story.started = req.body.started || story.started;
        story.finished = req.body.finished || story.finished;
        story.status = req.body.status || story.status;
        story.icon = req.body.icon || story.icon;
        
        story.save().then(story => res.status(200).json({
          status: "success",
          data: story
        }))
      })
  }
}

module.exports.deleteStory = (req, res) => {
  if (typeof req.params.id == undefined) {
    res.status(400).json({
      status: "fail",
      message: { id: "Missing Story id!" }
    })
  } else {
    const id = req.params.id
    Story.findByIdAndDelete(id)
      .then((story) => {
        res.status(200).json({
          status: "success",
          message: "Story deleted successfully!"
        })
      })
  }
}