"use strict";

var express = require("express");
var FaceCameraController = require("../controllers/face_camera");

// Router de express
var api = express.Router();
const md_auth = require("../middleware/authenticated");
const md_auth_admin = require("../middleware/is_admin");

var { check } = require("express-validator");

api.get(
  "/get-faces-by-camara-and-date/:camera_id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  FaceCameraController.getFaceByCameraAndDate
);

module.exports = api;
