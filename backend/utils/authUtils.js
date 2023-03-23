const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth.model");
exports.validateToken = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token || token == "") {
        return res.status(200).send({ status: "error", err: "UNAUTHORIZED" });
    }
    let decoded = '';

    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
        return res.status(200).send({ status: "error", err: "UNAUTHORIZED" });
    }

    if (decoded.id) {
        req.authenticatedId = decoded.id;
        next();
    } else {
        return res.status(200).send({ status: "error", err: "UNAUTHORIZED" });
    }
}

exports.validateSupportToken = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token || token == "") {
        req.authenticatedId = -1
    }
    let decoded = '';

    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
        req.authenticatedId = -1
    }

    if (decoded.id) {
        req.authenticatedId = decoded.id;
    } else {
        req.authenticatedId = -1
    }
    next()
}

exports.validatePermissions = (requiredPermissions) => {

    return async (req, res, next) => {
        let user;
        try {
            user = await authModel.getUserById(req.authenticatedId);
        } catch (error) {
            return res.status(200).send({ status: "error", err: "UNAUTHORIZED" });
        }
        let currentPermissions = user.permissions;

        let required = parseInt(requiredPermissions).toString(2);
        let current = parseInt(currentPermissions).toString(2);
        while (required.length != current.length) {
            if (required.length < current.length) {
                required = "0" + required;
            } else {
                current = "0" + current;
            }
        }

        let authorized = false;
        for (let i = required.length - 1; i >= 0; i--) {
            if (required[i] == current[i] && required[i] == "1") {
                authorized = true;
            }
        }

        if (authorized == true) {
            next();
        } else {
            return res.status(200).send({ status: "error", err: "UNAUTHORIZED" });
        }
    }
}