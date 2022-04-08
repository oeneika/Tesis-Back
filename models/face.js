"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FaceSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  surname: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  unknown: {
    type: Boolean,
    trim: true,
    default: false,
  },
  confidenceLevels: {
    type: Schema.ObjectId,
    ref: "ConfidenceLevel",
    required: false,
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Face", FaceSchema);
