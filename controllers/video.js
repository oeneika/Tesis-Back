// Modelos
let Video = require("../models/video");
const path = require("path");
var jwt = require("jwt-simple");
const moment = require("moment");
const { getVideoDurationInSeconds } = require("get-video-duration");

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort("name");
    return res.json(videos);
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

  // 	Video.find()
  // 		.sort("name")
  // 		.paginate(page, itemsPerPage, function (err, videos, total) {
  // 			if (err) {
  // 				res.status(500).send({message: "Error en la peticion"});
  // 			} else {
  // 				if (!videos) {
  // 					res.status(404).send({message: "No hay videos"});
  // 				} else {
  // 					return res.status(200).send({total_items: total, videos: videos});
  // 				}
  // 			}
  // 		});
  // } catch (error) {
  // 	console.error(error);
  // }
};

exports.getVideo = async (req, res) => {
  try {
    var videoId = req.params.id;
    Video.findById(videoId, (err, video) => {
      if (err) {
        res.status(500).send({ message: "Error en la peticion" });
      } else {
        if (!video) {
          res.status(404).send({ message: "El video no existe" });
        } else {
          res.status(200).send({ video });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const subirArchivo = (files, extensionesValidas = ["mp4"], name) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extension
    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida - ${extensionesValidas}`
      );
    }

    const nombreTemp = name + "." + extension;
    const uploadPath = path.join(__dirname, "../videos/", nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve({ nombre: nombreTemp, size: archivo.size });
    });
  });
};

exports.saveVideo = async (req, res) => {
  try {
    let video = new Video();
    let params = req.body;
    const token = req.headers.authorization;

    const decoded = jwt.decode(
      token,
      "clave_secreta_del_curso_de_angular4avanzado"
    );

    var nameOfVideo =
      decoded.sub + params.camera + "fecha-" + moment().format();
    const regex = /:/g;
    const newName = nameOfVideo.replace(regex, "-");

    video.name = newName;

    const { nombre, size } = await subirArchivo(
      req.files,
      undefined,
      video.name
    );
    video.size = size;
    video.camera = params.camera;
    video.videoName = nombre;
    const pathVideo = path.join(__dirname, `../videos/${nombre}`);

    await getVideoDurationInSeconds(pathVideo)
      .then((duration) => {
        video.duration = duration;
      })
      .catch((err) => {
        console.log(err);
      });

    video.save((err, videoStored) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Error al guardar la video", err: err });
      } else {
        if (!videoStored) {
          res.status(404).send({ message: "La video no ha sido guardada" });
        } else {
          res.status(200).send(video);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

exports.UpdateVideo = async (req, res) => {
  try {
    var videoId = req.params.id;
    var update = req.body;

    Video.findByIdAndUpdate(videoId, update, (err, videoUpdated) => {
      if (err) {
        res.status(500).send({ message: "Error al actualizar el video" });
      } else {
        if (!videoUpdated) {
          res.status(404).send({ message: "El video no ha sido actualizado" });
        } else {
          res.status(200).send({ video: videoUpdated });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

exports.DeleteVideo = async (req, res) => {
  try {
    var videoId = req.params.id;

    await Video.deleteOne({ _id: videoId });

    res.status(200).send({ message: "Video eliminado exitosamente" });
  } catch (error) {
    res.status(500).send({ message: "Error eliminando video" });
  }
};
