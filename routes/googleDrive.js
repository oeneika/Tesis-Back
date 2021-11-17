"use strict";

var express = require("express");
var GoogleDriveController = require("../controllers/googleDrive");

// Router de express
var api = express.Router();

api.post("/google-drive", GoogleDriveController.uploadFile);
api.post("/google-drive-delete", GoogleDriveController.deleteFile);
api.post("/google-drive-get-link", GoogleDriveController.generatePublicUrl);

module.exports = api;
