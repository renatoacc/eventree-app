const { Schema, model } = require("mongoose");

const listSchema = new Schema({
  eventId: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const List = model("List", listSchema);

module.exports = List;
