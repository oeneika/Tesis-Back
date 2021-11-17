"use strict";

var express = require("express");
var FaceController = require("../controllers/face");

// Router de express
var api = express.Router();
const md_auth = require("../middleware/authenticated");
const md_auth_admin = require("../middleware/is_admin");

var {check} = require("express-validator");

var multipart = require("connect-multiparty");
var md_upload = multipart({uploadDir: "./uploads/face"});

api.post(
	"/save-face",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	FaceController.guardarFace
);

api.put(
	"/update-face/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	FaceController.UpdateFace
);

api.get(
	"/faces",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	FaceController.getFaces
);

api.get(
	"/face/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	FaceController.getFace
);

api.get(
	"/face-by-confidence-level/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	FaceController.getFaceByConfidenceLevel
);

api.get(
	"/face-by-user/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	FaceController.getFaceByUser
);

api.delete(
	"/face/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin],
	FaceController.DeleteFace
);

api.post(
	"/upload-image-face/:id",
	[md_auth.ensureAuth, md_auth_admin.isAdmin, md_upload],
	FaceController.UploadImage
);

api.get("/get-image-face/:imageFile", FaceController.GetImageFile);

module.exports = api;
