"use strict";

var express = require("express");
var ConfidenceLevelsController = require("../controllers/confidenceLevels");

// Router de express
var api = express.Router();
const md_auth = require("../middleware/authenticated");
const md_auth_admin = require("../middleware/is_admin");

var {check} = require("express-validator");

api.post(
	"/confidence-level",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	ConfidenceLevelsController.saveConfidenceLevel
);

api.put(
	"/update-confidence-level/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	ConfidenceLevelsController.UpdateConfidenceLevel
);

api.get(
	"/confidence-levels",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	ConfidenceLevelsController.getConfidenceLevels
);

api.get(
	"/confidence-level/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	ConfidenceLevelsController.getConfidenceLevel
);

api.delete(
	"/confidence-level/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	ConfidenceLevelsController.DeleteConfidenceLevel
);

module.exports = api;
