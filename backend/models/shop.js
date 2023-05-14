const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: true,
        enum: ["shampoo", "conditioner", "mask", "oils"],
        defaultValue: "shampoo",
    },
    quantity: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("products", productSchema);
