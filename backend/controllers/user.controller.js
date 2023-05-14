let user = require("../models/user.js");
let shop = require("../models/shop");
const mongoose = require("mongoose");
exports.getUser = async (req, res) => {
    return res.status(200).send({ status: "OK", user: req.authenticatedId });
};

exports.buyItem = async (req, res) => {
    let userData, product;
    try {
        userData = await userData.findById(req.authenticatedId);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    try {
        product = await shop.findById(req.params.id);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    if (product.quantity < req.body.quantity) {
        res.status(400).json({ message: "Not enough items in stock" });
    }
    product.quantity -= req.body.quantity;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        userData.cart.push({ ...product._doc, quantity: req.body.quantity });
        await userData.save({ session: session });
        await product.save({ session: session });
        await session.commitTransaction();
        session.endSession();
        res.status(200).send({ status: "OK", user: userData });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: err.message });
    }
};
