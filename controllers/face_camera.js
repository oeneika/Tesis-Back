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
