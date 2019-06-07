const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  if (req.isLogged) return res.redirect("/");

  res.render("user/login", {
    pageTitle: "Login - Private Blog",
    path: "/login",
    loginError: false,
    isLogged: false
  });
};

exports.postLogin = (req, res, next) => {
  const { user, pass } = req.body;
  User.login(user, pass, u => {
    if (u) return res.redirect("/");

    res.render("user/login", {
      pageTitle: "Login - Private Blog",
      path: "/login",
      loginError: true,
      isLogged: false
    });
  });
};

exports.getSignup = (req, res, next) => {
  if (req.isLogged) return res.redirect("/");

  res.render("user/signup", {
    pageTitle: "SignUp - Private Blog",
    path: "/signup",
    signupError: false,
    isLogged: false
  });
};

exports.postSignup = (req, res, next) => {
  const { user, pass, repeat, isAdmin } = req.body;
  User.signup(user, pass, repeat, isAdmin, u => {
    if (u) {
      if (typeof u !== "string") {
        res.redirect("/login");
      } else {
        let errorMessage = "";
        switch (u) {
          case "SU01":
            errorMessage =
              "This username is already taken, please change your username.";
            break;
          case "SU02":
            errorMessage = "Your password must be at least 5 characters long.";
            break;
          case "SU03":
            errorMessage = "Password and Repeat password must be the same.";
            break;
        }

        res.render("user/signup", {
          pageTitle: "SignUp - Private Blog",
          path: "/signup",
          signupError: true,
          isLogged: false,
          errorMessage: errorMessage
        });
      }
    }
  });
};

exports.postLogout = (req, res, next) => {
  if (!req.isLogged) return res.redirect("/");

  User.logout(result => {
    if (result) {
      res.redirect("/");
    }
  });
};

exports.isUserLogged = (req, res, next) => {
  User.isLoggedIn(isLogged => {
    req.isLogged = isLogged;
    return next();
  });
};
