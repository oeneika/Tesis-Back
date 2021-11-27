// Modelos
let FaceImage = require("../models/face_image");
let moment = require("moment");

// let User = require("../models/user")

exports.getFaceByCameraAndDate = async (req, res) => {
  //   console.log(req.query);
  try {
    let faceImage = await FaceImage.find()
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

    let initialDate = moment(req.query.initialDate, "DD-MM-YYYY").toDate();
    let finalDate = moment(req.query.finalDate, "DD-MM-YYYY").toDate();
    let filterArrayByCameraAndDates = faceImage.filter(
      (elem) =>
        elem.image?.video?.camera?.id === req.params.camera_id &&
        initialDate <= elem.moment &&
        elem.moment <= finalDate
    );
    let newArray = filterArrayByCameraAndDates.map((elem) => ({
      id: elem.id,
      facialExpression: elem.facialExpression,
      face: elem.face,
      moment: elem.moment,
    }));

    res.json(newArray);
  } catch (error) {
    console.error(error);
  }
};
exports.getFaceByCameraAndDay = async (req, res) => {
  //   console.log(req.query);
  try {
    let faceImage = await FaceImage.find()
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
    let byDay = moment(req.query.byDay, "DD-MM-YYYY").toDate();

    let filterArrayByCameraAndDay = faceImage.filter(
      (elem) =>
        elem.image?.video?.camera?.id === req.params.camera_id &&
        moment(elem?.moment).format() === moment(byDay).format()
    );

    let newArray = filterArrayByCameraAndDay.map((elem) => ({
      id: elem.id,
      facialExpression: elem.facialExpression,
      face: elem.face,
      moment: elem.moment,
    }));

    res.json(newArray);
  } catch (error) {
    console.error(error);
  }
};
exports.getFaceByCameraAndWeek = async (req, res) => {
  //   console.log(req.query);
  try {
    let faceImage = await FaceImage.find()
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

    let now = moment(new Date()).toDate();
    const endOfWeek = moment(now).endOf("week").add(1, "d");
    const firstDayOfWeek = moment(now).startOf("week").add(1, "d");

    let filterArrayByCameraAndWeek = faceImage.filter(
      (elem) =>
        elem.image?.video?.camera?.id === req.params.camera_id &&
        elem.moment &&
        moment(firstDayOfWeek).format() <= moment(elem.moment).format() &&
        moment(elem.moment).format() <= moment(endOfWeek).format()
    );

    let newArray = filterArrayByCameraAndWeek.map((elem) => ({
      id: elem.id,
      facialExpression: elem.facialExpression,
      face: elem.face,
      moment: elem.moment,
    }));

    res.json(newArray);
  } catch (error) {
    console.error(error);
  }
};
exports.getFaceByCameraAndMonth = async (req, res) => {
  //   console.log(req.query);
  try {
    let faceImage = await FaceImage.find()
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

    let now = moment(new Date()).toDate();
    const endOfMonth = moment(now).endOf("month");
    const firstDayOfMonth = moment(now).startOf("month");

    let filterArrayByCameraAndMonth = faceImage.filter(
      (elem) =>
        elem.image?.video?.camera?.id === req.params.camera_id &&
        elem.moment &&
        moment(firstDayOfMonth).format() <= moment(elem.moment).format() &&
        moment(elem.moment).format() <= moment(endOfMonth).format()
    );

    let newArray = filterArrayByCameraAndMonth.map((elem) => ({
      id: elem.id,
      facialExpression: elem.facialExpression,
      face: elem.face,
      moment: elem.moment,
    }));

    res.json(newArray);
  } catch (error) {
    console.error(error);
  }
};
