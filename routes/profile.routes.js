const router = require("express").Router();
const axios = require("axios");
const User = require("../models/User.model");
const Event = require("../models/APIevent.model");
const Private = require("../models/Privatevent.model");

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
  await currentUser.populate("private");
  console.log(currentUser);
  res.render("profile/profile", { currentUser });
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

router.get("/profile/:id/add", isLoggedIn, async (req, res, next) => {
  const idEvent = req.params.id;
  const currentUserId = req.session.user._id;
  const data = await search({ id: idEvent }); //Criar uma função do MAP é repetido várias vezes.
  const eventDetail = data.map((elem) => {
    return { ...elem, srcImage: elem.images[3].url };
  });
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
    eventList.forEach(async (event) => {
      const eventIndex = event.list.indexOf(idEvent);
      event.list.splice(eventIndex, 1);
      await event.save();
    });

    await Event.findByIdAndRemove(idEvent);

    res.redirect("/profile");
  } catch (err) {
    console.error(err);
  }
});

router.get("/addevent", isLoggedIn, (req, res, next) => {
  res.render("events/addevent");
});

router.post("/addevent", isLoggedIn, async (req, res, next) => {
  const { name, img, info, date } = req.body;
  const currentUser = req.session.user._id;
  const newPrivateEvent = {
    name,
    img,
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
