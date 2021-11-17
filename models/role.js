"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RoleSchema = Schema({
	name: String,
});

module.exports = mongoose.model("Role", RoleSchema);
