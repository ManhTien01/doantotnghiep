const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema({
    area: { type: String, required: true, unique: true },
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }]
});

module.exports = mongoose.model("Area", areaSchema);