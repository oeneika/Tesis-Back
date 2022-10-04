"use strict";

// Modulos
var bcrypt = require("bcryptjs");
var fs = require("fs");
var path = require("path");

// Modelos
let User = require("../models/user");
let Role = require("../models/role");

// Servicio JWT
var jwt = require("../services/jwt");
var jsonwt = require("jwt-simple");
const user = require("../models/user");
const twofactor = require("node-2fa");
const { sendMail } = require("../services/mails");
const { forgotPasswordHtml, welcomeHtml } = require("../services/textMails");

const saveUser = async (req, res) => {
  try {
    var user = new User();
    var params = req.body;

    if (params.password && params.name && params.surname && params.email) {
      user.name = params.name;
      user.surname = params.surname;
      user.email = params.email;
      user.image = null;
      user.birthday = null;
      user.country = null;
      user.hasTwoStepsAuth = false;
      user.hasSetTwoSteps = false;

      const role = await Role.findOne({ name: "admin" });
      user.roles = [role._id];

      //Crear una  clave temporal
      //const temp_secret = speakeasy.generateSecret();
      const temp_secret = twofactor.generateSecret({
        name: "Sistema de videovigilancia",
        account: "Authenthicator",
      });

      user.temp_secreto = temp_secret;

      User.findOne({ email: user.email.toLowerCase() }, (err, issetUser) => {
        if (!issetUser) {
          const hash = bcrypt.hashSync(params.password, 10);
          user.password = hash;
          user.save((err, userStored) => {
            if (!userStored) {
              res
                .status(404)
                .send({ message: "no se ha registrado el usuario" });
            } else {
              let token = jwt.createToken(userStored);
              let verificationLink = `${process.env.FRONT_END_ORIGIN}/#/active-account/${token}`;
              sendMail({
                email: userStored.email,
                html: welcomeHtml(verificationLink),
                subject: "Verifica tu cuenta",
              });
              return res.status(200).send({
                token: token,
                secret: userStored.temp_secreto,
                id: userStored._id,
                hasTwoStepsAuth: userStored.hasTwoStepsAuth,
                hasSetTwoSteps: userStored.hasSetTwoSteps,
              });
            }
          });
        } else {
          return res
            .status(404)
            .send({ message: "Usuario ya existe y no puede registrarse" });
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const verificationCode = async (req, res) => {
  var params = req.body;
  try {
    if (params.secret && params.token_secret) {
      const verified = twofactor.verifyToken(
        params.secret,
        params.token_secret
      );
      if (verified != null) {
        res.status(200).send({ message: "Usuario verificado" });
      } else {
        res.status(404).send({ message: "Usuario no verificado" });
      }
    } else {
      res
        .status(404)
        .send({ message: "Usuario no verificado: campos incorrectos" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user" });
  }
};

const setAuthentication = async (req, res) => {
  var authenticationId = req.params.id;
  var update = req.body;
  try {
    User.findByIdAndUpdate(
      authenticationId,
      update,
      (err, authenticationUpdated) => {
        if (err) {
          console.log(err);
          res.status(500).send({
            message: "Error al actualizar la autenticacion del usuario",
          });
        } else {
          if (!authenticationUpdated) {
            res.status(404).send({
              message: "La autenticacion del usuario no ha sido actualizada",
            });
          } else {
            res.status(200).send({ user: authenticationUpdated });
          }
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error 500" });
  }
};

const login = async (req, res) => {
  try {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    // .toLowerCase()
    console.log("adentro")
    User.findOne({ email: email }, async (err, user) => {
      if (err) {
        res.status(500).send({
          message: "error al comprobar el usuario",
        });
      } else {
        // comprobación de si nos llega un usuario
        if (user) {
          // si existe el usuario lo devuelve
          let compare = await bcrypt.compare(password, user.password)
          if (compare) {
            if (params.getToken) {
              console.log(params.getToken);
              // devolver el token
              res.status(200).send({
                token: jwt.createToken(user),
              });
            } else {
              res.status(200).send({
                token: jwt.createToken(user),
                id: user.id,
                secret: user.temp_secreto.secret || undefined,
                hasTwoStepsAuth: user.hasTwoStepsAuth,
                hasSetTwoSteps: user.hasSetTwoSteps,
              });
            }
          } else {
            res.status(404).send({
              message: "Contraseña incorrecta, no ha podido loguearse",
            });
          }
          // bcrypt.compare(password, user.password, (err, check) => {
          // 	// Comprobación de contraseña
          // 	console.log(check)
          // 	if (check) {
          // 		// contraseña correcta
          // 		// Comprobar y generar token JWT
          // 		if (params.getToken) {
          // 			// devolver el token
          // 			res.status(200).send({
          // 				token: jwt.createToken(user),
          // 			});
          // 		} else {
          // 			res.status(200).send({
          // 				token: jwt.createToken(user),
          // 				id: user.id,
          // 				secret: user.temp_secreto.secret,
          // 			});
          // 		}
          // 	} else {
          // 		// contraseña incorrecta
          // 		res.status(404).send({
          // 			message: "Contraseña incorrecta, no ha podido loguearse",
          // 		});
          // 	}
          // });
        } else {
          // El usuario no existe
          res
            .status(404)
            .send({ message: "Usuario no existe y no ha podido loguearse" });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  try {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
      return res.status(500).send({ message: "Es otro usuario al logueado" });
    }

    User.findByIdAndUpdate(
      userId,
      update,
      { new: true },
      (err, userUpdated) => {
        if (err) {
          res.status(500).send({ message: "Error al actualizar usuario" });
        } else {
          if (!userUpdated) {
            res
              .status(404)
              .send({ message: "No se ha podido actualizar el usuario" });
          } else {
            res.status(200).send({
              userUpdated,
            });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

function uploadImage(req, res) {
  var userId = req.params.id;
  var file_name = "No subido...";

  if (req.files) {
    console.log("webo", req.files);
    var file_path = "uploads\\users\\" + req.files.image.name;
    var file_split = file_path.split("\\");
    var file_name = file_split[2];

    var ext_split = file_name.split(".");
    var file_ext = ext_split[1].toLowerCase();

    let sampleFile = req.files.image;
    let uploadPath = path.join(
      __dirname,
      `../uploads/users/`,
      req.files.image.name
    );

    if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
      if (userId != req.user.sub) {
        return res.status(500).send({ message: "Es otro usuario al logueado" });
      }

      User.findByIdAndUpdate(
        userId,
        { image: file_name },
        { new: true },
        (err, userUpdated) => {
          if (err) {
            res.status(500).send({ message: "Error al actualizar usuario" });
          } else {
            if (!userUpdated) {
              res
                .status(404)
                .send({ message: "No se ha podido actualizar el usuario" });
            } else {
              sampleFile.mv(uploadPath, function (err) {
                // if (err) return res.status(500).send(err);
                return res
                  .status(200)
                  .send({ user: userUpdated, image: file_name });
              });
            }
          }
        }
      );
    } else {
      fs.unlink(file_path, (err) => {
        if (err) {
          res.status(200).send({
            message:
              "La extensión de la imagen no es válida y fichero no borrado",
          });
        } else {
          res.status(200).send({
            message: "La extensión de la imagen no es válida, fichero borrado.",
          });
        }
      });
    }
  } else {
    res.status(200).send({ message: "no se han subido ficheros " });
  }
}

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;

  var path_file = "./uploads/users/" + imageFile;

  fs.access(path_file, fs.constants.F_OK, (err) => {
    if (!err) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: "La imagen no existe en el servidor" });
    }
  });
}

const getUserToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select("-password");
    console.log(user);
    if (user) {
      return res.status(200).send({ user, message: "Autenticado" });
    } else {
      res.status(404).send({ message: "El usuario no está autenticado" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error en la peticion" });
  }
};

const getUser = async (req, res) => {
  try {
    var userId = req.params.id;
    User.findById(userId, (err, user) => {
      if (err) {
        res.status(500).send({ message: "Error en la peticion" });
      } else {
        if (!user) {
          res.status(404).send({ message: "El usuario no existe" });
        } else {
          res.status(200).send({ user });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const forgotPassword = async (req, res) => {
  var email = req.body.email;

  if (!email) {
    return res.status(404).send({ message: "El email es obligatorio" });
  }

  const message = "Revisa tu correo electronico";
  let verificationLink;
  let emailStatus = "Ok";

  try {
    console.log("entro");
    let usuario = await User.findOne({ email: email.toLowerCase() });
    console.log(usuario);
    if (!usuario) {
      return res.status(400).json({ message: "El usuario no existe" });
    }
    const token = jwt.createToken(usuario);

    verificationLink = `${process.env.FRONT_END_ORIGIN}/#/recover-password/${token}`;
  } catch (error) {
    return res.send(error);
  }
  try {
    await sendMail({
      email: email,
      html: forgotPasswordHtml(verificationLink),
      subject: "Restablecer contraseña",
    });
    return res.json({ message: message, verificationLink });
  } catch (error) {
    console.log(error);
    return res.send("Error enviando el email");
  }
};
const updateVerificationEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const decoded = jsonwt.decode(
      token,
      "clave_secreta_del_curso_de_angular4avanzado"
    );
    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    user.verificationEmail = true;
    await user.save();

    return res.status(200).json({ ok: "ok", message: "Cambio exitoso" });
  } catch (error) {
    console.error(error);
  }
};
const changePasswordByEmail = async (req, res) => {
  try {
    const { password, repeatPassword, token } = req.body;
    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (password != repeatPassword) {
      return res.status(401).json({ message: "Las contraseñas no coinciden" });
    }
    const decoded = jsonwt.decode(
      token,
      "clave_secreta_del_curso_de_angular4avanzado"
    );
    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const hash = bcrypt.hashSync(password, 10);
    user.password = hash;
    await user.save();

    return res.status(200).json({ ok: "ok", message: "Cambio exitoso" });
  } catch (error) {
    console.error(error);
  }
};
module.exports = {
  saveUser,
  login,
  updateUser,
  getUser,
  uploadImage,
  getImageFile,
  getUserToken,
  forgotPassword,
  verificationCode,
  setAuthentication,
  changePasswordByEmail,
  updateVerificationEmail,
};
