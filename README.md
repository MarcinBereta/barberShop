# Projekt zaliczeniowy - "barberShop"

## Skład grupy:

Adrian Żerebiec:  zerebiec@student.agh.edu.pl

Marcin Bereta: mbereta@student.agh.edu.pl

## Temat:

Projekt polega na stworzeniu sklepu z artykułami fryzjerskimi takimi jak: 

- szampony 

- maski

- olejki

- odżywki

## Technologia:

- MongoDB(implementacja za pomocą frameworku Mongoose)

- Express

- NextJs

## Struktura projektu
- Katalog backend: zawiera on całą logikę projektu, wszystkie operacje
- Katalog frontend: zawiera implemetację wyglądu aplikacji

## Opis backendu
Backend został zaimplemntowany z pomocą framework'a Express. Jako bazę danych wybraliśmy MongoDb i zaimplentowaliśmy z pomocą frameworku Mongoose
### server.js
Moduł ten służy do nasłuchiwania oraz nawiązywania połączenia na porcie 4000
```js
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
```
### mongoUtils.js
Ten moduł służy do nawiązywania połączenia z bazą danych MongoDB oraz udostępniania referencji do tej bazy danych. 
```js
var MongoClient = require( 'mongodb' ).MongoClient;
var _db;
module.exports = {
  connectToServer: function( callback ) {
    console.log("CONNECTING TO MONGODB")
    MongoClient.connect( "mongodb+srv://Mardorus:PokerAGH@poker.gmn3mgg.mongodb.net/?retryWrites=true&w=majority", function( err, client ) {
      _db = client.db("test");
      console.log("Connected to MongoDB");
      return callback( err );
    } );
  },
  getDb: function() {
    return _db;
  }
};
```
### Katalog controllers
Kontrolery definiują funkcje lub metody, które są wywoływane w momencie otrzymania żądania HTTP na określonej ścieżce (route). Te funkcje przetwarzają dane wejściowe, wykonują logikę biznesową i generują odpowiedź do klienta.

#### auth.controller.js
Ten kod zawiera kontrolery (controllers) odpowiedzialne za obsługę różnych żądań HTTP w aplikacji. Oto ich działanie:

- hashPassword(password): Asynchroniczna funkcja, która używa modułu bcrypt do hashowania hasła. Zwraca obietnicę, która rozwiązuje się z zahaszowanym hasłem lub wartością null w przypadku błędu.

- comparePassword(password, hash): Asynchroniczna funkcja, która używa modułu bcrypt do porównywania podanego hasła z zahaszowanym hasłem. Zwraca obietnicę, która rozwiązuje się wartością logiczną true, jeśli hasła są zgodne, lub wartością logiczną false w przeciwnym razie.

- verify(req, res): Funkcja obsługi żądania HTTP typu GET, która sprawdza, czy użytkownik jest uwierzytelniony (przez sprawdzenie req.authenticatedId) i zwraca informacje o uwierzytelnionym użytkowniku. Jeśli użytkownik istnieje, usuwa pole hasła z obiektu użytkownika i zwraca go w odpowiedzi jako JSON. W przeciwnym razie zwraca odpowiedni komunikat.

- login(req, res): Funkcja obsługi żądania HTTP typu POST, która obsługuje logowanie użytkownika. Sprawdza, czy podane dane uwierzytelniania są prawidłowe (używając funkcji comparePassword) i generuje token JWT, jeśli uwierzytelnienie powiodło się. Zwraca odpowiednią odpowiedź JSON z tokenem w przypadku sukcesu lub odpowiednim komunikatem w przypadku błędu.

- register(req, res): Funkcja obsługi żądania HTTP typu POST, która obsługuje rejestrację nowego użytkownika. Sprawdza, czy podane dane są prawidłowe, hashowuje hasło (używając funkcji hashPassword), tworzy nowego użytkownika w bazie danych i generuje token JWT dla nowego użytkownika. Zwraca odpowiednią odpowiedź JSON z tokenem w przypadku sukcesu lub odpowiednim komunikatem w przypadku błędu.

- getUser(req, res, next): Middleware (funkcja pośrednicząca) do pobrania informacji o użytkowniku na podstawie req.authenticatedId i przekazania go do następnej funkcji obsługi. Jeśli użytkownik nie zostanie znaleziony, zwracane jest odpowiednie zgłoszenie błędu.

- getUserHistory(req, res): Funkcja obsługi żądania HTTP typu GET, która pobiera historię użytkownika na podstawie req.authenticatedId i zwraca odpowiedź JSON zawierającą historię użytkownika. Jeśli użytkownik lub historia nie zostaną znalezione, zwracane są odpowiednie zgłoszenia błędów.
```js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let user = require("../models/user");
const conn = require("../models/connections");
const history = require("../models/history");
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
    if (myUser) {
        delete myUser.password;
        myUser._id = myUser._id.toString();
        console.log(myUser);

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
    console.log("TEST")
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
    let token;
    try {
        console.log(newUser)
        await newUser.save();
        let userObject = {
            id: newUser._id.toString(),
        };
        token = jwt.sign(userObject, "123qweascxzgwwegdsadqrgyeds", {
            expiresIn: 7 * 24 * 60 * 60,
        });
    } catch (err) {
        return res.status(200).send({ status: "ERROR", message: err.message });
    } finally {
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

exports.getUserHistory = async (req, res) =>{
    let user;
    try{
        user = await user.findById(req.authenticatedId);
        if(user == null){
            return res.status(404).json({message: "Cannot find user"});
        }
    }catch(err){
        return res.status(500).json({message: err.message});
    }
    let userHistory;   
    try{
        userHistory = await history.find({user: req.authenticatedId});
        if(userHistory == null){
            return res.status(404).json({message: "Cannot find history"});
        }
    }catch(err){
        return res.status(500).json({message: err.message});
    }

}
```
#### auth.model.js
Ten kod definiuje moduł auth, który zawiera metody do interakcji z bazą danych MongoDB. Oto ich działanie:

-auth.getUserById(id): Funkcja, która pobiera użytkownika na podstawie podanego identyfikatora (id). Wykorzystuje metodę findOne z kolekcji "users" w bazie danych, aby znaleźć użytkownika o pasującym identyfikatorze. Zwraca obietnicę, która rozwiązuje się z wynikiem (użytkownikiem) lub odrzuca się z błędem.

-auth.getUserByEmail(email): Funkcja, która pobiera użytkownika na podstawie podanego adresu e-mail (email). Wykorzystuje metodę findOne z kolekcji "users" w bazie danych, aby znaleźć użytkownika o pasującym adresie e-mail. Zwraca obietnicę, która rozwiązuje się z wynikiem (użytkownikiem) lub odrzuca się z błędem.

-auth.registerUser(user): Funkcja, która rejestruje nowego użytkownika w bazie danych. Wykorzystuje metodę insertOne z kolekcji "users" w bazie danych, aby wstawić nowy dokument reprezentujący użytkownika. Przekazuje obiekt user zawierający dane użytkownika, takie jak email, hasło i nazwa użytkownika. Zwraca obietnicę, która rozwiązuje się z wynikiem operacji (nowo utworzonym użytkownikiem) lub odrzuca się z błędem.
```js
var mongoUtil = require( '../mongoUtil' );
let mongo = mongoUtil.getDb();
const auth = () => { }

auth.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        mongo.collection('users').findOne({ _id: id }, (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
}

auth.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        mongo.collection('users').findOne({ email: email }, (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
}

auth.registerUser = (user)=>{
    return new Promise((resolve, reject) => {
        mongo.collection('users').insertOne({
            email: user.email,
            password: user.password,
            userName: user.userName,
        }, (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
}


module.exports = auth
```
