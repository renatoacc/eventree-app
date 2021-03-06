const { Schema, model } = require("mongoose");

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
    default: "images/avatar/1.png",
  },
  list: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  private: [{ type: Schema.Types.ObjectId, ref: "Private" }],
});

const User = model("User", userSchema);

module.exports = User;
