"use strict";

var express = require("express");
var CollaboratorController = require("../controllers/collaborator");

var api = express.Router();
const md_auth = require("../middleware/authenticated");
const md_auth_admin = require("../middleware/is_admin");

var {check} = require("express-validator");

api.post(
	"/create-collaborator",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	CollaboratorController.createCollaborator
);

api.get(
	"/get-collaborator-administrator/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	CollaboratorController.getCollaboratorsByAdministrator
);

api.delete(
	"/delete-collaborator/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	CollaboratorController.DeleteCollaborator
);

module.exports = api;
