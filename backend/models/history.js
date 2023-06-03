const mongoose = require("mongoose");

const purchaseHistory = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    date: {
        type: Date,
        required: true,
    },

});

module.exports = mongoose.model("history", purchaseHistory);
