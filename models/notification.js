"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NotificationSchema = Schema({
  hour: {
    type: Date,
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
  seen: {
    type: Boolean,
    required: true,
    trim: true,
  },
  file: {
    type: String,
    required: true,
    trim: true,
  },
  camera: { type: Schema.ObjectId, ref: "Camera", required: true },
  user: { type: Schema.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Notification", NotificationSchema);
