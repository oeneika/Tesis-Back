// Modelos
let UserCamera = require("../models/user_camara");
let Camera = require("../models/camera");
let User = require("../models/user")

exports.getCameraByAdministrator = async (req, res) => {
	try {
		var adminId = req.params ? req.params.id : req.body.UserAdmin;
		const cameras = await UserCamera.find({UserAdmin: adminId}).distinct(
			"cameraId"
		);
		if (req.params) {
			res.json(cameras);
		} else if (req.body.UserAdmin) {
			return cameras;
		}
	} catch (error) {
		console.error(error);
	}
};

exports.getCameraByCollaborator = async (req, res) => {
	try {
		var collaboratorId = req.params.id;
		const cameras = await UserCamera.find({
			UserCollaborator: collaboratorId,
		});
		let camerasObject = [];
		for (const camera of cameras) {
			const cam = await Camera.find({
				_id: camera.cameraId
			});
			camerasObject.push(cam);
		}
		return res.json(cameras);
	} catch (error) {
		console.error(error);
	}
};

exports.getCollaboratorByCamera = async (req, res) => {
	try {
		var cameraId = req.params.id;
		const collaborator = await UserCamera.find({
			cameraId: cameraId,
		});
		let collaboratos = [];
		for (const collaborato of collaborator) {
			if (collaborato.UserCollaborator !== null){
				const colla = await User.find({
					_id: collaborato.UserCollaborator
				});

				collaboratos.push(colla)
			}
		}
		return res.json(collaboratos);
	} catch (error) {
		console.error(error);
	}
};