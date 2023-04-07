const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const http = require("http");
const PORT = 4000;
var mongoUtil = require("./mongoUtil");
const app = express();
let server = http.Server(app);

let router = express.Router();
dotenv.config();
process.env.TZ = "Europe/London";
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
let authRoute = require("./routes/auth");
let userRoute = require("./routes/user");
let shopRoute = require("./routes/shop");
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/shop", shopRoute);
app.post("/", function (req, res) {});

server.listen(PORT, function () {
    console.log("Brain Wars services API listening on PORT: " + PORT);
});
