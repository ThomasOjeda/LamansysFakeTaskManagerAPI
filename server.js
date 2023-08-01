//initializes
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

//app
const app = express();

//port
const port = 8080;

//routes
const projectRoute = require("./routes/project");
const epicRoute = require("./routes/epic");
const sprintRoute = require("./routes/sprint");
const storyRoute = require("./routes/story");
const taskRoute = require("./routes/task");
const userRoute = require("./routes/user");
const loginRoute = require("./routes/auth");

//middleware
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/projects", projectRoute); //✅
app.use("/api/epics", epicRoute);
app.use("/api/sprints", sprintRoute);
app.use("/api/stories", storyRoute);
app.use("/api/tasks", taskRoute);

app.use("/api/users", userRoute); //✅
app.use("/api/login", loginRoute.login); //✅

app.get('/', (req, res) => {
  res.send('Express JS on Vercel')
})

app.get('/ping', (req, res) => {
  res.send('pong 🏓')
})

//mongoose
// mongoose.set("useFindAndModify", false);
// mongoose.set("useUnifiedTopology", true);
// mongoose
//   .connect(process.env.DB_STRING, { useNewUrlParser: true })
// .then(() => {

// })
// .catch((err) => {
//   console.log(err);
// });

app.listen(port, (err, res) => {
  if (err) {
    console.log(err)
    return res.status(500).send(err.message)
  } else {
    console.log('[INFO] Server Running on port:', port)
    // mongoose.set("useFindAndModify", false);
    // mongoose.set("useUnifiedTopology", true);
    // mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true })
  }
})

//module.exports = app;
