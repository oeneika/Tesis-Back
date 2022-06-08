"use strict";

var express = require("express");
var NotificationController = require("../controllers/notification");

// Router de express
var api = express.Router();
const md_auth = require("../middleware/authenticated");
const md_auth_admin = require("../middleware/is_admin");

var { check } = require("express-validator");

api.post(
  "/notification",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  NotificationController.saveNotification
);

api.get(
  "/notifications-by-user/:id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  NotificationController.getNotificationByUser
);

api.get("/get-image-notification-file/:imageFile", NotificationController.getImageFile);

api.put(
  "/update-notification/:id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  NotificationController.UpdateNotification
);

api.get(
  "/notifications",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  NotificationController.getNotifications
);

api.get(
  "/notification/:id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  NotificationController.getNotification
);

api.delete(
  "/notification/:id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  NotificationController.DeleteNotification
);

module.exports = api;
