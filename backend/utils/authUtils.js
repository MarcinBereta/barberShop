const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const authModel = require("../controllers/auth.model");
exports.validateToken = async (req, res, next) => {
    console.log("Validating token...");
    let token = req.headers.authorization;
    if (!token || token == "") {
        return res.status(200).send({ status: "error", err: "UNAUTHORIZED" });
    }
    let decoded = "";
    console.log("Validating token...2");

    try {
        decoded = jwt.verify(token, "123qweascxzgwwegdsadqrgyeds");
    } catch (error) {
        return res.status(200).send({ status: "error", err: "UNAUTHORIZED" });
    }
    console.log("Validating token...3");

    if (decoded.id) {
        console.log("Validating token...4");

        req.authenticatedId = decoded.id;
        next();
    } else {
        return res.status(200).send({ status: "error", err: "UNAUTHORIZED" });
    }
};
