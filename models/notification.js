"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NotificationSchema = Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	user: {type: Schema.ObjectId, ref: "User", required: true},
});

module.exports = mongoose.model("Notification", NotificationSchema);
