const express = require("express");

let router = express.Router();
let shop = require("../controllers/shop.controller.js");
let user = require("../controllers/auth.controller.js");
// Use authUtils.validateToken middleware to validate user JWT token
// It will be then available under req.authenticatedId in controller.

let authUtils = require("../utils/authUtils");

// Endpoints for "/auth" API route

router.get("/getItems/:pagination", shop.getItems);

router.post(
    "/buyItem",
    authUtils.validateToken,
    user.getUser,
    shop.getItem,
    shop.buyProduct
);

module.exports = router;
