let authModel = require('./auth.model');
let userModel = require('../models/user.model');
let shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

exports.verify = async (req, res) => {
    return res.status(200).send({ status:"OK", user: req.authenticatedId });
}