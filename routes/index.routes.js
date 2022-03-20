const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
module.exports = router;

// const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=Tzj137hkhXHP4pMeBYhc6BO9P99inCPi`;
// const { data: resposta } = await axios.get(url);
// const data = resposta._embedded.events;
// console.log(data);
