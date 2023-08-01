const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const user = require("../controller/user");



module.exports = {
    login: router.post("", auth.login),
    register: router.post("", user.addUser)
};
