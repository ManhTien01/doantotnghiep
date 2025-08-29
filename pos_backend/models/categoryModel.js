const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  isMenu: { type: Boolean, default: false },

  menuType: {
    type: String,
    enum: ["alacart", "buffet", "combo"],
    required: function () {
      return this.isMenu === true;
    },
  },

  price: {
    type: Number,
    required: function () {
      return this.isMenu && (this.menuType === "buffet" || this.menuType === "combo");
    },
    min: [0, "Giá không được âm"],
  },

  dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dishes" }],
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredients" }],
});

module.exports = mongoose.model("Category", categorySchema);
