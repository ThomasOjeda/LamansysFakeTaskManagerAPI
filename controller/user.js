const User = require('../model/user')

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports.getAllUsers = (req, res) => {
  const limit = Number(req.query.limit) || 0
  const sort = req.query.sort == "desc" ? -1 : 1

  User.find().select(['-password']).limit(limit).sort({
    username: sort
  })
    .then(users =>
      res.status(200).json({
        status: "success",
        data: users
      })
    )
    .catch(err => res.status(500).json({
      status: "error",
      message: err
    }))
}

module.exports.getUser = (req, res) => {
  const id = req.params.id

  if (id == null || id == undefined) {
    res.status(400).json({
      status: "fail",
      data: { id: "User Id is required!" }
    })
  }

  User.findById(id).select(['-password'])
    .then(user =>
      res.status(200).json({
        status: "success",
        data: user
      })
    )
    .catch(err => res.status(500).json({
      status: "error",
      message: err
    }))
}


module.exports.addUser = (req, res) => {
  if (typeof req.body == undefined) {
    res.status(400).json({
      status: "fail",
      message: { body: "The request is missing a valid JSON body." }
    })
  } else if (req.body.email == null || req.body.email == undefined) {
    res.status(400).json({
      status: "fail",
      message: { name: "User email is required!" }
    })
  } else if (req.body.username == null || req.body.username == undefined) {
    res.status(400).json({
      status: "fail",
      message: { epic: "User username is required!" }
    })
  } else if (req.body.password == null || req.body.password == undefined) {
    res.status(400).json({
      status: "fail",
      message: { epic: "User password is required!" }
    })
  } else if (req.body.firstname == null || req.body.firstname == undefined) {
    res.status(400).json({
      status: "fail",
      message: { epic: "User firstname is required!" }
    })
  } else if (req.body.lastname == null || req.body.lastname == undefined) {
    res.status(400).json({
      status: "fail",
      message: { epic: "User lastname is required!" }
    })
  } else {

    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashSync(req.body.password, genSaltSync(10)),
      name: {
        first: req.body.firstname,
        last: req.body.lastname
      }
    })
    user.save()
      .then(user => res.status(200).json({
        status: "success",
        data: user
      }))
      .catch(err => res.status(500).json({
        status: "error",
        message: err
      }))
  }
}

module.exports.editUser = (req, res) => {
  if (req.params.id == undefined || req.params.id == null) {
    res.status(400).json({
      status: "fail",
      message: { id: "Missing User id!" }
    })
  } else if (typeof req.body == undefined) {
    res.status(400).json({
      status: "error",
      message: { body: "The request is missing a valid JSON body." }
    })
  } else {
    const id = req.params.id
    User.findById(id)
      .then((user) => {
        user.email = req.body.email || user.email;
        user.username = req.body.username || user.username;
        user.password = req.body.password || user.password;
        user.name.first = req.body.firstname || user.name.first;
        user.name.last = req.body.lastname || user.name.last;
        user.save().then(user => res.status(200).json({
          status: "success",
          data: user
        }))
      })
  }
}

module.exports.deleteUser = (req, res) => {
  if (typeof req.params.id == undefined) {
    res.json({
      status: "fail",
      message: { id: "Missing User id!" }
    })
  } else {
    const id = req.params.id
    User.findByIdAndDelete(id)
      .then((story) => {
        res.status(200).json({
          status: "success",
          message: "User deleted successfully!"
        })
      })
      .catch(err => res.status(500).json({
        status: "error",
        message: err
      }))
  }
}