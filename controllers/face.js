// Modelos
let Face = require("../models/face");
var fs = require("fs");
var path = require("path");

//FUNCIONANDO AL 100%

exports.getFaces = async (req, res) => {
  try {
    const faces = await Face.find().sort("name");
    return res.json(faces);
  } catch (error) {
    console.error(error);
  }
};

exports.getFaceByConfidenceLevel = async (req, res) => {
  try {
    var confidenceLevelId = req.params.id;
    const faces = await Face.find({ confidenceLevels: confidenceLevelId }).sort(
      "name"
    );
    return res.json(faces);
  } catch (error) {
    console.error(error);
  }
};

exports.getFaceByUser = async (req, res) => {
  try {
    var user = req.params.id;
    const faces = await Face.find({ user }).sort("name");
    return res.json(faces);
  } catch (error) {
    console.error(error);
  }
};

exports.getFace = async (req, res) => {
  try {
    var faceId = req.params.id;
    Face.findById(faceId, (err, faces) => {
      if (err) {
        res.status(500).send({ message: "Error en la peticion" });
      } else {
        if (!faces) {
          res.status(404).send({ message: "La cara de la persona no existe" });
        } else {
          res.status(200).send({ faces });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

exports.guardarFace = async (req, res) => {
  try {
    let face = new Face();
    let params = req.body;
    if (params.name && params.surname && params.age && params.gender) {
      face.name = params.name;
      face.surname = params.surname;
      face.age = params.age;
      face.gender = params.gender;
      face.image = null;
      face.unknown = params.unknown;
      face.confidenceLevels = params.confidenceLevels;
      face.user = params.user;

      face.save((err, faceStored) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error al guardar la cara de la persona" });
        } else {
          if (!faceStored) {
            res
              .status(404)
              .send({ message: "La cara de la persona no ha sido guardada" });
          } else {
            res.status(200).send({ face: faceStored });
            console.log(faceStored);
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.UpdateFace = async (req, res) => {
  try {
    var faceId = req.params.id;
    var update = req.body;

    Face.findByIdAndUpdate(faceId, update, (err, faceUpdated) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Error al actualizar la cara de la persona" });
      } else {
        if (!faceUpdated) {
          res
            .status(404)
            .send({ message: "La cara de la persona no ha sido actualizada" });
        } else {
          res.status(200).send({ face: faceUpdated });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

exports.DeleteFace = async (req, res) => {
  try {
    var faceId = req.params.id;

    Face.findByIdAndRemove(faceId, (err, faceRemoved) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Error al eliminar la cara de la persona" });
      } else {
        if (!faceRemoved) {
          res
            .status(404)
            .send({ message: "La cara de la persona no ha sido eliminada" });
        } else {
          res.status(200).send({ faceRemoved });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

exports.UploadImage = async (req, res) => {
  var faceId = req.params.id;
  var file_name = "No subido...";

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split("\\");
    var file_name = file_split[2];

    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];

    if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
      Face.findByIdAndUpdate(
        faceId,
        { image: file_name },
        { new: true },
        (err, faceUpdated) => {
          if (err) {
            res
              .status(500)
              .send({ message: "Error al actualizar la cara de la persona" });
          } else {
            if (!faceUpdated) {
              res.status(404).send({
                message: "No se ha podido actualizar la cara de la persona",
              });
            } else {
              res.status(200).send({ face: faceUpdated, image: file_name });
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
};

exports.GetImageFile = async (req, res) => {
  var imageFile = req.params.imageFile;
  var path_file = "./uploads/face/" + imageFile;

  fs.access(path_file, fs.constants.F_OK, (err) => {
    if (!err) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: "La imagen no existe en el servidor" });
    }
  });
};
