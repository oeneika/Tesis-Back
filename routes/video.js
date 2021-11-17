"use strict";

var express = require("express");
var VideoController = require("../controllers/video");

// Router de express
var api = express.Router();
const md_auth = require("../middleware/authenticated");
const md_auth_admin = require("../middleware/is_admin");

var {check} = require("express-validator");

api.post(
	"/video",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	VideoController.saveVideo
);

api.put(
	"/update-video/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	VideoController.UpdateVideo
);

api.get(
	"/get-videos",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	VideoController.getVideos
);

api.get(
	"/get-video",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	VideoController.getVideo
);

api.delete(
	"/video/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	VideoController.DeleteVideo
);

module.exports = api;
