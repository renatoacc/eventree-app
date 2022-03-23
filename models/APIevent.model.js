const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
  eventId: {
    type: String,
    unique: true,
  },
  name: String,
  img: String,
  date: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Event = model("Event", eventSchema);

module.exports = Event;
