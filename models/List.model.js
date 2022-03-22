const { Schema, model } = require("mongoose");

const listSchema = new Schema({
  eventId: String,
  userId: String,
});

const List = model("List", listSchema);

module.exports = List;
