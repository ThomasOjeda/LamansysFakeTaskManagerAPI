const Task = require('../model/task')
const Story = require('../model/story')

module.exports.getTasks = (req, res) => {
  const limit = Number(req.query.limit) || 0
  const sort = req.query.sort == "desc" ? -1 : 1

  Task.find()
    .limit(limit).sort({
      name: sort
    })
    .then(tasks => {
      res.status(200).json({
        status: "success",
        data: tasks
      })
    })
    .catch(err =>
      res.status(500).json({
        status: "error",
        message: err
      })
    )
}

module.exports.getTask = (req, res) => {
  const id = req.params.id

  if (id == null || id == undefined) {
    res.status(400).json({
      status: "fail",
      data: { id: "Task Id is required!" }
    })
  }

  Task.findById(id)
    .then(tasks => {
      res.status(200).json({
        status: "success",
        data: tasks
      })
    })
    .catch(err => {
      res.status(500).json({
        status: "error",
        message: err
      });
    })
}

module.exports.getTasksByStory = (req, res) => {
  const storyid = req.params.id

  if (epicid == null || epicid == undefined) {
    res.status(400).json({
      status: "fail",
      data: { id: "Story Id is required!" }
    })
  } else {
    Story.findById(storyid).then(story => {
      // find story by id and get tasks 
      if (story) {
        Task.find({ story: story._id })
          .then(tasks => {
            res.status(200).json({
              status: "success",
              data: tasks
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
          message: { story: "Story not found" }
        })
      }
    })
  }


}

module.exports.addTask = (req, res) => {
  if (typeof req.body == undefined) {
    res.status(400).json({
      status: "fail",
      message: { body: "The request is missing a valid JSON body." }
    })
  } else if (req.body.name == null || req.body.name == undefined) {
    res.status(400).json({
      status: "fail",
      message: { name: "Task name is required!" }
    })
  } else if (req.body.story == null || req.body.story == undefined) {
    res.status(400).json({
      status: "fail",
      message: { epic: "Story id is required!" }
    })
  } else {

    const task = new Task({
      name: req.body.name,
      description: req.body.description || null,
      story: req.body.story,
      created: req.body.created || Date.now(),
      due: req.body.due || null,
      done: req.body.done || false,
    })
    task.save()
      .then(task => res.status(201).json({
        status: "success",
        data: task
      }))
      .catch(err => res.status(500).json({
        status: "error",
        message: err
      }))
  }
}

module.exports.editTask = (req, res) => {
  if (req.params.id == undefined || req.params.id == null) {
    res.status(400).json({
      status: "fail",
      message: { id: "Missing Task id!" }
    })
  } else if (typeof req.body == undefined) {
    res.status(400).json({
      status: "error",
      message: { body: "The request is missing a valid JSON body." }
    })
  } else {
    const id = req.params.id;
    Task.findById(id)
      .then((task) => {
        task.name = req.body.name || task.name;
        task.description = req.body.description || task.description;
        task.story = req.body.story || task.story;
        task.created = req.body.created || task.created;
        task.due = req.body.due || task.due;
        task.done = req.body.done || task.done;

        task.save().then(task => res.json({
          status: "success",
          data: task
        }))
      })
  }
}

module.exports.deleteTask = (req, res) => {
  if (typeof req.params.id == undefined) {
    res.status(400).json({
      status: "fail",
      message: { id: "Missing Task id!" }
    })
  } else {
    const id = req.params.id
    Task.findByIdAndDelete(req.params.id)
      .then(task => res.status(200).json({
        status: "success",
        data: task
      }))
      .catch(err => res.status(500).json({
        status: "error",
        message: err
      }))
  }
}
