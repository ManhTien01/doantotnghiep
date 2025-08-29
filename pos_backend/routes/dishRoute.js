const express = require("express");
const router = express.Router();
const dishController = require("../controllers/dishController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

// Route: /api/dishes
router.route("/")
  .get(isVerifiedUser, dishController.getDishes)
  .post(isVerifiedUser, dishController.createDish);

// Route: /api/dishes/:id
router.route("/:id")
  .get(isVerifiedUser, dishController.getDishById)
  .put(isVerifiedUser, dishController.updateDish)
  .delete(isVerifiedUser, dishController.deleteDish);

router.post("/by-ids", dishController.getDishesByIds);

module.exports = router;
