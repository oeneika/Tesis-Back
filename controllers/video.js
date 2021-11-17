// Modelos
let Video = require("../models/video");

exports.getVideos = async (req, res) => {
	try {
		if (req.params.page) {
			var page = req.params.page;
		} else {
			var page = 1;
		}

		var itemsPerPage = 3;

		Video.find()
			.sort("name")
			.paginate(page, itemsPerPage, function (err, videos, total) {
				if (err) {
					res.status(500).send({message: "Error en la peticion"});
				} else {
					if (!videos) {
						res.status(404).send({message: "No hay videos"});
					} else {
						return res.status(200).send({total_items: total, videos: videos});
					}
				}
			});
	} catch (error) {
		console.error(error);
	}
};

exports.getVideo = async (req, res) => {
	try {
		var cameraId = req.params.id;
		Video.findById(videoId, (err, video) => {
			if (err) {
				res.status(500).send({message: "Error en la peticion"});
			} else {
				if (!video) {
					res.status(404).send({message: "El video no existe"});
				} else {
					res.status(200).send({video});
				}
			}
		});
	} catch (error) {
		console.error(error);
	}
};

exports.saveVideo = async (req, res) => {
	try {
		let video = new Video();
		let params = req.body;

		if (
			params.name &&
			params.moment_ini &&
			params.moment_final &&
			params.url &&
			params.size &&
			params.quality
		) {
			video.name = params.name;
			video.moment_ini = params.moment_ini;
			video.moment_final = params.moment_final;
			video.url = params.url;
			video.size = params.size;
			video.quality = params.quality;
			video.camera = params.camera;

			video.save((err, videoStored) => {
				if (err) {
					res.status(500).send({message: "Error al guardar la video"});
				} else {
					if (!videoStored) {
						res.status(404).send({message: "La video no ha sido guardada"});
					} else {
						res.status(200).send({video: videoStored});
					}
				}
			});
		}
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
				res.status(500).send({message: "Error al actualizar el video"});
			} else {
				if (!videoUpdated) {
					res.status(404).send({message: "El video no ha sido actualizado"});
				} else {
					res.status(200).send({video: videoUpdated});
				}
			}
		});
	} catch (error) {
		console.error(error);
	}
};

exports.DeleteVideo = async (req, res) => {
	try {
	} catch (error) {
		console.error(error);
	}
};
