const Task = require('../model/task')
const Story = require('../model/story')

module.exports.getTasks = (req, res) => {
  const limit = Number(req.query.limit) || 0
  const sort = req.query.sort == "desc" ? -1 : 1

  Task.find()
    .limit(limit).sort({
      id: sort
    })
    .then(tasks => {
      const data = {
        success: true,
        data: tasks
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

module.exports.getTasksByStory = (req, res) => {
  const storyid = req.params.id

  Story.find({ id: storyid }).then(story => {
    // find story by id and get tasks 
    // console.log(story);
    if (story.length > 0) {
      Task.find({ story: story[0]._id })
        .then(tasks => {
          let data = {
            success: true,
            data: tasks
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
        message: "story not found"
      };
      res.json(data)
    }
  })
}

module.exports.getTask = (req, res) => {
  const id = req.params.id

  Task.find({ id: id })
    .then(tasks => {
      const data = {
        success: true,
        data: tasks
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

module.exports.addTask = (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined"
    })
  } else {
    Task.find().sort({_id:-1}).limit(1)
    .then((last) => {
        const id = last[0].id + 1
        const task = new Task({
          id: id,
          name: req.body.name,
          description: req.body.description,
          story: req.body.story,
          created: req.body.created,
          due: req.body.due,
          done: req.body.done
        })
        task.save()
          .then(task => {
            const data = {
              success: true,
              data: task
            };
            res.json(data)
          })
          .catch(err => {
            res.json({
              success: false,
              message: err
            });
          })
      })

  }
}

module.exports.editTask = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      succes: false,
      message: "something went wrong! check your sent data"
    })
  } else {
    const id = req.params.id;
    console.log(id);
    Task.find({id: id}).limit(1)
      .then((task) => {
        task = task[0];
        task.name = req.body.name || task.name;
        task.description = req.body.description || task.description;
        task.story = req.body.story || task.story;
        task.created = req.body.created || task.created;
        task.due = req.body.due || task.due;
        task.done = req.body.done || task.done;

        task.save().then(task => {
          const data = {
            success: true,
            data: task
          };
          res.json(data)
        })
      })
  }
}

module.exports.deleteTask = (req, res) => {
  if (req.params.id == null) {
    res.json({
      success: false,
      message: "task id should be provided"
    })
  } else {
    Task.findOneAndDelete({ id: req.params.id })
      .then(task => {
        const data = {
          success: true,
          data: task
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
}
