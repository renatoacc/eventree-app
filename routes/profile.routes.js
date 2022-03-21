const router = require("express").Router();
const axios = require("axios");
const User = require("../models/User.model");
const country = require("../models/Country.code");
const avatar = require("../models/Avatar");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("profile/profile", { user: req.session.user });
});

router.get("/search", isLoggedIn, async (req, res, next) => {
  res.render("events/search");
});

router.post("/search", isLoggedIn, async (req, res, next) => {
  const searchWord = req.body.search;
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?&keyword=${searchWord}&apikey=Tzj137hkhXHP4pMeBYhc6BO9P99inCPi`;
  const { data: resposta } = await axios.get(url);
  const data = resposta._embedded.events;
  console.log(data);
  res.render("events/search");
});
