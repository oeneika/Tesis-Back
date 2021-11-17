"use strict";

// Modelos
var Role = require("../models/role");

exports.getRoles = async (req, res) => {
	// si uso find con un json vacío me devuelve todos.
	Role.find({})
		.populate({path: "user"})
		.exec((err, roles) => {
			if (err) {
				res.status(500).send({message: "Error en la petición"});
			} else {
				if (!roles) {
					res.status(404).send({message: "No hay roles"});
				} else {
					res.status(200).send({roles});
				}
			}
		});
};

exports.saveRole = async (req, res) => {
	try {
		var role = new Role();
		var params = req.body;

		if (params.name) {
			role.name = params.name;

			Role.findOne({name: role.name.toLowerCase()}, (err, issetRole) => {
				if (err) {
					res.status(500).send({message: "error al comprobar el rol"});
				} else {
					if (!issetRole) {
						role.save((err, roleStored) => {
							if (err) {
								res.status(500).send({message: "error al guardar el rol"});
							} else {
								if (!roleStored) {
									res.status(404).send({message: "no se ha registrado el rol"});
								} else {
									res.status(200).send({
										role: roleStored,
									});
								}
							}
						});
					} else {
						res
							.status(200)
							.send({message: "Rol ya existe y no puede registrarse"});
					}
				}
			});
		} else {
			res.status(200).send({message: "Introduce los datos del rol correctamente"});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};
