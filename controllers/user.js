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
const user = require("../models/user");
const twofactor = require("node-2fa");

const saveUser = async(req, res) => {
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
                            res.status(404).send({ message: "no se ha registrado el usuario" });
                        } else {
                            return res.status(200).send({
                                token: jwt.createToken(userStored),
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

const verificationCode = async(req, res) => {
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

const setAuthentication = async(req, res) => {
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

const login = async(req, res) => {
    try {
        var params = req.body;
        var email = params.email;
        var password = params.password;
        // .toLowerCase()
        User.findOne({ email: email }, (err, user) => {
            if (err) {
                res.status(500).send({
                    message: "error al comprobar el usuario",
                });
            } else {
                // comprobaci??n de si nos llega un usuario
                if (user) {
                    // si existe el usuario lo devuelve
                    console.log(password, user.password);
                    if (bcrypt.compare(password, user.password)) {
                        if (params.getToken) {
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
                            message: "Contrase??a incorrecta, no ha podido loguearse",
                        });
                    }
                    // bcrypt.compare(password, user.password, (err, check) => {
                    // 	// Comprobaci??n de contrase??a
                    // 	console.log(check)
                    // 	if (check) {
                    // 		// contrase??a correcta
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
                    // 		// contrase??a incorrecta
                    // 		res.status(404).send({
                    // 			message: "Contrase??a incorrecta, no ha podido loguearse",
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

const updateUser = async(req, res) => {
    try {
        var userId = req.params.id;
        var update = req.body;

        if (userId != req.user.sub) {
            return res.status(500).send({ message: "Es otro usuario al logueado" });
        }

        User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
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
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = "No subido...";

    if (req.files) {
        console.log('webo', req.files)
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
                userId, { image: file_name }, { new: true },
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
                        message: "La extensi??n de la imagen no es v??lida y fichero no borrado",
                    });
                } else {
                    res.status(200).send({
                        message: "La extensi??n de la imagen no es v??lida, fichero borrado.",
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



const getUserToken = async(req, res) => {
    try {
        const user = await User.findById(req.user.sub).select("-password");
        console.log(user);
        if (user) {
            return res.status(200).send({ user, message: "Autenticado" });
        } else {
            res.status(404).send({ message: "El usuario no est?? autenticado" });
        }
    } catch (error) {
        res.status(500).send({ message: "Error en la peticion" });
    }
};

const getUser = async(req, res) => {
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

const forgotPassword = async(req, res) => {
    var params = req.body;
    var email = params.email;

    if (!email) {
        res.status(404).send({ message: "El email es obligatorio" });
    }

    var usuario = new User();

    const message = "Revisa tu correo electronico";
    let verificationLink;
    let emailStatus = "Ok";

    try {
        usuario = User.findOne({ email: user.email.toLowerCase() });
        usuario.resetToken = jwt.createToken(usuario);
        verificationLink = `https://localhost:3000/new-password/${jwt.createToken(
			usuario
		)}`;
    } catch (error) {}

    //ENVIO POR CORREO
    try {} catch (error) {}

    try {
        await usuario.save();
    } catch (error) {
        res.status(404).send({ message: "Hubo un error!" });
    }

    res.status(200).send({ message, info: emailStatus });
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
};