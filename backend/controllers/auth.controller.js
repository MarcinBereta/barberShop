let authModel = require("./auth.model");
let userModel = require("../models/user.model");
let shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
let user = require("../models/user");
const conn = require("../models/connections");
async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                resolve(null);
            } else {
                resolve(hash);
            }
        });
    });
}

async function comparePassword(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            if (res) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

exports.verify = async (req, res) => {
    console.log(req.authenticatedId);
    let myUser = await user.findOne({ _id: Object(req.authenticatedId) });
    console.log(myUser);
    if (myUser) {
        delete myUser.password;
        myUser._id = myUser._id.toString();
        return res.status(200).send({ status: "OK", user: myUser });
    } else {
        return res
            .status(200)
            .send({ status: "ERROR", message: "User not found" });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    let myUser = await user.findOne({ username: username });
    if (myUser) {
        let authorized = await comparePassword(password, myUser.password);
        if (!authorized) {
            return res
                .status(200)
                .send({ status: "ERROR", message: "Wrong password" });
        }
        let userObject = {
            id: myUser._id.toString(),
        };
        let token = jwt.sign(userObject, "123qweascxzgwwegdsadqrgyeds", {
            expiresIn: 7 * 24 * 60 * 60,
        });
        return res.status(200).send({ status: "OK", data: { token: token } });
    } else {
        return res
            .status(200)
            .send({ status: "ERROR", message: "User not found" });
    }
};
exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    if (!email.includes("@") || !email.includes(".")) {
        return res
            .status(200)
            .send({ status: "ERROR", message: "Invalid email" });
    }
    let myUser = user.find({ $or: [{ username: username }, { email: email }] });
    if (myUser.length > 0) {
        return res
            .status(200)
            .send({ status: "ERROR", message: "User already exists" });
    }
    let hash = await hashPassword(password);
    if (!hash) {
        return res
            .status(200)
            .send({ status: "ERROR", message: "Error hashing password" });
    }

    let newUser = new user({
        username: username,
        password: hash,
        email: email,
        cart: [],
    });
    const session = await conn.startSession();
    let token;
    try {
        session.startTransaction();
        await newUser.save({ session });

        let userObject = {
            id: newUser._id.toString(),
        };
        console.log(userObject);
        token = jwt.sign(userObject, "123qweascxzgwwegdsadqrgyeds", {
            expiresIn: 7 * 24 * 60 * 60,
        });
    } catch (err) {
        await session.abortTransaction();
        return res.status(200).send({ status: "ERROR", message: err.message });
    } finally {
        session.endSession();
    }
    return res.status(200).send({ status: "OK", data: { token: token } });
};

exports.getUser = async (req, res, next) => {
    let users;
    try {
        users = await user.findById(req.authenticatedId);
        console.log(users);
        console.log("QWE!@#WE");
        if (users == null) {
            return res.status(404).json({ message: "Cannot find item" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.user = users;
    next();
};
