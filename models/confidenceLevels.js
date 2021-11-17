"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ConfidenceLevelSchema = Schema({
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
});

module.exports = mongoose.model("ConfidenceLevel", ConfidenceLevelSchema);
