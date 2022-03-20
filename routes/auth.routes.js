const { Router } = require("express");
const router = new Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  //console.log('The form data: ', req.body);
  const { username, password } = req.body;

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

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      //console.log(`Password hash: ${hashedPassword}`);
      return User.create({
        username,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/profile");
    })
    .catch((error) => {
    //   if (error instanceof mongoose.Error.ValidationError) {
    //     res.status(500).render("auth/signup", { errorMessage: error.message });
    //   } else if (error.code === 11000) {
    //     res.status(500).render("auth/signup", {
    //       errorMessage: "Username is already being used.",
    //     });
    //   } else {
    //     next(error);
    //   }
      next(error);
    });
});

router.get('/login', (req, res) => {
    res.render('auth/login')
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
   
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.'
      });
      return;
    }
   
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Username is not registered. Try again.' });
          return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
          res.render('profile/profile', { user });
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password. Try again.' });
        }
      })
      .catch(error => next(error));
  });


router.get("/profile", (req, res, next) => {
  res.render("profile/profile");
});

module.exports = router;
