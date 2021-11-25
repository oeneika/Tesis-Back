// Modelos
let Image = require("../models/image");

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
    var imagesId = req.params.id;
    Image.findById(imagesId, (err, images) => {
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

exports.saveImage = async (req, res) => {
  try {
    let image = new Image();
    let params = req.body;

    if (params.name && params.url && params.size) {
      image.name = params.name;
      image.url = params.url;
      image.size = params.size;
      image.video = params.video;

      image.save((err, imageStored) => {
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
