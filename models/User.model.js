const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    require: [true, "Username is required."],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Password is required."],
  },
  favoriteArtist: String,
  country: {
    type: String,
    default: "US",
  },
  avatar: {
    type: String,
    default: "images/avatar/1.jpg",
  },
  list: [{type: mongoose.Schema.Types.ObjectId, ref: "List"}],
});

const User = model("User", userSchema);

module.exports = User;
