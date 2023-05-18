let shop = require("../models/shop");
const conn = require("../models/connections");

exports.getItems = async (req, res) => {
    let pageSize = 25;
    let skip = (req.params.pagination - 1) * pageSize;
    let search = req.body.debouncedSearch;
    if (search == null) {
        search = "";
    }
    let items = await shop
        .find({ name: { $regex: search, $options: "x" }, quantity: { $gt: 0 } })
        .skip(skip)
        .limit(pageSize);
    let imemCount = await shop.countDocuments({
        name: { $regex: search, $options: "i" },
    });

    return res
        .status(200)
        .send({ status: "OK", items: items, itemCount: imemCount });
};

exports.addItemToShop = async (req, res) => {
    console.log(req.body);
    let item = new shop({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description || "",
        image: req.body.image || "",
        category: req.body.category,
        quantity: req.body.quantity,
    });
    try {
        const newItem = await item.save();
        res.status(200).send({ status: "OK", item: newItem });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
};

exports.updateItem = async (req, res) => {
    if (req.body.name != null) {
        res.item.name = req.body.name;
    }
    if (req.body.price != null) {
        res.item.price = req.body.price;
    }
    if (req.body.description != null) {
        res.item.description = req.body.description;
    }
    if (req.body.image != null) {
        res.item.image = req.body.image;
    }
    if (req.body.category != null) {
        res.item.category = req.body.category;
    }
    if (req.body.quantity != null) {
        res.item.quantity = req.body.quantity;
    }
    try {
        const updatedItem = await res.item.save();
        res.status(200).send({ status: "OK", item: updatedItem });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getItem = async (req, res, next) => {
    let item;
    try {
        item = await shop.findById(req.body.productId);
        if (item == null) {
            return res.status(404).json({ message: "Cannot find item" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.item = item;
    next();
};

exports.getShopItems = async (req, res, next) => {
    let products = [];
    console.log(req.body);
    for (let product of req.body.products) {
        let item;
        try {
            item = await shop.findById(product._id);
            if (item == null) {
                return res.status(404).json({ message: "Cannot find item" });
            }
            products.push(item);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    res.items = products;
    next();
};

exports.buyProduct = async (req, res) => {
    const product = res.item;
    if (product.quantity < 0) {
        return res.status(400).json({ message: "Not enough items" });
    }
    if (product.quantity < 1) {
        return res.status(400).json({ message: "Not enough items" });
    }
    const user = res.user;
    const session = await conn.startSession();

    try {
        session.startTransaction();
        product.quantity -= 1;
        user.cart.push(product);
        await user.save({ session: session });
        await product.save({ session: session });
        await session.commitTransaction();
        return res.status(200).json({ status: "OK" });
    } catch (err) {
        await session.abortTransaction();
        return res.status(500).json({ message: err.message });
    } finally {
        session.endSession();
    }
};

exports.buyProducts = async (req, res) => {
    const products = res.items;
    for (let productIndex in products) {
        let product = products[productIndex];
        if (
            product.quantity < 0 ||
            req.body.products[productIndex].quantity > product.quantity
        ) {
            return res.status(400).json({ message: "Not enough items" });
        }
    }

    const user = res.user;
    const session = await conn.startSession();

    try {
        session.startTransaction();
        for (let productIndex in products) {
            let product = products[productIndex];
            product.quantity -= req.body.products[productIndex].quantity;
            user.cart.push(product);
            await product.save({ session: session });
        }
        await user.save({ session: session });
        await session.commitTransaction();
        return res.status(200).json({ status: "OK" });
    } catch (err) {
        await session.abortTransaction();
        return res.status(500).json({ message: err.message });
    } finally {
        session.endSession();
    }
};
