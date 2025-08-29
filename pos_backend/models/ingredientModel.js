const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },

    // Loại nguyên liệu: 'count' = đếm được, 'weight' = cân đo
    type: {
        type: String,
        enum: ["count", "weight"],
        required: true
    },

    // Số lượng tồn kho
    quantity: {
        type: Number,
        required: true,
        default: 0
    },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    // Đơn vị (chỉ dùng khi type = 'weight'), ví dụ: 'kg', 'g', 'l', 'ml'
    unit: {
        type: String,
        enum: ["g", "kg", "ml", "l", ""] , // "" để trống nếu là loại 'count'
        default: "",
        validate: {
            validator: function (v) {
                return this.type === "count" ? v === "" : v !== "";
            },
            message: props => `Unit is required for type '${props.instance.type}'`
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("Ingredients", ingredientSchema);
