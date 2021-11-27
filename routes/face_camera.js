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

api.get(
  "/get-faces-by-camara-and-day/:camera_id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  FaceCameraController.getFaceByCameraAndDay
);
api.get(
  "/get-faces-by-camara-and-week/:camera_id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  FaceCameraController.getFaceByCameraAndWeek
);
api.get(
  "/get-faces-by-camara-and-month/:camera_id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  FaceCameraController.getFaceByCameraAndMonth
);
module.exports = api;
