"use strict";

var express = require("express");
var ImageController = require("../controllers/image");

// Router de express
var api = express.Router();
const md_auth = require("../middleware/authenticated");
const md_auth_admin = require("../middleware/is_admin");

var { check } = require("express-validator");

api.post(
  "/image",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  ImageController.saveImage
);

api.put(
  "/update-image/:id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  ImageController.UpdateImage
);

api.get(
  "/get-images",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  ImageController.getImages
);

api.get(
  "/get-image/:id",
  ImageController.getImage
);

api.delete(
  "/image/:id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  ImageController.DeleteImage
);

module.exports = api;
