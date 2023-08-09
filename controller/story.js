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
      const data = {
        success: true,
        data: stories
      };
      res.json(data)
    })
    .catch(err =>
      res.json({
        success: false,
        message: err
      })
    )
}

module.exports.getStory = (req, res) => {
  const id = req.params.id

  Story.findById(id)
    .then(stories => {
      const data = {
        success: true,
        data: stories
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

module.exports.getStoriesByEpic = (req, res) => {
  const epicid = req.params.id

  Epic.findById(epicid).then(epics => {
    // console.log(epics);
    if (epics.length > 0) {
      Story.findById(epics[0]._id)
        .then(stories => {
          let data = {
            success: true,
            data: stories
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
        message: "epic not found"
      };
      res.json(data)
    }

  })
}

module.exports.getStoriesBySprint = (req, res) => {
  const sprintid = req.params.id

  Sprint.findById(sprintid).then(sprints => {
    // find epic by id and get tasks 
    if (sprints.length > 0) {
      Story.findById(sprints[0].id)
        .then(stories => {
          let data = {
            success: true,
            data: stories
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
        message: "sprint not found"
      };
      res.json(data)
    }
  })
}

module.exports.addStory = (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data"
    })
  } else {

    const story = new Story({
      name: req.body.name,
      description: req.body.description || null,
      epic: req.body.epic,
      sprint: req.body.sprint || null,
      owner: req.body.owner || null,
      assignedTo: [req.body.owner] || [],
      points: req.body.points || null,
      created: req.body.created || Date.now(),
      due: req.body.due || null,
      started: req.body.started || null,
      finished: req.body.finished || null,
      status: req.body.status || "todo",
      icon: req.body.icon || null,
    })
    story.save()
      .then(story => res.status(201).json(story))
      .catch(err => res.json(err))
  }
}

module.exports.editStory = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data"
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
        story.assignedTo = [] || story.assignedTo;
        story.points = req.body.points || story.points;
        story.created = req.body.created || story.created;
        story.due = req.body.due || story.due;
        story.started = req.body.started || story.started;
        story.finished = req.body.finished || story.finished;
        story.status = req.body.status || story.status;
        story.icon = req.body.icon || story.icon;

        story.save().then(story => res.json(story))
      })
  }
}

module.exports.deleteStory = (req, res) => {
  if (typeof req.params.id == undefined) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data"
    })
  } else {
    const id = req.params.id
    Story.findByIdAndDelete(id)
      .then((story) => {
        res.json({
          status: "success",
          message: "story deleted"
        })
      })
  }
}