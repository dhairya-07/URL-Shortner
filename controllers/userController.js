const User = require("../models/userSchema");
const { v4: uuidv4 } = require("uuid");
const { setUser, getUser } = require("../services/auth");

async function handleSignup(req, res) {
  const { name, email, password } = req.body;

  await User.create({
    name,
    email,
    password,
  });
  return res.redirect("/");
}

async function handleLogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
    password,
  });
  if (!user)
    return res.render("login", {
      Error: "Invalid email or password",
    });

  const token = setUser(user);
  res.cookie("token", token);

  return res.redirect("/");
}

module.exports = { handleSignup, handleLogin };
