const router = require("express").Router();
const axios = require("axios");
const User = require("../models/User.model");
const List = require("../models/List.model");
const country = require("../models/Country.code");
const avatar = require("../models/Avatar");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

async function search(filters) {
  const { data: answer } = await axios.get(
    "https://app.ticketmaster.com/discovery/v2/events.json",
    { params: { apikey: "Tzj137hkhXHP4pMeBYhc6BO9P99inCPi", ...filters } }
  );
  const data = answer._embedded.events;
  return data;
}

router.get("/profile", isLoggedIn, async (req, res, next) => {
  const loggedInUser = req.session.user._id;
  let currentUser = await User.findOne({
    _id: loggedInUser,
  });
  await currentUser.populate("list");
  const listEventId = await currentUser.list.map((element) =>{
  const data = search({ id: element.eventId });
  return data
  })
  console.log(listEventId)
  res.render("profile/profile", { user: req.session.user, listEventId });
});

router.get("/search", isLoggedIn, (req, res, next) => {
  res.render("events/search");
});

router.post("/search", isLoggedIn, async (req, res, next) => {
  try {
    const searchWord = req.body.search;
    const data = await search({ keyword: searchWord });
    const cleanData = data.map((elem) => {
      return { ...elem, srcImage: elem.images[3].url };
    });
    res.render("events/search", { cleanData });
  } catch (err) {
    res.render("events/search", {
      errorMessage:
        "Your event/team/band/concert don't give any information to show, please try again.",
    });
  }
});

router.get("/detailevents/:id", isLoggedIn, async (req, res, next) => {
  try {
    const searchID = req.params.id;
    const data = await search({ id: searchID });
    const cleanData = data.map((elem) => {
      return { ...elem, srcImage: elem.images[3].url };
    });
    res.render("events/detailevents", { cleanData });
  } catch (err) {
    res.render("events/search", {
      errorMessage: "Error",
    });
  }
});

router.get("/eventadded/:id", async (req, res, next) => {
  const idEvent = req.params.id;
  const currentUserId = req.session.user._id;
  const data = await search({ id: idEvent });
  const eventDetail = data.map((elem) => {
    return { ...elem, srcImage: elem.images[3].url };
  });
  console.log(eventDetail);
  const newList = {
    eventId: eventDetail[0]._id,
    name: eventDetail[0].name,
    img: eventDetail[0].srcImage,
    date: eventDetail[0].dates.start.localDate,
  };

  let newListDB = await List.create(newList);
  await User.findByIdAndUpdate(currentUserId, {
    $push: { list: [newListDB] },
  });
  res.redirect("/profile");
});

module.exports = router;

/*
router.get("/eventadded/:id", (req, res, next) => {
  const idEvent = req.params.id;
  const currentUserId = req.session.user._id;
  

  List.create({ eventId: idEvent, userId: currentUserId })

    .then((dbList) => {
      const create = User.findByIdAndUpdate(currentUserId, {
        $push: { list: dbList._id },
      });
      return create;
    })
    .catch((err) => {
      console.log(`Err while adding the event in the DB: ${err}`);
      next(err);
    });
  List.find()
    .populate("userId")
    .then((dblist) => {
      console.log("Posts from the DB: ", dblist);
    })
    .then(() => res.redirect("/profile"));
});*/