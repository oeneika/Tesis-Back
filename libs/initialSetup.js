let Role = require("../models/role");
let ConfidenceLevel = require("../models/confidenceLevels");

const createRoles = async () => {
	try {
		const count = await Role.estimatedDocumentCount();
		if (count > 0) return;

		const value = await Promise.all([
			new Role({name: "collaborator"}).save(),
			new Role({name: "admin"}).save(),
		]);

		console.log(value);
	} catch (error) {
		console.log(error);
	}
};

const createConfidenceLevel = async () =>{
	try {
		await Promise.all([

			new ConfidenceLevel({ 
				title: "Nivel 1", 
				description:"personas de confianza extrema como familiares y mejores amigos."})
				.save(),

			new ConfidenceLevel({ 
				title: "Nivel 2", 
				description:"personas conocidas que frecuentan los alrededores del recinto como personal de aseo, vecinos del mismo piso, etc."}).save(),

			new ConfidenceLevel({ 
				title: "Nivel 3", 
				description:`personas totalmente desconocidas pero no son consideradas como una amenaza.`})
				.save(),
				
			new ConfidenceLevel({ 
				title: "Nivel 4", 
				description:"personas que son consideradas una amenaza y no son permitidas en el recinto."})
				.save()
		]);
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	createRoles,
	createConfidenceLevel
};
