// Modelos
let Image = require("../models/image");
var jwt = require("jwt-simple");
const moment = require("moment");
const path = require("path");
const fs = require("fs");

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort("name");
    return res.json(images);
  } catch (error) {
    console.error(error);
  }
  // try {
  // 	if (req.params.page) {
  // 		var page = req.params.page;
  // 	} else {
  // 		var page = 1;
  // 	}

  // 	var itemsPerPage = 3;

  // 	Image.find()
  // 		.sort("name")
  // 		.paginate(page, itemsPerPage, function (err, images, total) {
  // 			if (err) {
  // 				res.status(500).send({message: "Error en la peticion"});
  // 			} else {
  // 				if (!images) {
  // 					res.status(404).send({message: "No hay imagenes"});
  // 				} else {
  // 					return res.status(200).send({total_items: total, images: images});
  // 				}
  // 			}
  // 		});
  // } catch (error) {
  // 	console.error(error);
  // }
};

exports.getImage = async (req, res) => {
  try {
    var imageId = req.params.id;
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).send({ message: "La imagen no existe" });
    }
    const pathImagen = path.join(__dirname, "../imagenes", image.file);
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  } catch (error) {
    console.error(error);
  }
};

const subirArchivo = (files, extensionesValidas = ["jpg", "png"], name) => {
  return new Promise((resolve, reject) => {
    const { imagen } = files;

    const nombreCortado = imagen.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extension
    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida - ${extensionesValidas}`
      );
    }

    const uploadPath = path.join(__dirname, "../imagenes/", name);

    imagen.mv(uploadPath, (err) => {
      if (err) {
        console.log("err: ", err);
        reject(err);
      }

      resolve({ nombre: name, size: imagen.size });
    });
  });
};

exports.saveImage = async (req, res) => {
  try {
    let image = new Image();

    let params = req.body;
    console.log(req.body, req.files);
    const token = req.headers.authorization;
    // const decoded = jwt.decode(
    //     token,
    //     "clave_secreta_del_curso_de_angular4avanzado"
    // );

    if (params.name) {
      let nameOfImage = params.name;
      // decoded.sub + params.name + "fecha-" + moment().format();
      const regex = /:/g;
      const newName = nameOfImage.replace(regex, "-");
      const { nombre } = await subirArchivo(req.files, undefined, newName);
      image.name = params.name;
      image.file = nombre;
      image.camera = params.camera;
      image.save((err, imageStored) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error al guardar la imagen: " + err });
        } else {
          if (!imageStored) {
            res.status(404).send({ message: "La imagen no ha sido guardada" });
          } else {
            res.status(200).send({ image: imageStored });
          }
        }
      });
    } else {
      res.json({ message: "El nombre es requerido" });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.UpdateImage = async (req, res) => {
  try {
    var imageId = req.params.id;
    var update = req.body;

    Image.findByIdAndUpdate(imageId, update, (err, imageUpdated) => {
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
