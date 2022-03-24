const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");
const countryCode = require("../models/Country.code");
const avatarIMG = require("../models/Avatar");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup", { avatarIMG, countryCode });
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  //console.log('The form data: ', req.body);
  const { username, password, favoriteArtist, country, avatar } = req.body;

  if (!username || !password) {
    console.log("This is country", country);
    console.log("This is avatar", avatar);
    res.render("auth/signup", {
      avatarIMG,
      countryCode,
      errorMessage: "Please provide your username and password.",
    });
    return;
  }

  if (password.length < 8) {
    console.log(country);
    res.render("auth/signup", {
      avatarIMG,
      countryCode,
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
    return;
  }

  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      console.log(country);
      res.render("auth/signup", {
        avatarIMG,
        countryCode,
        errorMessage: "The username you choose is already taken.",
      });
      return;
    }

    bcryptjs
      .genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          username,
          password: hashedPassword,
          favoriteArtist,
          country,
          avatar,
        });
      })
      .then((user) => {
        req.session.user = user;
        res.redirect("/profile");
      })
      .then((userFromDB) => {
        res.redirect("/profile");
      })
      .catch((error) => {
        next(error);
      });
  });
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "You need to type an username and a password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage:
            "The username you entered is incorrect. Please try again.",
        });
        return;
      }

      if (bcryptjs.compareSync(password, user.password)) {
        req.session.user = user;
        console.log(user);
        res.redirect("/profile");
      }
      res.render("auth/login", {
        errorMessage:
          "The password you entered is incorrect. Please try again.",
      });
    })
    .catch((error) => next(error));
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render("/", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

module.exports = router;
