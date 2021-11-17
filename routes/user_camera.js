"use strict";

var express = require("express");
var UserCameraController = require("../controllers/user_camera");

// Router de express
var api = express.Router();
const md_auth = require("../middleware/authenticated");
const md_auth_admin = require("../middleware/is_admin");

var {check} = require("express-validator");

api.get(
	"/get-camera-administrator/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	UserCameraController.getCameraByAdministrator
);

api.get(
	"/get-camera-collaborator/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	UserCameraController.getCameraByCollaborator
);

api.get(
	"/get-collaborator-by-camera/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	UserCameraController.getCollaboratorByCamera
);
module.exports = api;
