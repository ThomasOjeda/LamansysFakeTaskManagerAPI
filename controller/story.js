const Epic = require('../model/epic')
const Sprint = require('../model/sprint')
const Story = require('../model/story')

module.exports.getStories = (req, res) => {
  const limit = Number(req.query.limit) || 0
  const sort = req.query.sort == "desc" ? -1 : 1
  console.log(req.userFromJWT);
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
      id: sort
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

  Story.find({ id: id })
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
  //console.log("epicid: " + epicid);

  Epic.find({ id: epicid }).then(epics => {
    // console.log(epics);
    if (epics.length > 0) {
      Story.find({ epic: epics[0]._id })
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

  Sprint.find({ id: sprintid }).then(sprints => {
    // find epic by id and get tasks 
    // console.log(sprints);
    if (sprints.length > 0) {
      Story.find({ sprint: sprints[0].id })
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
      message: "data is undefined"
    })
  } else {
    let storyCount = 0;

    Story.find().countDocuments(function (err, count) {
      storyCount = count
    })
      .then(() => {
        const story = new Story({
          id: storyCount + 1,
          name: req.body.name,
          description: req.body.description,
          epic: req.body.epic,
          sprint: req.body.sprint,
          owner: req.body.owner,
          assignedTo: [],
          points: req.body.points,
          created: req.body.created,
          due: req.body.due,
          started: req.body.started,
          finished: req.body.finished,
          status: req.body.status,
          icon: req.body.icon,
        })
        story.save()
          .then(story => res.json(story))
          .catch(err => res.json(err))
      })

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
    Story.findOne({ id: id })
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