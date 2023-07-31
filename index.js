const express = require("express");
const connectMongoDB = require("./connection");
const urlRouter = require("./routes/urlRoutes");
const staticRouter = require("./routes/staticRoutes");
const userRouter = require("./routes/userRoutes");
const path = require("path");
const cookieParser = require("cookie-parser");
const {
  checkForAuthentication,
  restrictTo,
} = require("./middlewares/login_auth");

const app = express();
const PORT = 3001;

connectMongoDB("mongodb://127.0.0.1:27017/url-shortner")
  .then(console.log("DB connected"))
  .catch((err) => console.log("Error: ", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url", restrictTo(["NORMAL"]), urlRouter);
app.use("/user", userRouter);
app.use("/", staticRouter);

app.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});
