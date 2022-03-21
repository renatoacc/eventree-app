const router = require("express").Router();
const axios = require("axios");
const User = require("../models/User.model");
const country = require("../models/Country.code");
const avatar = require("../models/Avatar");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const async = require("hbs/lib/async");

async function search(filters) {
  const { data: answer } = await axios.get(
    "https://app.ticketmaster.com/discovery/v2/events.json",
    { params: { apikey: "Tzj137hkhXHP4pMeBYhc6BO9P99inCPi", ...filters } }
  );
  const data = answer._embedded.events;
  return data;
}

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("profile/profile", { user: req.session.user });
});

router.get("/search", isLoggedIn, (req, res, next) => {
  res.render("events/search");
});

router.post("/search", isLoggedIn, async (req, res, next) => {
  try {
    const searchWord = req.body.search;
    const data = await search({ keyword: searchWord });
    const cleanData = data.map((elem) => {
      return { ...elem, srcImage: elem.images[4].url };
    });
    console.log(cleanData);
    res.render("events/search", { cleanData });
  } catch (err) {
    res.render("events/search", {
      errorMessage:
        "Your event/team/band/concert don't give any information to show, please try again.",
    });
  }
});

router.get("/detailevents", isLoggedIn, (req, res, next) => {
  res.render("events/detailevents");
});

module.exports = router;
