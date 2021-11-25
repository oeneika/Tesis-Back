// Modelos
let User = require("../models/user");
let Role = require("../models/role");
let UserCamera = require("../models/user_camara");
var bcrypt = require("bcryptjs");
const twofactor = require("node-2fa");
const nodemailer = require("nodemailer");

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
      const userAdmin = await User.findOne({ _id: userIdAdmin });

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

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // use TLS
          auth: {
            user: "mauriziovol16@gmail.com",
            pass: "jajaja12",
          },
          tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
          },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"Fred Foo 👻" <foo@example.com>', // sender address
          to: "maurovolpe18@gmail.com", // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <title></title> <meta http-equiv="X-UA-Compatible" content="IE=edge"/> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> <meta name="viewport" content="width=device-width, initial-scale=1"/> <style type="text/css"> #outlook a{padding: 0;}body{margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}table, td{border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}p{display: block; margin: 13px 0;}</style><!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]--><!--[if lte mso 11]><style type="text/css">.mj-outlook-group-fix{width: 100% !important;}</style><![endif]--> <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"/> <style type="text/css"> @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700); </style> <style type="text/css"> @media only screen and (min-width: 480px){.mj-column-per-100{width: 100% !important; max-width: 100%;}}</style> <style media="screen and (min-width:480px)"> .moz-text-html .mj-column-per-100{width: 100% !important; max-width: 100%;}</style> <style type="text/css"> @media only screen and (max-width: 480px){table.mj-full-width-mobile{width: 100% !important;}td.mj-full-width-mobile{width: auto !important;}}</style></head><body style="word-spacing: normal; background-color: #f2f5f8"> <div style="background-color: #f2f5f8"> <div style="background: #f2f5f8;background-color: #f2f5f8;margin: 0px auto;max-width: 600px;"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background: #f2f5f8; background-color: #f2f5f8; width: 100%"> <tbody> <tr> <td style="direction: ltr;font-size: 0px;padding: 20px 0;padding-bottom: 20px;padding-top: 30px;text-align: center;"> <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size: 0px;text-align: left;direction: ltr;display: inline-block;vertical-align: top;width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align: top" width="100%"> <tbody> <tr> <td align="center" style="font-size: 0px;padding: 10px 25px;word-break: break-word;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse;border-spacing: 0px;"> <tbody> <tr> <td style="width: 214px"> <img height="auto" src="http://tesis.oeneika.com/logo.png" style="border: 0;display: block;outline: none;text-decoration: none;height: auto;width: 100%;font-size: 13px;" width="214"/> </td></tr></tbody> </table> </td></tr></tbody> </table> </div></td></tr></tbody> </table> </div><div style="background: #ffffff;background-color: #ffffff;margin: 0px auto;max-width: 600px;"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background: #ffffff; background-color: #ffffff; width: 100%"> <tbody> <tr> <td style="direction: ltr;font-size: 0px;padding: 40px 0px;padding-bottom: 0px;text-align: center;"> <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size: 0px;text-align: left;direction: ltr;display: inline-block;vertical-align: top;width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align: top" width="100%"> <tbody> <tr> <td align="center" style="font-size: 0px;padding: 0 25px;padding-top: 0px;padding-right: 40px;padding-bottom: 0px;padding-left: 40px;word-break: break-word;"> <div style="font-family: Arial, sans-serif;font-size: 13px;line-height: 22px;text-align: center;color: #333333;"> <p style="line-height: 24px;margin: 0px 0 10px 0;font-size: 16px;color: #151e23;font-family: Arial, sans-serif;color: #354552;"> Has sido invitado(a) a unirte a una cámara de vigilancia. Para comenzar, haga clic en el botón que aparece a continuación. </p></div></td></tr><tr> <td align="center" vertical-align="middle" style="font-size: 0px;padding: 10px 25px;padding-top: 20px;padding-bottom: 40px;word-break: break-word;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: separate; line-height: 100%"> <tr> <td align="center" bgcolor="#4191F7" role="presentation" style="border: none;border-radius: 5px;cursor: auto;mso-padding-alt: 15px 40px;background: #4191f7;" valign="middle"> <a href="https://www.google.com/" style="display: inline-block;background: #4191f7;color: #ffffff;font-family: Arial, sans-serif;font-size: 13px;font-weight: bold;line-height: 120%;margin: 0;text-decoration: none;text-transform: none;padding: 15px 40px;mso-padding-alt: 0px;border-radius: 5px;" target="_blank">Unirse a la cámara de vigilancia</a> </td></tr></table> </td></tr><tr> <td align="center" style="font-size: 0px;padding: 0 25px;padding-top: 0px;padding-right: 40px;padding-bottom: 0px;padding-left: 40px;word-break: break-word;"> <div style="font-family: Arial, sans-serif;font-size: 13px;line-height: 22px;text-align: center;color: #333333;"> <p style="line-height: 24px;margin: 0px 0 40px 0;font-size: 16px;color: #333333;font-family: Arial, sans-serif;color: #333333;"> Atentamente, <br/> Sistema de videovigilancia </p></div></td></tr></tbody> </table> </div></td></tr></tbody> </table> </div><div style="background: #f0f0f0;background-color: #f0f0f0;margin: 0px auto;max-width: 600px;"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background: #f0f0f0; background-color: #f0f0f0; width: 100%"> <tbody> <tr> <td style="direction: ltr;font-size: 0px;padding: 15px 0 0 0;text-align: center;"> <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size: 0px;text-align: left;direction: ltr;display: inline-block;vertical-align: top;width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align: top" width="100%"> <tbody> <tr> <td align="center" style="font-size: 0px;padding: 0 25px;padding-top: 0px;padding-right: 40px;padding-bottom: 0px;padding-left: 40px;word-break: break-word;"> <div style="font-family: Arial, sans-serif;line-height: 22px;text-align: center;"> <p style="line-height: 14px;margin: 0px 0 15px 0;font-size: 12px;font-family: Arial, sans-serif;color: #76838f;"> Tesis de grado para la Universidad Católica Andrés Bello </p></div></td></tr></tbody> </table> </div></td></tr></tbody> </table> </div></div></body></html>',
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        res.status(200).send({
          message:
            "Colaborador creado y asociado a las camaras del administrador",
          user,
          password: params.password,
        });
      } else {
        res.status(404).send({
          message: "ERROR! El usuario ya es uno de sus colaboradores",
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getCollaboratorsByAdministrator = async (req, res) => {
  console.log(req.body.UserAdmin, "req");
  try {
    var adminId = req.params ? req.params.id : req.body.UserAdmin;
    console.log(adminId, "id");
    const collaborator = await UserCamera.find({ UserAdmin: adminId }).distinct(
      "UserCollaborator"
    );
    console.log(collaborator, "collaborator");
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
