"use strict";

var express = require("express");
var FaceImageController = require("../controllers/face_image");

// Router de express
var api = express.Router();
const md_auth = require("../middleware/authenticated");
const md_auth_admin = require("../middleware/is_admin");

var { check } = require("express-validator");

api.post(
  "/face-image",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  FaceImageController.saveFaceImage
);

api.put(
  "/update-face-image/:id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  FaceImageController.UpdateFaceImage
);

api.get(
  "/get-face-images",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  FaceImageController.getFaceImages
);

api.get(
  "/get-face-image",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  FaceImageController.getFaceImage
);

api.delete(
  "/face-image/:id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  FaceImageController.DeleteImage
);

module.exports = api;
