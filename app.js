const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const userController = require("./controllers/user");

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(userController.isUserLogged);
app.use(userRouter);
app.use(blogRouter);

app.use(errorController.get404);

app.listen(3000);
