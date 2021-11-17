"use strict";

var express = require("express");
var RoleController = require("../controllers/role");

// Router de express
var api = express.Router();
const md_auth = require("../middleware/authenticated");
const md_admin = require("../middleware/is_admin");

api.get("/roles", RoleController.getRoles);
api.post(
	"/roles",
	[md_auth.ensureAuth, md_admin.isAdmin],
	RoleController.saveRole
);

module.exports = api;
