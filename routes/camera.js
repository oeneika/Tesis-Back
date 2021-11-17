"use strict";

var express = require("express");
var CameraController = require("../controllers/camera");

// Router de express
var api = express.Router();
const md_auth = require("../middleware/authenticated");
const md_auth_admin = require("../middleware/is_admin");

var {check} = require("express-validator");

api.post(
	"/save-camera",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	CameraController.saveCamera
);

api.put(
	"/update-camera/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	CameraController.UpdateCamera
);

api.get(
	"/get-cameras",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	CameraController.getCameras
);

api.get(
	"/get-camera/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	CameraController.getCamera
);

api.delete(
	"/camera/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	CameraController.DeleteCamera
);

module.exports = api;
