// Modelos
let Face = require("../models/face");
var jwt = require("jwt-simple");
const moment = require("moment");
const path = require("path");
const fs = require("fs");

//FUNCIONANDO AL 100%

exports.getFaces = async(req, res) => {
    try {
        const faces = await Face.find().sort("name");
        return res.json(faces);
    } catch (error) {
        console.error(error);
    }
};

exports.getFaceByConfidenceLevel = async(req, res) => {
    try {
        var confidenceLevelId = req.params.id;
        const faces = await Face.find({ confidenceLevels: confidenceLevelId }).sort(
            "name"
        );
        return res.json(faces);
    } catch (error) {
        console.error(error);
    }
};

exports.getFaceByUser = async(req, res) => {
    try {
        var user = req.params.id;
        const faces = await Face.find({ user }).sort("name");
        return res.json(faces);
    } catch (error) {
        console.error(error);
    }
};

exports.getFace = async(req, res) => {
    try {
        var faceId = req.params.id;
        Face.findById(faceId, (err, faces) => {
            if (err) {
                res.status(500).send({ message: "Error en la peticion" });
            } else {
                if (!faces) {
                    res.status(404).send({ message: "La cara de la persona no existe" });
                } else {
                    res.status(200).send({ faces });
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
};

exports.guardarFace = async(req, res) => {
    try {
        let face = new Face();
        let params = req.body;
        console.log('face fuera:', params);
        if (params.name && params.surname && params.age && params.gender) {
            face.name = params.name;
            face.surname = params.surname;
            face.age = params.age;
            face.gender = params.gender;
            face.image = null;
            face.unknown = params.unknown;
            face.confidenceLevels = params.confidenceLevels;
            face.user = params.user;
            console.log('face:', params);
            face.save((err, faceStored) => {
                if (err) {
                    res
                        .status(500)
                        .send({ message: "Error al guardar la cara de la persona" });
                } else {
                    if (!faceStored) {
                        res
                            .status(404)
                            .send({ message: "La cara de la persona no ha sido guardada" });
                    } else {
                        res.status(200).send({ face: faceStored });
                        console.log(faceStored);
                    }
                }
            });
        }
        
    } catch (error) {
        console.error(error);
    }
};

exports.UpdateFace = async(req, res) => {
    try {
        var faceId = req.params.id;
        var update = req.body;

        Face.findByIdAndUpdate(faceId, update, (err, faceUpdated) => {
            if (err) {
                res
                    .status(500)
                    .send({ message: "Error al actualizar la cara de la persona" });
            } else {
                if (!faceUpdated) {
                    res
                        .status(404)
                        .send({ message: "La cara de la persona no ha sido actualizada" });
                } else {
                    res.status(200).send({ face: faceUpdated });
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
};

exports.DeleteFace = async(req, res) => {
    try {
        var faceId = req.params.id;

        Face.findByIdAndRemove(faceId, (err, faceRemoved) => {
            if (err) {
                res
                    .status(500)
                    .send({ message: "Error al eliminar la cara de la persona" });
            } else {
                if (!faceRemoved) {
                    res
                        .status(404)
                        .send({ message: "La cara de la persona no ha sido eliminada" });
                } else {
                    res.status(200).send({ faceRemoved });
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
};

const subirArchivo = (files, extensionesValidas = ["jpg", "png"], name) => {
    return new Promise((resolve, reject) => {
        const { imagen } = files;
        console.log('conchetuhermana', imagen);

        const nombreCortado = imagen.name.split(".");
        const extension = nombreCortado[nombreCortado.length - 1];

        // Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(
                `La extensión ${extension} no es permitida - ${extensionesValidas}`
            );
        }

        const nombreTemp = imagen.name.split(".")[0] + name + "." + extension;
        const uploadPath = path.join(__dirname, "../uploads/face/", nombreTemp);

        imagen.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve({ nombre: nombreTemp, size: imagen.size });
        });
    });
};

exports.UploadImage = async(req, res) => {
    var faceId = req.params.id;
    var file_name = "No subido...";
    const token = req.headers.authorization;
    // const decoded = jwt.decode(
    //     token,
    //     "clave_secreta_del_curso_de_angular4avanzado"
    // ); 
    if (req.files) {
        let nameOfImage =
        // decoded.sub +
        moment().format();
        const regex = /:/g;
        const newName = nameOfImage.replace(regex, "-");
        console.log('triple hijueputas ', req.files);
        const { nombre } = await subirArchivo(req.files, undefined, newName);

        Face.findByIdAndUpdate(
            faceId, { image: nombre }, { new: true },
            (err, faceUpdated) => {
                if (err) {
                    res
                        .status(500)
                        .send({ message: "Error al actualizar la cara de la persona" });
                } else {
                    if (!faceUpdated) {
                        res.status(404).send({
                            message: "No se ha podido actualizar la cara de la persona",
                        });
                    } else {
                        res.status(200).send({ face: faceUpdated, image: file_name });
                    }
                }
            }
        );
    } else {
        res.status(200).send({ message: "no se han subido ficheros " });
    }
};

exports.GetImageFile = async(req, res) => {
    var imageFile = req.params.imageFile;
    var path_file = "./uploads/face/" + imageFile;

    fs.access(path_file, fs.constants.F_OK, (err) => {
        if (!err) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: "La imagen no existe en el servidor" });
        }
    });
};