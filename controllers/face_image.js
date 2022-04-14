// Modelos
let FaceImage = require("../models/face_image");
let Notification = require("../models/notification");
let ImageModel = require("../models/image");
let FaceModel = require("../models/face");
let moment = require("moment");
var jwt = require("jwt-simple");
const path = require("path");
const fs = require("fs");

exports.getFaceImages = async (req, res) => {
  try {
    const faceImages = await FaceImage.find().sort("facialExpression");
    return res.json(faceImages);
  } catch (error) {
    console.error(error);
  }
};

exports.getFaceImage = async (req, res) => {
  try {
    var faceImageId = req.params.id;
    FaceImage.findById(faceImageId, (err, images) => {
      if (err) {
        res.status(500).send({ message: "Error en la peticion" });
      } else {
        if (!images) {
          res.status(404).send({ message: "La imagen no existe" });
        } else {
          res.status(200).send({ images });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const subirArchivo = (files, extensionesValidas = ["jpg", "png"], name) => {
  console.log(files, name);
  return new Promise((resolve, reject) => {
    const { imagen } = files;
    console.log(imagen);
    const nombreCortado = imagen.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extension
    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida - ${extensionesValidas}`
      );
    }

    const nombreTemp = name + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/face", nombreTemp);

    imagen.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve({ nombre: nombreTemp, size: imagen.size });
    });
  });
};

saveNotification = async (faceId, req, imageId) => {
  try {
    const face = await FaceModel.findById(faceId);
    const image = await ImageModel.findById(imageId);

    let cameraId = image.camera;
    const token = req.headers.authorization;
    const decoded = jwt.decode(
      token,
      "clave_secreta_del_curso_de_angular4avanzado"
    );
    let notification = new Notification();

    if (face.age && face.gender && cameraId && face.user) {
      let nameOfImage = decoded.sub + cameraId + "fecha-" + moment().format();
      const regex = /:/g;
      const newName = nameOfImage.replace(regex, "-");
      const { nombre } = await subirArchivo(req.files, undefined, newName);

      notification.hour = moment(new Date());
      notification.age = face.age;
      notification.gender = face.gender;
      notification.facialExpression = req.body.facialExpression;
      notification.camera = cameraId;
      notification.user = face.user;
      notification.seen = false;

      notification.file = nombre;
      notification.save((err, notificationStored) => {
        if (err) {
          console.log({ message: "Error al guardar la imagen" });
        } else {
          if (!notificationStored) {
            console.log({ message: "La notificación no ha sido guardada" });
          } else {
            console.log({ notification: notificationStored });
          }
        }
      });
    } else {
      console.log({ error: "faltan campos por enviar" });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.saveFaceImage = async (req, res) => {
  try {
    let faceImage = new FaceImage();
    let params = req.body;
    let currentDate = moment().format("DD-MM-YYYY");

    if (params.facialExpression) {
      faceImage.facialExpression = params.facialExpression;
      faceImage.face = params.face;
      faceImage.image = params.image;
      faceImage.moment = moment(currentDate, "DD-MM-YYYY").toDate();

      faceImage.save(async (err, imageStored) => {
        if (err) {
          res.status(500).send({ message: "Error al guardar la imagen" });
        } else {
          if (!imageStored) {
            res.status(404).send({ message: "La imagen no ha sido guardada" });
          } else {
            await saveNotification(faceImage.face, req, faceImage.image);
            res.status(200).send({ image: imageStored });
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.UpdateFaceImage = async (req, res) => {
  try {
    var faceImageId = req.params.id;
    var update = req.body;

    FaceImage.findByIdAndUpdate(faceImageId, update, (err, imageUpdated) => {
      if (err) {
        res.status(500).send({ message: "Error al actualizar la imagen" });
      } else {
        if (!imageUpdated) {
          res.status(404).send({ message: "La imagen no ha sido actualizada" });
        } else {
          res.status(200).send({ image: imageUpdated });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

exports.DeleteImage = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
  }
};
