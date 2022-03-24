const router = require("express").Router();
const axios = require("axios");
const User = require("../models/User.model");
const Event = require("../models/APIevent.model");
const Private = require("../models/Privatevent.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const { EventEmitter } = require("connect-mongo");

async function search(filters) {
  const { data: answer } = await axios.get(
    "https://app.ticketmaster.com/discovery/v2/events.json",
    { params: { apikey: process.env.apikey, ...filters } }
  );
  const data = answer._embedded.events;
  return data.map((elem) => {
    return { ...elem, srcImage: elem.images[3].url };
  });
}

router.get("/profile", isLoggedIn, async (req, res, next) => {
  const loggedInUser = req.session.user._id;
  let currentUser = await User.findOne({
    _id: loggedInUser,
  });
  await currentUser.populate("list");
  await currentUser.populate("private");
  res.render("profile/profile", { currentUser, login: loggedInUser });
});

router.get("/search", isLoggedIn, (req, res, next) => {
  const loggedInUser = req.session.user._id;
  res.render("events/search", { login: loggedInUser });
});

router.post("/search", isLoggedIn, async (req, res, next) => {
  try {
    const loggedInUser = req.session.user._id;
    const searchWord = req.body.search;
    const cleanData = await search({ keyword: searchWord });

    res.render("events/search", { cleanData, login: loggedInUser });
  } catch (err) {
    res.render("events/search", {
      errorMessage:
        "Your event/team/band/concert don't give any information to show, please try again.",
    });
  }
});

router.get("/detailevents/:id", isLoggedIn, async (req, res, next) => {
  try {
    const loggedInUser = req.session.user._id;
    const searchID = req.params.id;
    const cleanData = await search({ id: searchID });
    res.render("events/detailevents", { cleanData, login: loggedInUser });
  } catch (err) {
    res.render("events/search", {
      errorMessage: "Error",
    });
  }
});

router.get("/profile/:id/add", isLoggedIn, async (req, res, next) => {
  const idEvent = req.params.id;
  const currentUserId = req.session.user._id;
  const eventDetail = await search({ id: idEvent });
  const newEvent = {
    eventId: idEvent,
    name: eventDetail[0].name,
    img: eventDetail[0].srcImage,
    date: eventDetail[0].dates.start.localDate,
    userId: currentUserId,
  };

  let newEventDB = await Event.create(newEvent);
  await User.findByIdAndUpdate(currentUserId, {
    $push: { list: [newEventDB] },
  });
  res.redirect("/profile");
});

router.get("/profile/:id/delete", isLoggedIn, async (req, res) => {
  try {
    const idEvent = req.params.id;
    const eventList = await User.find({ list: idEvent });
    const privatEvent = await User.find({ private: idEvent });

    eventList.forEach(async (event) => {
      const eventIndex = event.list.indexOf(idEvent);
      event.list.splice(eventIndex, 1);
      await event.save();
    });

    privatEvent.forEach(async (event) => {
      const eventIndex = event.private.indexOf(idEvent);
      event.private.splice(eventIndex, 1);
      await event.save();
    });

    await Event.findByIdAndRemove(idEvent);
    await Private.findByIdAndDelete(idEvent);

    res.redirect("/profile");
  } catch (err) {
    console.error(err);
  }
});

router.get("/addevent", isLoggedIn, (req, res, next) => {
  const loggedInUser = req.session.user._id;
  res.render("events/addevent", { login: loggedInUser });
});

router.post("/addevent", isLoggedIn, async (req, res, next) => {
  const { name, info, date } = req.body;
  const currentUser = req.session.user._id;

  if (req.body.img === "") {
    req.body.img = "/images/default.jpg";
  }

  const newPrivateEvent = {
    name,
    img: req.body.img,
    info: info,
    date,
    userId: currentUser,
  };
  let newPrivateEventDB = await Private.create(newPrivateEvent);
  await User.findByIdAndUpdate(currentUser, {
    $push: { private: [newPrivateEventDB] },
  });
  res.redirect("/profile");
});

router.get("/detailprivate/:id", isLoggedIn, async (req, res, next) => {
  try {
    const loggedInUser = req.session.user._id;
    const searchID = req.params.id;
    const data = await Private.findOne({ _id: searchID });
    console.log(data);
    res.render("events/detailprivate", { data: [data] });
  } catch (err) {
    res.render("events/search", {
      errorMessage: "Error",
    });
  }
});

router.get("/editevent/:id", isLoggedIn, async (req, res, next) => {
  const eventID = req.params.id;
  const data = await Private.findById(eventID);
  res.render("events/editevent", { data: [data], login: loggedInUser });
});

router.post("/editevent/:id", isLoggedIn, async (req, res, next) => {
  const eventId = req.params.id;
  const { name, info, date } = req.body;
  const currentUser = req.session.user._id;

  if (req.body.img === "") {
    req.body.img = "/images/default.jpg";
  }
  await Private.findByIdAndUpdate(eventId, {
    name,
    img: req.body.img,
    info: info,
    date,
    userId: currentUser,
  });

  res.redirect("/profile");
});

module.exports = router;

/* promise

router.get("/eventadded/:id", (req, res, next) => {
  const idEvent = req.params.id;
  const currentUserId = req.session.user._id;
  

  Event.create({ eventId: idEvent, userId: currentUserId })

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
  Event.find()
    .populate("userId")
    .then((dblist) => {
      console.log("Posts from the DB: ", dblist);
    })
    .then(() => res.redirect("/profile"));
});*/
