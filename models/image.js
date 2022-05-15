"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ImageSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  file: {
    type: String,
    required: true,
    trim: true,
  },
  camera: { type: Schema.ObjectId, ref: "Camera", required: false },
});

module.exports = mongoose.model("Image", ImageSchema);
