const express = require('express');

let router = express.Router()
let auth = require('../controllers/auth.controller.js');

// Use authUtils.validateToken middleware to validate user JWT token
// It will be then available under req.authenticatedId in controller.

let authUtils = require('../utils/authUtils');

// Endpoints for "/auth" API route

router.post("/verify",  auth.verify)

module.exports = router;