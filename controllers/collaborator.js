// Modelos
let User = require("../models/user");
let Role = require("../models/role");
let UserCamera = require("../models/user_camara");
var bcrypt = require("bcryptjs");
const twofactor = require("node-2fa");
const { sendMail } = require("../services/mails");

exports.createCollaborator = async (req, res) => {
  try {
    var user = new User();
    var params = req.body;

    let userIdAdmin = params.userIdAdmin;
    params.password = Math.random().toString(36).slice(-8);

    if (params.name && params.surname && params.email && params.userIdAdmin) {
      user.name = params.name;
      user.surname = params.surname;
      user.email = params.email;
      user.password = params.password;

      const role = await Role.findOne({ name: "collaborator" });
      user.roles = [role._id];
      const userFind = await User.findOne({ email: user.email.toLowerCase() });
      const temp_secret = twofactor.generateSecret({
        name: "Sistema de videovigilancia",
        account: "Tesis por Alexander y Vladimir",
      });
      // const userAdmin = await User.findOne({ _id: userIdAdmin });

      user.temp_secreto = temp_secret;
      if (!userFind) {
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;
        user.save();
        const userCamera = await UserCamera.find({
          UserAdmin: userIdAdmin,
        }).distinct("cameraId");

        if (userCamera) {
          for (const camarita of userCamera) {
            let user_camera = new UserCamera();
            user_camera.cameraId = camarita;
            user_camera.UserAdmin = userIdAdmin;
            user_camera.UserCollaborator = user._id;
            user_camera.save();
          }
        }
        sendMail(user, params.password);

        res.status(200).send({
          message:
            "Colaborador creado y asociado a las camaras del administrador",
          user,
          password: params.password,
        });
      } else {
        const collaborators = await UserCamera.find({
          UserAdmin: userIdAdmin,
        });

        const collaborator = collaborators.find(
          (elem) =>
            elem.UserCollaborator &&
            elem.UserCollaborator.toString() == userFind._id.toString()
        );

        if (!collaborator) {
          console.log("entro");
          const userCamera = await UserCamera.find({
            UserAdmin: userIdAdmin,
          }).distinct("cameraId");

          if (userCamera) {
            for (const camarita of userCamera) {
              let user_camera = new UserCamera();
              user_camera.cameraId = camarita;
              user_camera.UserAdmin = userIdAdmin;
              user_camera.UserCollaborator = userFind._id;
              user_camera.save();
            }
            return res.status(200).json("se añadió");
          }
        } else {
          return res.status(404).send({
            message: "Ya es uno de tus colaboradores",
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getCollaboratorsByAdministrator = async (req, res) => {
  console.log("funcionando");
  try {
    var adminId = req.params ? req.params.id : req.body.UserAdmin;
    const collaborator = await UserCamera.find({ UserAdmin: adminId }).distinct(
      "UserCollaborator"
    );
    if (req.params) {
      res.json(collaborator);
    } else if (req.body.UserAdmin) {
      return collaborator;
    }
  } catch (error) {
    console.error(error);
  }
};

exports.DeleteCollaborator = async (req, res) => {
  try {
    var collaboratorId = req.params.id;

    await UserCamera.deleteOne({ UserCollaborator: collaboratorId });

    await User.findByIdAndRemove(collaboratorId, (err, notificationRemoved) => {
      if (err) {
        res.status(500).send({ message: "Error al eliminar el colaborador" });
      } else {
        if (!notificationRemoved) {
          res
            .status(404)
            .send({ message: "El colaborador ya ha sido eliminado" });
        } else {
          res.status(200).send({ notificationRemoved });
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};
