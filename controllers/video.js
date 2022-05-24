// Modelos
let Video = require("../models/video");
const path = require("path");
var jwt = require("jwt-simple");
const moment = require("moment");
const { getVideoDurationInSeconds } = require("get-video-duration");
let UserCamera = require("../models/user_camara");
const fs = require("fs");

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort("name");
    return res.json(videos);
  } catch (error) {
    console.error(error);
  }
};

exports.getVideosByUser = async (req, res) => {
  try {
    let userId = req.params.id;
    const cameras = await UserCamera.find({
      UserAdmin: userId,
    })
      .sort("name")
      .populate("cameraId");
    const camerasId = cameras.map((elem) => elem.cameraId._id);
    const videos = await Video.find()
      .sort("name")
      .populate({ path: "camera" })
      .where("camera")
      .in(camerasId);

    return res.json(videos);
  } catch (error) {
    console.error(error);
  }
};

exports.getVideo = async (req, res) => {
  try {
    var videoId = req.params.id;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).send({ message: "El video no existe" });
    }
    const pathVideo = path.join(__dirname, "../videos", video.file);
    if (fs.existsSync(pathVideo)) {
      return res.sendFile(pathVideo);
    }
  } catch (error) {
    console.error(error);
  }
};

const subirArchivo = (files, extensionesValidas = ["mp4"], name) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    console.log('archivo ', file)
    const nombreCortado = file.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extension
    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida - ${extensionesValidas}`
      );
    }

    const nombreTemp = name + "." + extension;
    const uploadPath = path.join(__dirname, "../videos/", nombreTemp);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve({ nombre: nombreTemp, size: file.size });
    });
  });
};

exports.saveVideo = async (req, res) => {
  try {
    let video = new Video();
    let params = req.body;
    const token = req.headers.authorization;

    // const decoded = jwt.decode(
    //   token,
    //   "clave_secreta_del_curso_de_angular4avanzado"
    // );

    var nameOfVideo =
      params.camera + "fecha-" + moment().format();
    const regex = /:/g;
    const newName = nameOfVideo.replace(regex, "-");

    video.name = newName;

    const { nombre, size } = await subirArchivo(req.files, undefined, newName);
    video.size = size;
    video.camera = params.camera;
    video.file = nombre;
    const pathVideo = path.join(__dirname, `../videos/${nombre}`);

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

exports.getVideoFile = async (req, res) => {
  var videoFile = req.params.videoFile;

  var path_file = "./videos/" + videoFile;

  fs.access(path_file, fs.constants.F_OK, (err) => {
    if (!err) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: "La imagen no existe en el servidor" });
    }
  });
};
