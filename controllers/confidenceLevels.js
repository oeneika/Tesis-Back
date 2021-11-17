// Modelos
let ConfidenceLevels = require("../models/confidenceLevels");

exports.getConfidenceLevels = async (req, res) => {
	try {
		const confidenceLevels = await ConfidenceLevels.find().sort("title");
		return res.json(confidenceLevels);
	} catch (error) {
		console.error(error);
	}
};

exports.getConfidenceLevel = async (req, res) => {
	try {
		var confidenceLevelId = req.params.id;
		ConfidenceLevels.findById(confidenceLevelId, (err, confidenceLevels) => {
			if (err) {
				res.status(500).send({message: "Error en la peticion"});
			} else {
				if (!confidenceLevels) {
					res.status(404).send({message: "El nivel de confianza no existe"});
				} else {
					res.status(200).send({confidenceLevels});
				}
			}
		});
	} catch (error) {
		console.error(error);
	}
};

exports.saveConfidenceLevel = async (req, res) => {
	try {
		let confidenceLevel = new ConfidenceLevels();
		let params = req.body;

		if (params.title && params.description) {
			confidenceLevel.title = params.title;
			confidenceLevel.description = params.description;

			confidenceLevel.save((err, confidenceLevelStored) => {
				if (err) {
					res
						.status(500)
						.send({message: "Error al guardar el nivel de confianza"});
				} else {
					if (!confidenceLevelStored) {
						res
							.status(404)
							.send({message: "El nivel de confianza no ha sido guardado"});
					} else {
						res.status(200).send({confidenceLevel: confidenceLevelStored});
					}
				}
			});
		}
	} catch (error) {
		console.error(error);
	}
};

exports.UpdateConfidenceLevel = async (req, res) => {
	try {
		var confidenceLevelId = req.params.id;
		var update = req.body;

		ConfidenceLevels.findByIdAndUpdate(
			confidenceLevelId,
			update,
			(err, confidenceLevelUpdated) => {
				if (err) {
					res
						.status(500)
						.send({message: "Error al actualizar el nivel de confianza"});
				} else {
					if (!confidenceLevelUpdated) {
						res
							.status(404)
							.send({message: "El nivel de confianza no ha sido actualizado"});
					} else {
						res.status(200).send({confidenceLevel: confidenceLevelUpdated});
					}
				}
			}
		);
	} catch (error) {
		console.error(error);
	}
};

exports.DeleteConfidenceLevel = async (req, res) => {
	try {
	} catch (error) {
		console.error(error);
	}
};
