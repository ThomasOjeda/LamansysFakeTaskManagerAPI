const User = require('../model/user')

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports.getAllUser = (req, res) => {
  const limit = Number(req.query.limit) || 0
  const sort = req.query.sort == "desc" ? -1 : 1

  User.find().select(['-password']).limit(limit).sort({
    username: sort
  })
    .then(users => {
      res.json(users)
    })
    .catch(err => console.log(err))
}

module.exports.getUser = (req, res) => {
  const id = req.params.id

  User.findOne({
    _id: id
  }).select(['-password'])
    .then(user => {
      res.json(user)
    })
    .catch(err => console.log(err))
}



module.exports.addUser = (req, res) => {
  console.log("-------------------------");
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined"
    })
  } else {
    hashedPassword = hashSync(req.body.password, genSaltSync(10));

    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      name: {
        first: req.body.firstname,
        last: req.body.lastname
      }

    })
    user.save()
      .then(user => res.json(user))
      .catch(err => console.log(err))
  }
}

module.exports.editUser = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data"
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
        user.save().then(user => res.json(user))
      })
  }
}

module.exports.deleteUser = (req, res) => {
  if (typeof req.params.id == undefined) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data"
    })
  } else {
    const id = req.params.id
    User.findByIdAndDelete(id)
      .then(user => res.json(user))
      .catch(err => console.log(err))
  }
}