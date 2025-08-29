const express = require("express");
const { addTable, getTables, updateTable, deleteTable, switchTable, mergeTables, getTablesByStatus, getTableById } = require("../controllers/tableController")
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();


router.route("/").post(isVerifiedUser, addTable);
router.route("/").get(isVerifiedUser, getTables);
router.get("/status/:status", isVerifiedUser,getTablesByStatus);
router.route("/:id").get(isVerifiedUser, getTableById);
router.route("/:id").put(isVerifiedUser, updateTable);
router.route("/:id").delete(isVerifiedUser, deleteTable);
router.route("/switch").post(isVerifiedUser, switchTable);
router.route("/merge").post(isVerifiedUser, mergeTables);
module.exports = router;