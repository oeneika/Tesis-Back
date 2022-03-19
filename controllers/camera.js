// Modelos
let Camera = require("../models/camera");
let UserCamera = require("../models/user_camara");
let User = require("../models/user");
//Ejemplo

exports.getCameras = async (req, res) => {
  try {
    const cameras = await Camera.find().populate("UserCamera").sort("name");
    return res.json(cameras);
  } catch (error) {
    console.error(error);
  }
};

exports.getCamerasByUser = async (req, res) => {
  try {
    let userId = req.params.id;
    const cameras = await UserCamera.find({ UserAdmin: userId })
      .sort("name")
      .populate("cameraId");
    return res.json(cameras);
  } catch (error) {
    console.error(error);
  }
};

exports.getCamera = async (req, res) => {
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

exports.saveCamera = async (req, res) => {
  try {
    let camera = new Camera();
    let params = req.body;

    camera.name = params.name ? params.name : "Cámara por defecto";

    camera.power = params.power ? params.power : true;
    camera.turn_screen = params.turn_screen ? params.turn_screen : true;

    if (!camera.name) {
      return res.status(400).json({ message: "el nombre es requerido" });
    }
    const user = await User.findOne({ _id: params.administratorId });
    if (!user) {
      return res.status(404).send({ message: "El administrador no existe" });
    } else {
      var adminId = params.administratorId;
      const collaborators = await UserCamera.find({
        UserAdmin: adminId,
      }).distinct("UserCollaborator");

      camera.save((err, cameraStored) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Error al guardar la cámara", err: err });
        } else {
          if (!cameraStored) {
            return res
              .status(404)
              .send({ message: "La cámara no ha sido guardada" });
          } else {
            let user_camera = new UserCamera();

            user_camera.cameraId = cameraStored._id;
            user_camera.UserAdmin = params.administratorId;
            user_camera.UserCollaborator = null;
            user_camera.save((err, userCameraStored) => {
              if (err) {
                return res.status(500).send({
                  message: "Error al guardar la userCamera",
                  err: err,
                });
              } else {
                console.log(userCameraStored);
                camera.user_camera = userCameraStored._id;
              }
            });

            return res.status(200).send(camera);
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.UpdateCamera = async (req, res) => {
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

exports.DeleteCamera = async (req, res) => {
  try {
    var cameraId = req.params.id;

    const collaborators = await UserCamera.find({ cameraId: cameraId });

    for (const collaborator of collaborators) {
      if (collaborator.UserCollaborator !== null) {
        await UserCamera.deleteOne({
          UserCollaborator: collaborator.UserCollaborator,
        });
      }
    }

    await Camera.deleteOne({ _id: cameraId });

    res.status(200).send({ message: "Camara eliminada exitosamente" });
  } catch (error) {
    res.status(500).send({ message: "Error eliminando camara" });
  }
};
