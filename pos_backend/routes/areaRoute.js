const express = require("express");
const { createArea, updateArea, deleteArea, getAreas } = require("../controllers/areaController")
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();


router.route("/").get(isVerifiedUser, getAreas);
router.route("/").post(isVerifiedUser, createArea);
router.route("/:id").delete(isVerifiedUser, deleteArea);
router.route("/:id").put(isVerifiedUser, updateArea);
module.exports = router;