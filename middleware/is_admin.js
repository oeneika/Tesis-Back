"use strict";
// Modelos
let User = require("../models/user");
let Role = require("../models/role");

const isAdmin = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.sub);
		const roles = await Role.find({_id: {$in: user.roles}});

		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === "admin") {
				next();
				return;
			}
		}

		return res.status(403).json({message: "Require Admin Role!"});
	} catch (error) {
		console.log(error);
		return res.status(500).send({message: error});
	}
};

module.exports = {
	isAdmin,
};
