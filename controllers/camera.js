// Modelos
let Camera = require("../models/camera");
let UserCamera = require("../models/user_camara");
let User = require("../models/user");
let collaboratorController = require("../controllers/collaborator");
exports.getCameras = async(req, res) => {
    try {
        const cameras = await Camera.find().sort("name");
        return res.json(cameras);
    } catch (error) {
        console.error(error);
    }
};

exports.getCamera = async(req, res) => {
    try {
        //var cameraId = req.params.id;
        var cameraId = req.params ? req.params.id : req.body.id;
        Camera.findById(cameraId)
            .then((camera) => {
                if (req.params) {
                    res.json(camera);
                } else if (req.body.id) {
                    return camera;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (error) {
        console.error(error);
    }
};

exports.saveCamera = async(req, res) => {
    try {
        let camera = new Camera();
        let params = req.body;

        camera.name = params.name;
        camera.flash = params.flash;
        camera.power = params.power;
        camera.turn_screen = params.turn_screen;

        camera.save((err, cameraStored) => {
            if (!cameraStored) {
                res.status(404).send({ message: "La camara no ha sido guardada" });
            } else {
                User.findOne({ _id: params.administratorId }, (err, userExists) => {
                    if (userExists) {
                        collaboratorController
                            .getCollaboratorsByAdministrator({
                                body: { UserAdmin: params.administratorId },
                            })
                            .then((collaborators) => {

                                if (collaborators.length > 0) {
                                    collaborators.filter(function(collaborator) {
                                        if (collaborator !== null) {
                                            let user_camera = new UserCamera();
                                            user_camera.cameraId = cameraStored._id;
                                            user_camera.UserAdmin = params.administratorId;
                                            user_camera.UserCollaborator = collaborator._id;
                                            user_camera.save();
                                        }
                                    });
                                } else {
                                    let user_camera = new UserCamera();
                                    user_camera.cameraId = cameraStored._id;
                                    user_camera.UserAdmin = params.administratorId;
                                    user_camera.UserCollaborator = null;
                                    user_camera.save();
                                    console.log(`Cámara creada con exito`);
                                }
                            });
                    } else {
                        res.status(404).send({ message: "El administrador no existe" });
                    }
                });
            }
        });
    } catch (error) {
        console.error(error);
    }
};

exports.UpdateCamera = async(req, res) => {
    try {
        var cameraId = req.params.id;
        var update = req.body;

        Camera.findByIdAndUpdate(cameraId, update, (err, cameraUpdated) => {
            if (err) {
                res.status(500).send({ message: "Error al actualizar la camara" });
            } else {
                if (!cameraUpdated) {
                    res.status(404).send({ message: "La camara no ha sido actualizada" });
                } else {
                    res.status(200).send({ camera: cameraUpdated });
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
};

exports.DeleteCamera = async(req, res) => {
    try {
        var cameraId = req.params.id;

        const collaborators = await UserCamera.find({ cameraId: cameraId });

        for (const collaborator of collaborators) {
            if (collaborator.UserCollaborator !== null) {
                await UserCamera.deleteOne({ UserCollaborator: collaborator.UserCollaborator });
            }
        }

        await Camera.deleteOne({ _id: cameraId });

        res.status(200).send({ "message": "Camara eliminada exitosamente" });

    } catch (error) {
        res.status(500).send({ "message": "Error eliminando camara" });
    }
};