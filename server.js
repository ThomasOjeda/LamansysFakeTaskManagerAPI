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

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//view engine
app.set("view engine", "ejs");
app.set("views", "views");

app.disable("view cache");

app.use("/api/projects", projectRoute); //✅
app.use("/api/epics", epicRoute);
app.use("/api/sprints", sprintRoute);
app.use("/api/stories", storyRoute);
app.use("/api/tasks", taskRoute);

app.use("/api/users", userRoute); //✅
app.use("/api/login", loginRoute.login); //✅

//app.use("/", (req,res) => {res.sendFile(path.join(__dirname, "./public/simpledocs.html"))});

app.get('/', (req, res) => {
  res.send('Express JS on Vercel')
})

app.get('/ping', (req, res) => {
  res.send('pong 🏓')
})

//mongoose
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(process.env.DB_STRING, { useNewUrlParser: true })
  .then(() => {
    app.listen(process.env.PORT || port, () => {
      console.log("app running on port", process.env.PORT || port);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
