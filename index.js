"use strict";
require('dotenv').config();
var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 8000;

// Url de la base de datos a https://mlab.com/databases/zoo
//var url = "mongodb://localhost:27017/camaraDB";

var url = process.env.MONGO_CONNECTION

//var url =
//("mongodb+srv://oeneika:febrero1996@ucabcluster.lfasz.mongodb.net/tesis_backend");
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
