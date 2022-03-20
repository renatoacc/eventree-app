const router = require("express").Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");
const country = require("../models/Country.code.js");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isLoggedOut, (req, res, next) => {
  console.log(country);
  res.render("auth/signup", country);
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  //console.log('The form data: ', req.body);
  const { username, password, favoriteArtist, country } = req.body;

  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage: "Please provide your username and password.",
    });
    return;
  }

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth.signup", { errorMessage: "Username already taken." });
    }

    bcryptjs
      .genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          username: username,
          password: hashedPassword,
          favoriteArtist: favoriteArtist,
          country: country,
        });
      })
      .then((user) => {
        req.session.user = user;
        res.redirect("/");
      })
      .then((userFromDB) => {
        console.log("Newly created user is: ", userFromDB);
        res.redirect("/");
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
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Username is not registered. Try again.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.user = user._id;
        res.render("profile/profile", { user });
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password. Try again.",
        });
      }
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
router.get("/logout", isLoggedOut, (req, res) => {
  res.redirect("/login", { errorMessage: "Please make the login" });
});

// router.get("/profile", isLoggedIn, (req, res, next) => {
//   res.render("profile/profile");
// });
module.exports = router;
