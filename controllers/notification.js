// Modelos
let Notification = require("../models/notification");

//FUNCIONANDO AL 100%

exports.getNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find().sort("title");
		return res.json(notifications);
	} catch (error) {
		console.error(error);
	}
};

exports.getNotification = async (req, res) => {
	try {
		var notificationId = req.params.id;
		Notification.findById(notificationId, (err, notifications) => {
			if (err) {
				res.status(500).send({message: "Error en la peticion"});
			} else {
				if (!notifications) {
					res.status(404).send({message: "La notificación no existe"});
				} else {
					res.status(200).send({notifications});
				}
			}
		});
	} catch (error) {
		console.error(error);
	}
};

exports.saveNotification = async (req, res) => {
	try {
		let notification = new Notification();
		let params = req.body;

		if (params.title && params.description) {
			notification.title = params.title;
			notification.description = params.description;
			notification.user = params.user;

			notification.save((err, notificationStored) => {
				if (err) {
					res.status(500).send({message: "Error al guardar la imagen"});
				} else {
					if (!notificationStored) {
						res
							.status(404)
							.send({message: "La notificación no ha sido guardada"});
					} else {
						res.status(200).send({notification: notificationStored});
					}
				}
			});
		}
	} catch (error) {
		console.error(error);
	}
};

exports.UpdateNotification = async (req, res) => {
	try {
		var notificationId = req.params.id;
		var update = req.body;

		Notification.findByIdAndUpdate(
			notificationId,
			update,
			(err, notificationUpdated) => {
				if (err) {
					res.status(500).send({message: "Error al actualizar la imagen"});
				} else {
					if (!notificationUpdated) {
						res
							.status(404)
							.send({message: "La notificación no ha sido actualizada"});
					} else {
						res.status(200).send({notification: notificationUpdated});
					}
				}
			}
		);
	} catch (error) {
		console.error(error);
	}
};

exports.DeleteNotification = async (req, res) => {
	try {
		var notificationId = req.params.id;

		Notification.findByIdAndRemove(
			notificationId,
			(err, notificationRemoved) => {
				if (err) {
					res.status(500).send({message: "Error al eliminar la notificación"});
				} else {
					if (!notificationRemoved) {
						res
							.status(404)
							.send({message: "La notificación no ha sido eliminada"});
					} else {
						res.status(404).send({notificationRemoved});
					}
				}
			}
		);
	} catch (error) {
		console.error(error);
	}
};

exports.enviarNotificacion = async (req, res) => {
	const pushSubscription = {
		endpoint:
			"https://updates.push.services.mozilla.com/wpush/v2/gAAAAABgZQ6sUOj4xCTyLX9EXMZD1McmKPgq5HPISzzyapF4Up_0-sEjsH2nf4ipfq_6h5Nxcxj_sa3JdRZpGzk-eQ996WxH8o-Yuds8U4uYK3qFGvcv6alRLUB1PsUH9F0d8Vgtj49BcpbBGAjFfuAbegj6IuSCcfMF6XJPBe8s2yk9VQC3Fmg",
		keys: {
			auth: "Hm5oU-Fr7es5HwANyAnTYg",
			p256dh:
				"BJnAWgyEMrjeRhtojGeEbUpDs166HfikgxfQaHTBvu61qbZXnuWtG7L4qi5XokWucFnTzocJvPvC6tjAZZqlQcI",
		},
	};

	webpush.sendNotification(pushSubscription, "Your Push Payload Text");
};
