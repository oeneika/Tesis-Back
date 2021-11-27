"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VideoSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // moment_ini: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  // moment_final: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  // url_drive: {
  //   type: String,
  //   trim: true,
  // },
  size: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: String,
    required: true,
    trim: true,
  },
  // quality: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  videoName: {
    type: String,
    required: true,
    trim: true,
  },

  camera: { type: Schema.ObjectId, ref: "Camera", required: true },
});

module.exports = mongoose.model("Video", VideoSchema);
