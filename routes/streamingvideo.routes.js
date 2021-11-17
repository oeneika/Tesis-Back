const {Router} = require("express");
const router = Router();

router.get("/video", (req, res) => {
	res.redirect("index.html");
});

module.exports = router;
