const { Schema, model } = require("mongoose");

const privateSchema = new Schema({
  name: String,
  img: {
    type: String,
    default: "shorturl.at/duxAQ",
  },
  info: String,
  date: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Private = model("Private", privateSchema);

module.exports = Private;
