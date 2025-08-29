const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  people: { type: Number, required: true },
  message: { type: String },
  tables: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
    }
  ],
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);
