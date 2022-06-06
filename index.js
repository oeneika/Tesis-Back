"use strict";
require('dotenv').config();
var mongoose = require("mongoose");
var app = require("./app");
const port = process.env.PORT || 8000;

var url = process.env.MONGO_CONNECTION
const connectionParams={
    useNewUrlParser: true,
	useCreateIndex: true,
    useUnifiedTopology: true 
}

mongoose.Promise = global.Promise;
mongoose
	.connect(url,connectionParams)
	.then(() => {
		console.log("Conexión a la bd correcta");
		// Creamos el servidor http
		app.listen(port, () => {
			console.log("Servidor corriendo en: " + port);
		});
	})
	.catch((error) => console.log(error));
