// Modelos
let FaceImage = require("../models/face_image");
let moment = require("moment");

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

      faceImage.save((err, imageStored) => {
        if (err) {
          res.status(500).send({ message: "Error al guardar la imagen" });
        } else {
          if (!imageStored) {
            res.status(404).send({ message: "La imagen no ha sido guardada" });
          } else {
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
