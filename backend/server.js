const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');
const PORT = 4000
var mongoUtil = require( './mongoUtil' );
const app = express()
let server = http.Server(app);
const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://Mardorus:PokerAGH@poker.gmn3mgg.mongodb.net/barberShop?retryWrites=true&w=majority", { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

let router = express.Router()
dotenv.config();
process.env.TZ = 'Europe/London'
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))
let authRoute = require('./routes/auth');
let userRoute = require('./routes/user');
let shopRoute = require('./routes/shop');
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/shop', shopRoute);
app.post('/', function (req, res) {
});



server.listen(PORT, function () {
  console.log("Brain Wars services API listening on PORT: " + PORT)
})