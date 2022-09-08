"use strict";

var express = require("express");
var UserController = require("../controllers/user");
var CollaboratorController = require("../controllers/collaborator");

// Router de express
var api = express.Router();
const md_auth = require("../middleware/authenticated");
const md_auth_admin = require("../middleware/is_admin");
const md_auth_collaborator = require("../middleware/is_collaborator");

//var multipart = require("connect-multiparty");
//var md_upload = multipart({ uploadDir: "./uploads/users" });

var { check } = require("express-validator");

// Protegemos la ruta con autenticación para ver si el usuario está logueado (md_auth.ensureAuth)
api.post("/register", UserController.saveUser);
api.post("/login", UserController.login);
api.post("/verify", UserController.verificationCode);
api.put(
  "/update-user/:id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  UserController.updateUser
);
api.get("/get-user/:id", [md_auth.ensureAuth], UserController.getUser);
api.post(
  "/upload-image-user/:id",
  [md_auth.ensureAuth],
  UserController.uploadImage
);
api.get("/get-image-file/:imageFile", UserController.getImageFile);
api.get("/auth-user", md_auth.ensureAuth, UserController.getUserToken);
api.put("/forgot-password", UserController.forgotPassword);
api.put(
  "/set-authentication/:id",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  UserController.setAuthentication
);
api.post(
  "/save-collaborator",
  [md_auth.ensureAuth, md_auth_admin.isAdmin],
  CollaboratorController.createCollaborator
);
api.put("/update-verification-email", UserController.updateVerificationEmail);
api.post("/changePasswordByEmail", UserController.changePasswordByEmail);

module.exports = api;
