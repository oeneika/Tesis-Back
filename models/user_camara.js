"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserCameraSchema = Schema({
  cameraId: { type: Schema.ObjectId, ref: "Camera", required: true },
  UserCollaborator: { type: Schema.ObjectId, ref: "User" },
  UserAdmin: { type: Schema.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("UserCamera", UserCameraSchema);
