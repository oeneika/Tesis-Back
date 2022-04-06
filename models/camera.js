"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CameraSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  power: {
    type: Boolean,
    required: true,
    trim: true,
  },
  turn_screen: {
    type: Boolean,
    required: true,
    trim: true,
  },
  user_camera: {
    type: Schema.ObjectId,
    ref: "UserCamera",
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Camera", CameraSchema);
