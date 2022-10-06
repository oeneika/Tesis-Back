"use strict";

var express = require("express");
var PushNotificationController = require("../controllers/push_notifications");

// Router de express
var api = express.Router();

api.post("/send-notifications",PushNotificationController.sendNotifications);

module.exports = api;
