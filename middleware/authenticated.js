"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
const secret = "clave_secreta_del_curso_de_angular4avanzado";

exports.ensureAuth = function (req, res, next) {
	if (!req.headers.authorization) {
		return res
			.status(403)
			.send({message: "La petición no tiene la cabecera de autenticación"});
	}

	// sustituimos las comillas simples y dobles y las sustituya por "nada"
	var token = req.headers.authorization.replace(/['"]+/g, "");

	// Comprobamos si el token es válido decodificandolo
	try {
		var payload = jwt.decode(token, secret);

		// Comprobamos la validez de la fecha del token
		if (payload.exp <= moment().unix()) {
			return res.status(401).send({message: "El token ha expirado"});
		}
	} catch (ex) {
		return res.status(404).send({message: "El token no es válido"});
	}

	// Creo una nueva propiedad req.user en el request
	// que podré usar en todas las acciones de los controladores

	req.user = payload;

	next();
};
