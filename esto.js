const subirArchivo = (files, extensionesValidas = ["jpg", "png"], name) => {
  return new Promise((resolve, reject) => {
    const { imagen } = files;

    const nombreCortado = imagen.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extension
    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida - ${extensionesValidas}`
      );
    }

    const nombreTemp = name + "." + extension;
    const uploadPath = path.join(__dirname, "../imagenes/", nombreTemp);

    imagen.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve({ nombre: nombreTemp, size: imagen.size });
    });
  });
};

exports.UploadImage = async (req, res) => {
  var faceId = req.params.id;
  var file_name = "No subido...";
  const token = req.headers.authorization;
  const decoded = jwt.decode(
    token,
    "clave_secreta_del_curso_de_angular4avanzado"
  );
  if (req.files) {
    let nameOfImage = decoded.sub + params.name + "fecha-" + moment().format();
    const regex = /["", ":"]/g;
    const newName = nameOfImage.replace(regex, "-");
    const { nombre } = await subirArchivo(req.files, undefined, newName);

    Face.findByIdAndUpdate(
      faceId,
      { image: nombre },
      { new: true },
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
