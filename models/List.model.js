const { Schema, model } = require("mongoose");

const listSchema = new Schema({
 name: String,
 location: String,
 date: Date,
});

const List = model("List", listSchema);

module.exports = List;
