const router = require("express").Router();
const axios = require("axios");
const User = require("../models/User.model");
const country = require("../models/Country.code");
const avatar = require("../models/Avatar");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const async = require("hbs/lib/async");

async function search(filters) {
  //   const url = `https://app.ticketmaster.com/discovery/v2/events.json?&${key}=${word}&apikey=Tzj137hkhXHP4pMeBYhc6BO9P99inCPi`;
  const { data: resposta } = await axios.get(
    "https://app.ticketmaster.com/discovery/v2/events.json",
    { params: { apikey: "Tzj137hkhXHP4pMeBYhc6BO9P99inCPi", ...filters } }
  );
  const data = resposta._embedded.events;
  return data;
}

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("profile/profile", { user: req.session.user });
});

router.get("/search", isLoggedIn, (req, res, next) => {
  res.render("events/search");
});

router.post("/search", isLoggedIn, async (req, res, next) => {
  const searchWord = req.body.search;
  const data = await search({ keyword: searchWord });
  const cleanData = data.map((elem) => {
    return { ...elem, srcImage: elem.images[0].url };
  });
  console.log(cleanData);
  res.render("events/search", { cleanData });
});

module.exports = router;
