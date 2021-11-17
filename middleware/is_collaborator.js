"use strict";
// Modelos
let User = require("../models/user");
let Role = require("../models/role");

const isCollaborator = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.sub);
		const roles = await Role.find({_id: {$in: user.roles}});

		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === "collaborator") {
				next();
				return;
			}
		}

		return res.status(403).json({message: "Require Collaborator Role!"});
	} catch (error) {
		console.log(error);
		return res.status(500).send({message: error});
	}
};

module.exports = {
	isCollaborator,
};
