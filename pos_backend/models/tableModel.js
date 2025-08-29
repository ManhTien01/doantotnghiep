const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    tableNo: { type: Number, required: true, unique: true },
    status: {
        type: String,
        enum: ['Available', 'Occupied', 'Reserved'],
        default: "Available"
    },
    seats: { 
        type: Number,
        required: true
    },
    currentTurn: {type: Number},
    menuType: {type: String},
    currentOrder: {type: mongoose.Schema.Types.ObjectId, ref: "Order"},
    area: {type: mongoose.Schema.Types.ObjectId, ref: "Area"},
    reservations: [
        {
          date: String,
          time: String,
        },
      ],
});

module.exports = mongoose.model("Table", tableSchema);