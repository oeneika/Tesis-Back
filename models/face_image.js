"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FaceImageSchema = Schema({
	face: {type: Schema.ObjectId, ref: "Face", required: true},
	image: {type: Schema.ObjectId, ref: "Image", required: true},
});

module.exports = mongoose.model("FaceImage", FaceImageSchema);
