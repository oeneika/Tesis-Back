// Modelos
let Notification = require("../models/notification");
var jwt = require("jwt-simple");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
//FUNCIONANDO AL 100%

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    return res.json(notifications);
  } catch (error) {
    console.error(error);
  }
};
exports.getNotificationByUser = async (req, res) => {
  let userId = req.params.id;
  try {
    const notifications = await Notification.find({ user: userId }).sort(
      { hour: -1}
    );
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
        res.status(500).send({ message: "Error en la peticion" });
      } else {
        if (!notifications) {
          res.status(404).send({ message: "La notificación no existe" });
        } else {
          res.status(200).send({ notifications });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

exports.saveNotification = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.decode(
      token,
      "clave_secreta_del_curso_de_angular4avanzado"
    );
    let notification = new Notification();
    let params = req.body;
    if (params.age && params.gender && params.camera && params.user && params.facialExpression) {
      let nameOfImage =
        decoded.sub + params.camera + "fecha-" + moment().format();
      const regex = /:/g;
      const newName = nameOfImage.replace(regex, "-");
      const { nombre } = await subirArchivo(req.files, undefined, newName);

      notification.hour = moment(new Date());
      notification.age = params.age;
      notification.gender = params.gender;
      notification.facialExpression = params.facialExpression;
      notification.file = params.file;
      notification.camera = params.camera;
      notification.user = params.user;
      notification.seen = false;

      notification.file = nombre;
      notification.save((err, notificationStored) => {
        if (err) {
          res.status(500).send({ message: "Error al guardar la imagen" });
        } else {
          if (!notificationStored) {
            res
              .status(404)
              .send({ message: "La notificación no ha sido guardada" });
          } else {
            res.status(200).send({ notification: notificationStored });
          }
        }
      });
    } else {
      return res.json({ error: "faltan campos por enviar" });
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
          res.status(500).send({ message: "Error al actualizar la imagen" });
        } else {
          if (!notificationUpdated) {
            res
              .status(404)
              .send({ message: "La notificación no ha sido actualizada" });
          } else {
            res.status(200).send({ notification: notificationUpdated });
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
          res
            .status(500)
            .send({ message: "Error al eliminar la notificación" });
        } else {
          if (!notificationRemoved) {
            res
              .status(404)
              .send({ message: "La notificación no ha sido eliminada" });
          } else {
            res.status(404).send({ notificationRemoved });
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

exports.getImageFile = async(req, res) => {
  var imageFile = req.params.imageFile;

  var path_file = "./uploads/face/" + imageFile;

  fs.access(path_file, fs.constants.F_OK, (err) => {
      if (!err) {
          res.sendFile(path.resolve(path_file));
      } else {
          res.status(200).send({ message: "La imagen no existe en el servidor" });
      }
  });
}

const subirArchivo = (files, extensionesValidas = ["jpg", "png"], name) => {
  console.log(files, name);
  return new Promise((resolve, reject) => {
    const { imagen } = files;
    console.log(imagen);
    const nombreCortado = imagen.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extension
    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida - ${extensionesValidas}`
      );
    }

    const nombreTemp = name + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/face", nombreTemp);

    imagen.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve({ nombre: nombreTemp, size: imagen.size });
    });
  });
};