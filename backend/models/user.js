const mongoose = require("mongoose");
let validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, "Please fill a valid email address"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    permissions: {
        type: Number,
        required: false,
        default: 1,
    },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model("users", userSchema);
