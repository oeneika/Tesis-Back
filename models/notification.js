"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NotificationSchema = Schema({
  hour: {
    type: Date,
    required: true,
    trim: true,
  },
  facialExpression: {
    type: String,
    required: true,
    trim: true,
  },
  seen: {
    type: Boolean,
    required: true,
    trim: true,
  },
  face: { type: Schema.ObjectId, ref: "Face", required: false },
  image: { type: Schema.ObjectId, ref: "Image", required: true },
  camera: { type: Schema.ObjectId, ref: "Camera", required: true },
  user: { type: Schema.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Notification", NotificationSchema);
