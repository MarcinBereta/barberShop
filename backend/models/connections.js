const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://Mardorus:PokerAGH@poker.gmn3mgg.mongodb.net/barberShop?retryWrites=true&w=majority",
    { useNewUrlParser: true }
);

const conn = mongoose.connection;

conn.on("error", () => console.error.bind(console, "connection error"));

conn.once("open", () => console.info("Connection to Database is successful"));

module.exports = conn;
