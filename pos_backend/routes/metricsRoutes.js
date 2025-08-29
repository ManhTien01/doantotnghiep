const express = require("express");
const router = express.Router();
const { getMonthlyMetrics } = require("../controllers/metricsController");

router.get("/", getMonthlyMetrics);

module.exports = router;
