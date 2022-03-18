// Modelos
let FaceImage = require("../models/face_image");
let moment = require("moment");

exports.getFaceByCameraAndDate = async (req, res) => {
  try {
    console.log(req.params.camera_id);
    let faceImage = await FaceImage.find()
      .where("moment")
      .gte(moment(req.query.initialDate, "DD-MM-YYYY").toDate())
      .lte(moment(req.query.finalDate, "DD-MM-YYYY").toDate())
      .populate({
        path: "image",
        populate: {
          path: "video",
          populate: {
            path: "camera",
          },
        },
      })
      .populate("face");
      const test = faceImage.filter(elem => elem.image.video.camera._id == req.params.camera_id);
    res.json(test);
  } catch (error) {
    console.error(error);
  }
};

exports.getFaceByCameraAndDay = async (req, res) => {
  try {
    let currentDate = moment().format("DD-MM-YYYY");

    let faceImage = await FaceImage.find()
      .where("moment")
      .equals(moment(currentDate, "DD-MM-YYYY").toDate())
      .populate({
        path: "image",
        populate: {
          path: "video",
          populate: {
            //where: { _id: req.params.camera_id },
            path: "camera",
          },
        },
      })
      .populate("face");
      const test = faceImage.filter(elem => elem.image.video.camera._id == req.params.camera_id);
    res.json(test);
  } catch (error) {
    console.error(error);
  }
};
exports.getFaceByCameraAndWeek = async (req, res) => {
  try {
    let now = moment(new Date()).toDate();
    const endOfWeek = moment(now).endOf("week").add(1, "d");
    const firstDayOfWeek = moment(now).startOf("week").add(1, "d");
    let faceImage = await FaceImage.find()
      .where("moment")
      .gte(moment(firstDayOfWeek, "DD-MM-YYYY").toDate())
      .lte(moment(endOfWeek, "DD-MM-YYYY").toDate())
      .populate({
        path: "image",
        populate: {
          path: "video",
          populate: {
            path: "camera",
          },
        },
      })
      .populate("face");
      const test = faceImage.filter(elem => elem.image.video.camera._id == req.params.camera_id);
    res.json(test);
  } catch (error) {
    console.error(error);
  }
};
exports.getFaceByCameraAndMonth = async (req, res) => {
  try {
    let now = moment(new Date()).toDate();
    const endOfMonth = moment(now).endOf("month");
    const firstDayOfMonth = moment(now).startOf("month");
    let faceImage = await FaceImage.find()
      .where("moment")
      .gte(moment(firstDayOfMonth, "DD-MM-YYYY").toDate())
      .lte(moment(endOfMonth, "DD-MM-YYYY").toDate())
      .populate({
        path: "image",
        populate: {
          path: "video",
          populate: {
            path: "camera",
          },
        },
      })
      .populate("face");
      const test = faceImage.filter(elem => elem.image.video.camera._id == req.params.camera_id);
    res.json(test);
  } catch (error) {
    console.error(error);
  }
};
