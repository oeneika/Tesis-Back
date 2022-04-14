"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VideoSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: String,
    required: true,
    trim: true,
  },
  file: {
    type: String,
    required: true,
    trim: true,
  },
  camera: { type: Schema.ObjectId, ref: "Camera", required: true },
});

module.exports = mongoose.model("Video", VideoSchema);
