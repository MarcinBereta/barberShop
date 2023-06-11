# Projekt zaliczeniowy - "barberShop"

## Zawarte informacje
* [Skład grupy](#skład-grupy)
* [Temat](#temat)
* [Technologia](#technologia)
* [Uruchomienie aplikacji](#uruchomienie-aplikacji)
* [Struktura bazy danych](#struktura-bazy-danych)
* [Struktura projektu](#struktura-projektu)
* [Opis backendu](#opis-backendu)
* [Opis frontendu](#opis-frontendu)

## Skład grupy

Adrian Żerebiec: zerebiec@student.agh.edu.pl

Marcin Bereta: mbereta@student.agh.edu.pl

## Temat

Jako projekt wybraliśmy implementację sklepu z artykułami fryzjerskimi.
Jest to aplikacja pozwalająca użytkownikowi na zakup produktów, gdzie transakcje odbywają się z pomocą bazy danych.

## Technologia

- MongoDB(implementacja za pomocą frameworku Mongoose)

- Express

- NextJs

## Uruchomienie aplikacji

Aby uruchomić aplikację musimy z pomocą komendy `npm run dev` włączyć serwer a następnie aplikację.

## Struktura bazy danych
Nasza baza danych składa się z 3 kolekcji: histories, users oraz products.

### products

W tej kolekcji umieszczone są produkty z naszego sklepu. Każdy z nich ma przypisaną nazwę, cenę, dostępną ilość oraz kategorię.
Wyróżniamy 4 kategorie: odżywki, szampony, olejki oraz maski.

### histories

W tej kolekcji przechowywane są informacje o zakupach dokonanych przez użytkowników. Zawiera datę zakupu, użytkownika który tego dokonał oraz tablicę z zakupami.

### users

W tej kolekcji są dane użytkowników takie jak nazwa użytkownika, email, prawa oraz zakodowane hasło, oraz koszyk użtkownika.


## Struktura projektu
### Katalog backend 
Zawiera on implementację logiki projektu oraz bazy danych. Zawierają się w nim katalogi:

- controllers
- models
- routes
- utils
- pliki: mongoUtils.js, server.js

### Katalog frontend/barber 
Zawiera implemetację wyglądu aplikacji. Zawarte w nim katalogi to:

- public
- src

## Opis backendu
Backend został zaimplemntowany z pomocą framework'a Express. Jako bazę danych wybraliśmy MongoDb i zaimplentowaliśmy z pomocą frameworku Mongoose.

### Plik server.js
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
### Plik mongoUtils.js
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

#### Plik auth.controller.js
Ten kod zawiera kontrolery (controllers) odpowiedzialne za obsługę różnych żądań HTTP w aplikacji. Oto ich działanie:

- `hashPassword(password)`: Asynchroniczna funkcja, która używa modułu bcrypt do hashowania hasła. Zwraca obietnicę, która rozwiązuje się z zahaszowanym hasłem lub wartością null w przypadku błędu.

- `comparePassword(password, hash)`: Asynchroniczna funkcja, która używa modułu bcrypt do porównywania podanego hasła z zahaszowanym hasłem. Zwraca obietnicę, która rozwiązuje się wartością logiczną true, jeśli hasła są zgodne, lub wartością logiczną false w przeciwnym razie.

- `verify(req, res)`: Funkcja obsługi żądania HTTP typu GET, która sprawdza, czy użytkownik jest uwierzytelniony (przez sprawdzenie req.authenticatedId) i zwraca informacje o uwierzytelnionym użytkowniku. Jeśli użytkownik istnieje, usuwa pole hasła z obiektu użytkownika i zwraca go w odpowiedzi jako JSON. W przeciwnym razie zwraca odpowiedni komunikat.

- `login(req, res)`: Funkcja obsługi żądania HTTP typu POST, która obsługuje logowanie użytkownika. Sprawdza, czy podane dane uwierzytelniania są prawidłowe (używając funkcji comparePassword) i generuje token JWT, jeśli uwierzytelnienie powiodło się. Zwraca odpowiednią odpowiedź JSON z tokenem w przypadku sukcesu lub odpowiednim komunikatem w przypadku błędu.

- `register(req, res)`: Funkcja obsługi żądania HTTP typu POST, która obsługuje rejestrację nowego użytkownika. Sprawdza, czy podane dane są prawidłowe, hashowuje hasło (używając funkcji hashPassword), tworzy nowego użytkownika w bazie danych i generuje token JWT dla nowego użytkownika. Zwraca odpowiednią odpowiedź JSON z tokenem w przypadku sukcesu lub odpowiednim komunikatem w przypadku błędu.

- `getUser(req, res, next)`: Middleware (funkcja pośrednicząca) do pobrania informacji o użytkowniku na podstawie req.authenticatedId i przekazania go do następnej funkcji obsługi. Jeśli użytkownik nie zostanie znaleziony, zwracane jest odpowiednie zgłoszenie błędu.

- `getUserHistory(req, res)`: Funkcja obsługi żądania HTTP typu GET, która pobiera historię użytkownika na podstawie req.authenticatedId i zwraca odpowiedź JSON zawierającą historię użytkownika. Jeśli użytkownik lub historia nie zostaną znalezione, zwracane są odpowiednie zgłoszenia błędów.
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
#### Plik auth.model.js
Ten kod definiuje moduł auth, który zawiera metody do interakcji z bazą danych MongoDB. Oto ich działanie:

- `auth.getUserById(id)`: Funkcja, która pobiera użytkownika na podstawie podanego identyfikatora (id). Wykorzystuje metodę findOne z kolekcji "users" w bazie danych, aby znaleźć użytkownika o pasującym identyfikatorze. Zwraca obietnicę, która rozwiązuje się z wynikiem (użytkownikiem) lub odrzuca się z błędem.

- `auth.getUserByEmail(email)`: Funkcja, która pobiera użytkownika na podstawie podanego adresu e-mail (email). Wykorzystuje metodę findOne z kolekcji "users" w bazie danych, aby znaleźć użytkownika o pasującym adresie e-mail. Zwraca obietnicę, która rozwiązuje się z wynikiem (użytkownikiem) lub odrzuca się z błędem.

- `auth.registerUser(user)`: Funkcja, która rejestruje nowego użytkownika w bazie danych. Wykorzystuje metodę insertOne z kolekcji "users" w bazie danych, aby wstawić nowy dokument reprezentujący użytkownika. Przekazuje obiekt user zawierający dane użytkownika, takie jak email, hasło i nazwa użytkownika. Zwraca obietnicę, która rozwiązuje się z wynikiem operacji (nowo utworzonym użytkownikiem) lub odrzuca się z błędem.
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
#### Plik shop.controller.js
Ten kod definiuje kilka funkcji obsługujących operacje na sklepie. Oto ich działanie:

- `exports.getItems`: Funkcja pobiera elementy sklepu na podstawie zapytania. Pobiera wartość stronicowania (pagination) z parametrów zapytania, a także opcjonalne zapytanie wyszukiwania (debouncedSearch) z ciała zapytania. Wykorzystuje model shop do wyszukiwania elementów, które pasują do podanego wyszukiwania (name) i mają liczbę większą od zera (quantity > 0). Wykorzystuje również wartość stronicowania, przeskakując odpowiednią ilość elementów i ograniczając liczbę zwracanych elementów do rozmiaru strony. Zwraca wynik w formacie JSON zawierający elementy sklepu i liczbę wszystkich elementów pasujących do zapytania.

- `exports.addItemToShop`: Funkcja dodaje nowy element do sklepu. Tworzy nowy obiekt shop na podstawie danych przesłanych w ciele żądania. Następnie próbuje zapisać nowy element w bazie danych. Jeśli operacja zakończy się pomyślnie, zwraca status "OK" i nowo utworzony element. W przeciwnym razie zwraca błąd.

- `exports.updateItem`: Funkcja aktualizuje istniejący element w sklepie. W zależności od danych przesłanych w ciele żądania, aktualizuje odpowiednie pola elementu shop. Następnie próbuje zapisać zaktualizowany element w bazie danych. Jeśli operacja zakończy się pomyślnie, zwraca status "OK" i zaktualizowany element. W przeciwnym razie zwraca błąd.

- `exports.getItem`: Funkcja pobiera pojedynczy element sklepu na podstawie przekazanego identyfikatora (productId). Wykorzystuje model shop i metodę findById do wyszukania elementu o pasującym identyfikatorze. Jeśli element nie zostanie znaleziony, zwraca błąd. W przeciwnym razie przekazuje znaleziony element do kolejnej funkcji obsługującej.

- `exports.getShopItems`: Funkcja pobiera listę elementów sklepu na podstawie przekazanych identyfikatorów produktów (products). Iteruje przez każdy przekazany identyfikator, wyszukuje element o pasującym identyfikatorze za pomocą modelu shop i dodaje go do listy products. Jeśli któryś z elementów nie zostanie znaleziony, zwraca błąd. W przeciwnym razie przekazuje listę znalezionych elementów do kolejnej funkcji obsługującej.

- `exports.buyProduct`: Funkcja obsługuje operację zakupu pojedynczego produktu. Sprawdza, czy produkt jest dostępny w odpowiedniej ilości i czy użytkownik ma wystarczającą ilość punktów. Następnie rozpoczyna sesję transakcji, zmniejsza ilość produktu w sklepie, dodaje produkt do koszyka użytkownika i zapisuje historię zakupów. Jeśli wszystko przebiegnie pomyślnie, zwraca status "OK". W przeciwnym razie zwraca błąd.

- `exports.buyProducts`: Funkcja obsługuje operację zakupu wielu produktów. Sprawdza, czy każdy z produktów jest dostępny w odpowiedniej ilości i czy użytkownik ma wystarczającą ilość punktów. Następnie rozpoczyna sesję transakcji, aktualizuje ilość produktów w sklepie, dodaje produkty do koszyka użytkownika i zapisuje historię zakupów. Jeśli wszystko przebiegnie pomyślnie, zwraca status "OK". W przeciwnym razie zwraca błąd.

```js
let shop = require("../models/shop");
const conn = require("../models/connections");
const history = require("../models/history");

exports.getItems = async (req, res) => {
    let pageSize = 25;
    let skip = (req.params.pagination - 1) * pageSize;
    let search = req.body.debouncedSearch;
    if (search == null) {
        search = "";
    }
    let items = await shop
        .find({ name: { $regex: search, $options: "x" }, quantity: { $gt: 0 } } )
        .skip(skip)
        .limit(pageSize);
    let imemCount = await shop.countDocuments({
        name: { $regex: search, $options: "i" },
    });

    return res
        .status(200)
        .send({ status: "OK", items: items, itemCount: imemCount });
};

exports.addItemToShop = async (req, res) => {
    console.log(req.body);
    let item = new shop({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description || "",
        image: req.body.image || "",
        category: req.body.category,
        quantity: req.body.quantity,
    });
    try {
        const newItem = await item.save();
        res.status(200).send({ status: "OK", item: newItem });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
};

exports.updateItem = async (req, res) => {
    if (req.body.name != null) {
        res.item.name = req.body.name;
    }
    if (req.body.price != null) {
        res.item.price = req.body.price;
    }
    if (req.body.description != null) {
        res.item.description = req.body.description;
    }
    if (req.body.image != null) {
        res.item.image = req.body.image;
    }
    if (req.body.category != null) {
        res.item.category = req.body.category;
    }
    if (req.body.quantity != null) {
        res.item.quantity = req.body.quantity;
    }
    try {
        const updatedItem = await res.item.save();
        res.status(200).send({ status: "OK", item: updatedItem });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getItem = async (req, res, next) => {
    let item;
    try {
        item = await shop.findById(req.body.productId);
        if (item == null) {
            return res.status(404).json({ message: "Cannot find item" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.item = item;
    next();
};

exports.getShopItems = async (req, res, next) => {
    let products = [];
    for (let product of req.body.products) {
        let item;
        try {
            item = await shop.findById(product._id);
            if (item == null) {
                return res.status(404).json({ message: "Cannot find item" });
            }
            products.push(item);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    res.items = products;
    next();
};

exports.buyProduct = async (req, res) => {
    const product = res.item;
    if (product.quantity < 0) {
        return res.status(400).json({ message: "Not enough items" });
    }
    if (product.quantity < 1) {
        return res.status(400).json({ message: "Not enough items" });
    }
    const user = res.user;
    const session = await conn.startSession();
    let productHistory = new history();
    try {
        session.startTransaction();
        product.quantity -= 1;
        user.cart.push(product);
        productHistory.user = user._id;
        productHistory.products.push({ product: product._id, quantity: 1 });
        productHistory.date = Date.now();
        await productHistory.save({ session: session });
        await user.save({ session: session });
        await product.save({ session: session });
        await session.commitTransaction();
        return res.status(200).json({ status: "OK" });
    } catch (err) {
        await session.abortTransaction();
        return res.status(500).json({ message: err.message });
    } finally {
        session.endSession();
    }
};

exports.buyProducts = async (req, res) => {
    const products = res.items;
    for (let productIndex in products) {
        let product = products[productIndex];
        if (
            product.quantity < 0 ||
            req.body.products[productIndex].quantity > product.quantity
        ) {
            return res.status(400).json({ message: "Not enough items" });
        }
    }

    const user = res.user;
    const session = await conn.startSession();
    let productHistory = new history();

    try {
        session.startTransaction();
        productHistory.user = user._id;
        for (let productIndex in products) {
            let product = products[productIndex];
            product.quantity -= req.body.products[productIndex].quantity;
            user.cart.push({
                product: product._id,
                quantity: req.body.products[productIndex].quantity,
            });
            productHistory.products.push({
                product: product._id,
                quantity: req.body.products[productIndex].quantity,
            });
            await product.save({ session: session });
        }
        productHistory.date = Date.now();
        await productHistory.save({ session: session });
        await user.save({ session: session });
        await session.commitTransaction();
        return res.status(200).json({ status: "OK" });
    } catch (err) {
        await session.abortTransaction();
        return res.status(500).json({ message: err.message });
    } finally {
        session.endSession();
    }
};
```
#### Plik user.controller.js
Ten kod definiuje dwie funkcje obsługujące operacje na użytkowniku oraz zakupie przedmiotu w sklepie. Oto ich działanie:

- `exports.getUser`: Funkcja pobiera informacje o użytkowniku na podstawie uwierzytelnionego identyfikatora (req.authenticatedId). Zwraca status "OK" i dane użytkownika w formacie JSON.

- `exports.buyItem`: Funkcja obsługuje operację zakupu przedmiotu przez użytkownika. Pobiera uwierzytelniony identyfikator użytkownika (req.authenticatedId) oraz identyfikator zakupionego przedmiotu (req.params.id). Następnie pobiera dane użytkownika i przedmiotu z odpowiednich modeli (userData i product). Sprawdza, czy ilość przedmiotu w sklepie jest większa lub równa żądanej ilości (req.body.quantity). Jeśli ilość jest niewystarczająca, zwraca błąd. Następnie, w ramach transakcji, zmniejsza ilość przedmiotu w sklepie o żądaną ilość. Dodaje również informacje o zakupionym przedmiocie do koszyka użytkownika. Po zakończeniu transakcji zapisuje zmiany w bazie danych. Jeśli operacja zakończy się pomyślnie, zwraca status "OK" i zaktualizowane dane użytkownika w formacie JSON. W przypadku błędu, zwraca odpowiedni błąd w formacie JSON.
```js
let user = require("../models/user.js");
let shop = require("../models/shop");
const mongoose = require("mongoose");
exports.getUser = async (req, res) => {
    return res.status(200).send({ status: "OK", user: req.authenticatedId });
};

exports.buyItem = async (req, res) => {
    let userData, product;
    try {
        userData = await userData.findById(req.authenticatedId);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    try {
        product = await shop.findById(req.params.id);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    if (product.quantity < req.body.quantity) {
        res.status(400).json({ message: "Not enough items in stock" });
    }
    product.quantity -= req.body.quantity;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        userData.cart.push({ ...product._doc, quantity: req.body.quantity });
        await userData.save({ session: session });
        await product.save({ session: session });
        await session.commitTransaction();
        session.endSession();
        res.status(200).send({ status: "OK", user: userData });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: err.message });
    }
};
```
### Katalog models
Modele są strukturami, które definiują strukturę i zachowanie danych w bazie danych. Modele stanowią podstawę do tworzenia, odczytu, aktualizacji i usuwania danych w bazie danych. Są one często reprezentacją obiektów w aplikacji, które są mapowane na kolekcje w bazie danych.

#### Plik connections.js
Model ten odpowiada za nawiązywanie połączenia z bazą danych.
```js
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://Mardorus:PokerAGH@poker.gmn3mgg.mongodb.net/barberShop?retryWrites=true&w=majority",
    { useNewUrlParser: true }
);

const conn = mongoose.connection;

conn.on("error", () => console.error.bind(console, "connection error"));

conn.once("open", () => console.info("Connection to Database is successful"));

module.exports = conn;
```
#### Plik history.js
Model ten definiuje schemat dla kolekcji "purchaseHsitory" w bazie danych.
Schemat zawiera pola takie jak:

- `user` - pole typu ObjectId, które odnosi się do dokumentu w kolekcji "users". Jest wymagane (required: true).
- `products` - tablica obiektów, gdzie każdy obiekt zawiera:
- `product` - pole typu ObjectId, które odnosi się do dokumentu w kolekcji "products". Jest wymagane (required: true).
- `quantity` - pole typu Number, które reprezentuje ilość produktów. Jest wymagane (required: true).
- `date` - pole typu Date, które reprezentuje datę zakupu. Jest wymagane (required: true).
```js
const mongoose = require("mongoose");

const purchaseHistory = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    date: {
        type: Date,
        required: true,
    },

});

module.exports = mongoose.model("history", purchaseHistory);
```
#### Plik shop.js
Model ten definiuje schemat dla kolekcji "products" w bazie danych.
Schemat zawiera pola takie jak:

- `name` - pole typu String, które reprezentuje nazwę produktu. Jest wymagane (required: true).
- `price` - pole typu Number, które reprezentuje cenę produktu. Jest wymagane (required: true).
- `description` - pole typu String, które reprezentuje opis produktu. Nie jest wymagane (required: false).
- `image` - pole typu String, które reprezentuje ścieżkę do obrazka produktu. Nie jest wymagane (required: false).
- `category` - pole typu String, które reprezentuje kategorię produktu. Jest wymagane (required: true). Może przyjąć wartości: "shampoo", "conditioner", "mask", "oils". Jest również - zdefiniowany enum, który ogranicza wartości do tych podanych.
- `quantity` - pole typu Number, które reprezentuje ilość produktów. Jest wymagane (required: true).
```js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: true,
        enum: ["shampoo", "conditioner", "mask", "oils"],
        defaultValue: "shampoo",
    },
    quantity: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("products", productSchema);
```

#### Plik user.js
Model ten definiuje schemat dla kolekcji "users" w bazie danych.
Schemat zawiera pola takie jak:

- `username` - pole typu String, które reprezentuje nazwę użytkownika. Jest wymagane (required: true) i unikalne (unique: true).
- `password` - pole typu String, które reprezentuje hasło użytkownika. Jest wymagane (required: true) i unikalne (unique: true).
- `email` - pole typu String, które reprezentuje email użytkownika. Jest wymagane (required: true) i unikalne (unique: true).
- `image` - pole typu String, które reprezentuje ścieżkę do obrazka produktu. Nie jest wymagane (required: false).
- `premisson` - pole typu Number, które reprezentuje pozwolenia. Nie jest wymagane (required: false) i jest zdefiniowane domyślnie na 1. 
- `cart` - pole typu [usersProductsSchema], które reprezentuje zakupy w koszyku.

Dodatkowo mamy zdefiniowany schemat "usersProductsSchema". Zawiera on takie pola jak:

- `product` - obiekt typu produkt. Jest wymagany (required: true).

- `quantity` - pole typu Number, które reprezentuje liczbę produktów. Jest wymagane (required: true).

```js
const mongoose = require("mongoose");
const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const usersProductsSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, "Please fill a valid email address"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    permissions: {
        type: Number,
        required: false,
        default: 1,
    },
    cart: [usersProductsSchema],
});

module.exports = mongoose.model("users", userSchema);
```
### Katalog routes
Zawiera moduły, które definiują zestaw endpointów dostępnych w aplikacji. Są one odpowiedzialne za obsługę żądań klienta i przekierowywanie ich do odpowiednich funkcji obsługujących.

#### Plik auth.js
Poniżej znajduje się opis każdej zdefiniowanej ścieżki:

- `POST /auth/verify`: Ta ścieżka wymaga walidacji tokenu JWT użytkownika za pomocą middleware authUtils.validateToken. Jeśli token jest poprawny, kontroler auth.verify zostanie wywołany.

- `POST /auth/login`: Ta ścieżka obsługuje logowanie użytkownika. Gdy żądanie zostanie wysłane do tej ścieżki, kontroler auth.login zostanie wywołany.

- `POST /auth/register`: Ta ścieżka obsługuje rejestrację nowego użytkownika. Gdy żądanie zostanie wysłane do tej ścieżki, kontroler auth.register zostanie wywołany.

```js
const express = require('express');

let router = express.Router()
let auth = require('../controllers/auth.controller.js');

// Use authUtils.validateToken middleware to validate user JWT token
// It will be then available under req.authenticatedId in controller.

let authUtils = require('../utils/authUtils');

// Endpoints for "/auth" API route

router.post("/verify", authUtils.validateToken, auth.verify)

router.post("/login", auth.login)

router.post("/register", auth.register)

module.exports = router;
```
#### Plik shop.js

Poniżej znajduje się opis każdej zdefiniowanej ścieżki:

- `GET /getItems/:pagination`: Ta ścieżka obsługuje pobieranie przedmiotów związanych ze sklepem. Parametr pagination określa numer strony wyników. Kontroler shop.getItems zostanie wywołany w celu obsługi tego żądania.

- `POST /buyItem`: Ta ścieżka obsługuje zakup pojedynczego przedmiotu ze sklepu. Przed wykonaniem zakupu, token JWT użytkownika jest sprawdzany za pomocą middleware authUtils.validateToken, a następnie kontrolery user.getUser, shop.getItem i shop.buyProduct są wywoływane w kolejności.

- `POST /buyItems`: Ta ścieżka obsługuje zakup wielu przedmiotów ze sklepu. Podobnie jak w przypadku buyItem, token JWT użytkownika jest sprawdzany, a następnie kolejne kontrolery user.getUser, shop.getShopItems i shop.buyProducts są wywoływane.

- `POST /addProduct`: Ta ścieżka umożliwia dodanie nowego przedmiotu do sklepu. Podobnie jak w poprzednich przypadkach, token JWT użytkownika jest sprawdzany, a kontroler shop.addItemToShop jest wywoływany.

```js
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

router.post(
    "/buyItems",
    authUtils.validateToken,
    user.getUser,
    shop.getShopItems,
    shop.buyProducts
);

router.post("/addProduct", authUtils.validateToken, shop.addItemToShop);

module.exports = router;
```
#### Plik user.js
Poniżej znajduje się opis tej zdefiniowanej ścieżki:

- `GET /getUserData`: Ta ścieżka obsługuje pobieranie danych użytkownika. Przed dostępem do tych danych, token JWT użytkownika jest sprawdzany za pomocą middleware authUtils.validateToken. Jeśli token jest ważny i autoryzacja przebiega pomyślnie, kontroler user.getUser jest wywoływany w celu obsługi tego żądania.

```js
const express = require('express');

let router = express.Router()
let user = require('../controllers/user.controller.js');

// Use authUtils.validateToken middleware to validate user JWT token
// It will be then available under req.authenticatedId in controller.

let authUtils = require('../utils/authUtils');

// Endpoints for "/auth" API route

router.get("/getUserData", authUtils.validateToken, user.getUser)

module.exports = router;
```
### Katalog utils
katalog zawiera funkcję pomocniczą związaną z autentykacją.

#### Plik authUtils.js
Metoda eksportuje funkcję validateToken, która jest wykorzystywana jako pośrednik (middleware) w ścieżkach routera do autoryzacji.
- `validateToken` -  przyjmuje trzy argumenty: req (obiekt z żądaniem), res (obiekt odpowiedzi) i next (funkcję, która przechodzi do kolejnego pośrednika lub obsługuje końcową funkcję obsługi żądania). Sprawdza, czy w nagłówkach żądania znajduje się token autoryzacyjny. Jeśli token nie istnieje lub jest pusty, zwraca odpowiedź z kodem stanu 200 i informacją o błędzie "UNAUTHORIZED". Następnie, próbuje zweryfikować token JWT za pomocą funkcji jwt.verify(). W przypadku błędu (np. nieprawidłowy token lub wygasły token), zwraca odpowiedź z kodem stanu 200 i informacją o błędzie "UNAUTHORIZED". Jeśli weryfikacja tokena powiedzie się, sprawdza, czy wewnątrz zdekodowanego tokenu znajduje się identyfikator (id). Jeśli tak, przypisuje go do req.authenticatedId, co pozwala na dostęp do zautoryzowanego identyfikatora w kolejnych funkcjach obsługi. Jeśli token został pomyślnie zweryfikowany i zawiera identyfikator, przechodzi do kolejnej funkcji pośredniczącej lub do końcowej funkcji obsługi żądania za pomocą next(). Jeśli token nie zawiera identyfikatora lub wystąpił inny błąd, zwraca odpowiedź z kodem stanu 200 i informacją o błędzie "UNAUTHORIZED".

```js
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
        return res.status(200).send({ status: "error", err: "UNAUTHORIZED" });;
```
## Opis frontendu
Do implementacji frontendu użyliśmy frameworku NextJS. Z racji, iż najważniejsza część projektu polega na stworzeniu logiki w backendzie, frontend zostanie opisany ogólniej, często bez konkretnego tłumaczenia co robią poszczególne elementy.

### Katalog public

#### styles/index.scss
```scss
@import './components/layout.scss';
@import './components/products.scss';
@import './components/basket.scss';
```
#### styles/components/basket.scss
```scss
.basketMain {
    display: flex;
    flex-direction: row;
    width: 50%;
    margin: 5px;
    justify-content: space-between;
    & > div {
        background-color: lavenderblush;
        padding: 5px;
        border-radius: 10px;
        color: black;
        cursor: pointer;
    }
}
```
#### styles/components/layout.scss
```scss
.header {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 5vh;
    background-color: lightslategray;
}
.header_logo {
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.header_dropdown {
    width: 80%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 2rem;
}
.dropdownMain {
    width: 40%;
    position: absolute;
}
.dropdownMenu {
    height: 40%;
    position: absolute;
}

.inside-pagination-chevron {
    background-color: gray;
    border-radius: 50%;
    cursor: pointer;
    width: 30px;
    height: 30px;
    transition: all 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: gray;

        i {
            color: white;
        }
    }
}

.inside-pagination-chevron-disabled {
    background-color: gray;
    border-radius: 50%;
    cursor: default;
    width: 30px;
    height: 30px;
    transition: all 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pagination-inside {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
    background-color: gray;
    padding: 5px 5px 5px 5px;
    border-radius: 19px;
    margin-top: 0px;
    font-weight: 500;
    margin-bottom: 0px;
    -webkit-box-shadow: 0px 0px 50px -6px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 0px 50px -6px rgba(0, 0, 0, 0.2);

    .pagination-chevron {
        background-color: gray;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        transition: all 0.2s;
        cursor: pointer;

        i {
            user-select: none;
        }

        &:hover {
            background-color: gray;

            i {
                color: white;
            }
        }
    }

    .pagination-chevron-disabled {
        background-color: gray;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        pointer-events: none;
    }

    li {
        display: inline-block;
        border-radius: 2px;
        text-align: center;
        vertical-align: top;
        height: 30px;

        a {
            background-color: transparent;
            display: inline-block;
            font-size: 0.9rem;
            line-height: 30px;
            transition: all 0.2s;

            &:hover {
                color: #0090ff;
                font-size: 130%;
            }
        }

        &.active a {
            font-size: 130%;
            font-weight: 500;
            color: white;
        }

        i {
            font-size: 2rem;
        }
    }

    li.pages ul li {
        display: inline-block;
        float: none;
    }
}
.loginForm {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    & > div {
        width: 40%;
        height: 5vh;
        display: flex;
        flex-direction: column;
        & > input {
            border-radius: 5px;
            padding: 5px;
            color: white;
        }
    }
    & > button {
        width: 40%;
        height: 3vh;
        border-radius: 5px;
        background-color: gray;
        color: white;
        font-weight: 500;
        transition: all 0.2s;
        margin: 10px;
        &:hover {
            background-color: gray;
            color: white;
        }
    }
}
```
#### styles/components/products.scss
```scss
.products {
    width: 100%;
    height: auto;
}

.header-input {
    width: 100%;
    height: 5vh;
    display: flex;
    justify-content: center;
    & > input {
        width: 40%;
        height: 80%;
        border-radius: 5px;
        margin: 10px;
        padding: 10px;
    }
}

.productsTable {
    width: 80%;
    margin-left: 10%;
}
.productListItem {
    text-align: center;
    padding: 5px;
}
.productListItemButton {
    @extend .productListItem;
    background-color: gray;
    border-radius: 10px;
}
.paginationContainer {
    width: 100%;
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
        width: 10%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
```

### Katalog src

#### components

- Authorization/AuthorizationUtils.tsx
```tsx
//@ts-ignore
import { serialize, parse } from 'cookie'
import { verify } from '@/services/authService'

const comparePermissions = (userPermissions: any, requiredPermissions: any) => {
    let binaryUser = parseInt(userPermissions).toString(2)
    let binaryRequired = parseInt(requiredPermissions).toString(2)

    while (binaryUser.length != binaryRequired.length) {
        if (binaryUser.length < binaryRequired.length) {
            binaryUser = '0' + binaryUser
        } else {
            binaryRequired = '0' + binaryRequired
        }
    }

    let authenticationSuccess = false

    for (let i = 0; i < binaryUser.length; i++) {
        if (binaryUser[i] == binaryRequired[i] && binaryUser[i] == '1') {
            authenticationSuccess = true
        }
    }

    return authenticationSuccess
}

export const notAuthenticatedVerification = async (
    req: any,
    pageProps: any,
    permissions?: number
) => {
    let cookies = parse(req.headers?.cookie || '')

    if (!cookies.jwt_token) {
        return {
            props: {
                ...pageProps,
                xuser: null,
            },
        }
    }

    let response: any = await verify(cookies.jwt_token)

    return {
        props: {
            ...pageProps,
            xuser: response.user || null,
            token: cookies.jwt_token,
        },
    }
}

export const authenticatedVerification = async (
    req: any,
    pageProps: any,
    permissions?: number
) => {
    let cookies = parse(req.headers?.cookie || '')

    if (!cookies.jwt_token) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
            props: {
                ...pageProps,
                xuser: null,
            },
        }
    }

    let verification: any = await verify(cookies.jwt_token)
    return {
        props: {
            xuser: verification.user,
            token: cookies.jwt_token,
            ...pageProps,
        },
    }
}

export const loginVerification = async (
    req: any,
    res: any,
    pageProps: any,
    permissions?: any
) => {
    let cookies = parse(req.headers?.jwt_token || '')

    if (!cookies.jwt_token) {
        const cookie = serialize('jwt_token', pageProps.token, {
            maxAge: 24 * 7 * 60 * 60,
            expires: new Date(Date.now() + 24 * 7 * 60 * 60 * 1000),
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
        })
        res.setHeader('Set-Cookie', cookie)
        let verification: any = await verify(pageProps.token)
        console.log(verification)
        if (verification.status != 'OK') {
            return {
                redirect: {
                    permanent: false,
                    destination: '/login',
                },
                props: {
                    ...pageProps,
                    xuser: null,
                },
            }
        }
        return {
            redirect: {
                permanent: false,
                destination: '/',
            },
            props: {
                xuser: verification.user,
                token: pageProps.token,
            },
        }
    }

    return {
        redirect: {
            permanent: false,
            destination: '/login',
        },
        props: {
            token: pageProps.token,
            xuser: null,
        },
    }
}

export const logoutVerification = async (
    req: any,
    res: any,
    pageProps: any
) => {
    const cookie = serialize('jwt_token', 'deleted', {
        maxAge: -1,
        httpOnly: true,
        //secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    })

    res.setHeader('Set-Cookie', cookie)

    return {
        redirect: {
            permanent: false,
            destination: '/login',
        },
        props: {
            xuser: null,
        },
    }
}
```
- Basket/BasketMain.tsx
```tsx
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Layout } from '../Layout/Layout'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BuyProducts } from '../../services/shopService'
interface basketItem {
    _id: number | string
    name: string
    price: number
    quantity: number
}

const BasketMain = (props: any) => {
    const router = useRouter()
    const [basket, setBasket] = useState<basketItem[]>([])

    useEffect(() => {
        getBasket()
    }, [])

    const getBasket = async () => {
        let basketData = await AsyncStorage.getItem('basket')
        if (basketData == null) basketData = JSON.stringify([])
        let basketArray = JSON.parse(basketData)
        setBasket(basketArray)
    }

    const handleProductBuy = async (productIndex: number) => {
        let sendData = {
            price: basket[productIndex].price * basket[productIndex].quantity,
            products: [
                {
                    _id: basket[productIndex]._id,
                    quantity: basket[productIndex].quantity,
                },
            ],
        }

        let response: any = await BuyProducts(sendData, props.token)
        if (response.status == 'OK') {
            router.push({
                pathname: '/',
            })
        } else {
            alert(response.response.data.message)
        }
    }

    const handleRemoveProduct = async (productIndex: number) => {
        let basketData = await AsyncStorage.getItem('basket')
        if (basketData == null) basketData = JSON.stringify([])
        let basketArray = JSON.parse(basketData)
        basketArray.splice(productIndex, 1)
        await AsyncStorage.setItem('basket', JSON.stringify(basketArray))
        setBasket(basketArray)
    }

    const removeBasket = async () => {
        await AsyncStorage.setItem('basket', JSON.stringify([]))
        setBasket([])
    }

    const handleBuyAll = async () => {
        let sendData: {
            price: number
            products: {
                _id: number | string
                quantity: number
            }[]
        } = {
            price: 0,
            products: [],
        }
        basket.forEach((item: basketItem) => {
            sendData.price += item.price * item.quantity
            sendData.products.push({
                _id: item._id,
                quantity: item.quantity,
            })
        })

        let response: any = await BuyProducts(sendData, props.token)
        if (response.status == 'OK') {
            removeBasket()
            router.push({
                pathname: '/',
            })
        } else {
            alert(response.response.data.message)
        }
    }

    return (
        <Layout user={props.xuser}>
            <div className="products">
                {basket.map((item: basketItem, index: number) => (
                    <div key={index} className="basketMain">
                        Name: {item.name}
                        {'\t'}
                        Price: {item.price}
                        {'\t'}
                        Quantity: {item.quantity}
                        <div
                            onClick={() => {
                                handleProductBuy(index)
                            }}
                        >
                            Buy single product
                        </div>
                        <div
                            onClick={() => {
                                handleRemoveProduct(index)
                            }}
                        >
                            Remove product
                        </div>
                    </div>
                ))}
                <div className="basketMain">
                    <div
                        onClick={() => {
                            handleBuyAll()
                        }}
                    >
                        Buy products
                    </div>
                    <div
                        onClick={() => {
                            removeBasket()
                        }}
                    >
                        Remove products
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export { BasketMain }
```
- Layout/Header.tsx
```tsx
import React, { useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import { useRouter } from 'next/router'

const Header = (props: any) => {
    const router = useRouter()
    const options = [
        [
            { value: '', label: 'Products' },
            { value: 'addProduct', label: 'Add Product' },
            { value: 'basket', label: 'basket' },
            { value: 'logout', label: 'Logout' },
            { value: 'shopHistory', label: 'history' },
        ],
        [
            { value: '', label: 'Products' },
            { value: 'basket', label: 'basket' },
            { value: 'login', label: 'Login' },
            { value: 'register', label: 'Register' },
        ],
    ]

    const [currentValue, setCurrentValue] = useState(0)
    const [userType, setUserType] = useState(0)
    useEffect(() => {
        console.log(props.user)
        if (props.user != null && props.user != undefined) {
            console.log(`User ${props.user}`)
            setUserType(0)
            if (router.pathname == '/products' || router.pathname == '/') {
                setCurrentValue(0)
            } else if (router.pathname == '/basket') {
                setCurrentValue(1)
            } else if (router.pathname == '/shopHistory') {
                setCurrentValue(3)
            }
        } else {
            setUserType(1)
            if (router.pathname == '/products' || router.pathname == '/') {
                setCurrentValue(0)
            } else if (router.pathname == '/basket') {
                setCurrentValue(1)
            } else if (router.pathname == '/login') {
                setCurrentValue(2)
            } else if (router.pathname == '/register') {
                setCurrentValue(3)
            }
        }
    }, [])

    return (
        <div className="header">
            <div className="header_logo">LOGO</div>
            <div className="header_dropdown">
                <div
                    style={{
                        width: '60%',
                        backgroundColor: 'transparent',
                    }}
                ></div>
                <Dropdown
                    options={options[userType]}
                    onChange={(e) => {
                        router.push(`/${e.value}`)
                    }}
                    value={options[userType][currentValue]}
                    placeholder="Menu"
                    className="dropdownMain"
                    menuClassName="dropDownMenu"
                />
            </div>
        </div>
    )
}

export { Header }
```

- Layout/Layout.tsx
```tsx
import React from 'react'
import { Header } from './Header'

const Layout = (props: any) => {
    return (
        <div className="site">
            <Header user={props.user} />
            {props.children}
        </div>
    )
}

export { Layout }
```
- Products/addProducts.tsx
```tsx
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Layout } from '../Layout/Layout'
import { addProduct } from '../../services/authService'

const AddProduct = (props: any) => {
    console.log(props)
    const router = useRouter()
    const [name, setName] = useState<string>('')
    const [price, setPrice] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(0)
    const [category, setCategory] = useState<string>('')
    const handleAddProduct = async () => {
        if (name == '' || category == '') return
        if (price < 0 || quantity < 0) return
        console.log(name, price, quantity, category)
        let res: any = await addProduct(
            {
                name: name,
                price: price,
                quantity: quantity,
                category: category,
            },
            props.token
        )
        if (res.status == 'OK') {
            router.push({
                pathname: '/',
            })
        }
    }

    return (
        <Layout>
            <div className="loginForm">
                <div>
                    Name:
                    <input
                        type="text"
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    />
                </div>
                <div>
                    Price:
                    <input
                        type="number"
                        onChange={(e) => {
                            setPrice(parseInt(e.target.value))
                        }}
                    />
                </div>
                <div>
                    Quantity:
                    <input
                        type="number"
                        onChange={(e) => {
                            setQuantity(parseInt(e.target.value))
                        }}
                    />
                </div>
                <div>
                    Category:
                    <select onChange={(e) => setCategory(e.target.value)}>
                        <option value="shampoo">Shampoo</option>
                        <option value="conditioner">Hair conditioner</option>
                        <option value="mask">Mask</option>
                        <option value="oils">Oils</option>
                    </select>
                </div>
                <button onClick={handleAddProduct}>Add product</button>
            </div>
        </Layout>
    )
}

export { AddProduct }
```
- Register/RegisterMain.tsx
```tsx
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Layout } from '../Layout/Layout'
import { useDebounce } from '../utils/useDebounce'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Pagination } from '../utils/Pagination'
import { register } from '../../services/authService'
const RegisterMain = (props: any) => {
    console.log(props)
    const router = useRouter()
    const [userName, setUserName] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [confirmPassword, setConfirmPassword] = useState<string>()
    const handleRegister = async () => {
        console.log(userName)
        console.log(password)
        console.log(confirmPassword)
        if (
            userName == '' ||
            password == '' ||
            email == '' ||
            confirmPassword == ''
        )
            return
        if (password != confirmPassword) return
        console.log('SENDING REGISTER')
        let res: any = await register({
            username: userName,
            password: password,
            email: email,
        })
        if (res.status == 'OK') {
            router.push({
                pathname: '/auth',
                query: { token: res.data.token.toString() },
            })
        }
    }

    return (
        <Layout>
            <div className="loginForm">
                <div>
                    UserName:
                    <input
                        type="text"
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}
                    />
                </div>
                <div>
                    Email:
                    <input
                        type="text"
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                </div>
                <div>
                    Password:
                    <input
                        type="password"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                </div>
                <div>
                    Confirm Password:
                    <input
                        type="password"
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                        }}
                    />
                </div>
                <button onClick={handleRegister}>Register</button>
                <button
                    onClick={() => {
                        router.push('/login')
                    }}
                >
                    login
                </button>
            </div>
        </Layout>
    )
}

export { RegisterMain }
```
- Shop/ShopList.tsx
```tsx
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Layout } from '../Layout/Layout'
import { useDebounce } from '../utils/useDebounce'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Pagination } from '../utils/Pagination'
import { ShopListItem } from './ShopListItem'

const ShopList = (props: any) => {
    console.log(props)
    const router = useRouter()

    let [search, setSearch] = useState<string>('')
    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
        refreshSite(1)
    }, [debouncedSearch])

    const refreshSite = (page: number) => {
        router.replace(
            router.pathname +
                '?page=' +
                page +
                '&debouncedsearch=' +
                debouncedSearch
        )
    }

    const setPage = (newPage: number): void => {
        router.replace(
            router.pathname +
                '?page=' +
                newPage +
                '&debouncedsearch=' +
                debouncedSearch
        )
    }

    const generateHeader = (): React.ReactElement[] => {
        let headerArr: React.ReactElement[] = []

        let headerItems: string[] = [
            'name',
            'price',
            'quantity',
            'category',
            'actions',
        ]

        headerItems.forEach((item: string, index: number) => {
            headerArr.push(
                <th className="productListHeaderItem">
                    <div>{item}</div>
                </th>
            )
        })
        return headerArr
    }

    const generateUserItems = (): React.ReactElement[] => {
        console.log(props)
        let userItemsArr: React.ReactElement[] = []
        let keyIndex = 0
        for (let product of props.shopItems) {
            userItemsArr.push(
                <ShopListItem
                    key={keyIndex}
                    product={product}
                    token={props.token}
                    refreshSite={() => {
                        refreshSite(1)
                    }}
                />
            )
            keyIndex++
        }
        return userItemsArr
    }

    return (
        <Layout user={props.xuser}>
            <div className="products">
                <div className="header-input">
                    <input
                        type="text"
                        className="search-inpu"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <PerfectScrollbar>
                    <table className="productsTable">
                        <thead>
                            <tr className="productItem">{generateHeader()}</tr>
                        </thead>
                        <tbody>{generateUserItems()}</tbody>
                    </table>
                </PerfectScrollbar>
                <div
                    className="paginationContainer"
                    style={{ marginTop: '10px' }}
                >
                    <Pagination
                        inside={true}
                        maxPages={
                            Math.floor(props.itemCount / 25) == 0
                                ? 1
                                : props.itemCount / 25
                        }
                        currentPage={parseInt(props.page)}
                        setPage={setPage}
                    />
                </div>
            </div>
        </Layout>
    )
}

export { ShopList }
```
- Shop/ShopItemList
```tsx
import React from 'react'
import { buyShopItem } from '../../services/shopService'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ShopListItem = ({
    product,
    token,
    refreshSite,
}: {
    product: {
        _id: number | string
        name: string
        price: number
        quantity: number
        category: string
    }
    token: string
    refreshSite: () => void
}) => {
    const handlePress = async () => {
        let basket = await AsyncStorage.getItem('basket')
        if (basket == null) basket = JSON.stringify([])
        let basketArray = JSON.parse(basket)
        let itemExits = basketArray.find((item: any) => {
            return item._id == product._id
        })
        if (itemExits) {
            itemExits.quantity++
        } else {
            let tempProduct = {
                _id: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
            }
            basketArray.push(tempProduct)
        }

        await AsyncStorage.setItem('basket', JSON.stringify(basketArray))
        alert('Product added to basket')
    }

    return (
        <tr className="productItem">
            <td className="productListItem">{product.name}</td>
            <td className="productListItem">{product.price}</td>
            <td className="productListItem">{product.quantity}</td>
            <td className="productListItem">{product.category}</td>

            <td
                className="productListItemButton"
                style={{ cursor: 'pointer' }}
                onClick={handlePress}
            >
                {/* <Link href={`/admin/app/groups/${item.id}`}> */}
                Buy product
                {/* </Link> */}
            </td>
        </tr>
    )
}

export { ShopListItem }
```
- utils/Pagination.tsx
```tsx
import React from 'react'
import clsx from 'clsx'

//If use Inside of component set "inside" property in tag to true (ex. <Pagination inside={true} />"

const Pagination = (props: any) => {
    const generateItems = () => {
        let children = []

        for (let i = props.currentPage - 3; i <= props.currentPage + 3; i++) {
            if (i == props.currentPage) {
                children.push(
                    <li key={i} className="active">
                        <a>{i}</a>
                    </li>
                )
            } else if (i >= 1 && i <= props.maxPages) {
                if (Math.abs(props.currentPage - i) <= 2) {
                    children.push(
                        <li
                            key={i}
                            className="waves-effect"
                            onClick={() => {
                                props.setPage(i)
                            }}
                        >
                            <a>{i}</a>
                        </li>
                    )
                } else if (i == 1 || i == props.maxPages) {
                    children.push(
                        <li
                            key={i}
                            className="waves-effect"
                            onClick={() => {
                                props.setPage(i)
                            }}
                        >
                            <a>{i}</a>
                        </li>
                    )
                }
            }
        }

        return children
    }

    return (
        <div>
            <ul className={props.inside ? 'pagination-inside' : 'pagination'}>
                <li
                    className={
                        props.currentPage == 1
                            ? 'pagination-chevron-disabled'
                            : 'pagination-chevron'
                    }
                    onClick={() => {
                        if (props.currentPage != 1) {
                            props.setPage(parseInt(props.currentPage) - 1)
                        }
                    }}
                >
                    <a>
                        <i
                            className="material-icons"
                            style={{ lineHeight: 'inherit' }}
                        >
                            {'<'}
                        </i>
                    </a>
                </li>
                {props.currentPage > 4 ? (
                    <span>
                        <li
                            className="waves-effect"
                            onClick={() => {
                                props.setPage(1)
                            }}
                        >
                            <a>1</a>
                        </li>
                        <li className="disabled" style={{ marginLeft: '15px' }}>
                            <a>...</a>
                        </li>
                    </span>
                ) : (
                    <span></span>
                )}
                {generateItems()}
                {props.currentPage < props.maxPages - 3 ? (
                    <span>
                        <li
                            className="disabled"
                            style={{ marginRight: '15px' }}
                        >
                            <a>...</a>{' '}
                        </li>
                        <li
                            className="waves-effect"
                            onClick={() => {
                                props.setPage(props.maxPages)
                            }}
                        >
                            <a>{props.maxPages}</a>
                        </li>
                    </span>
                ) : (
                    <span></span>
                )}
                <li
                    className={
                        props.currentPage == props.maxPages
                            ? 'pagination-chevron-disabled'
                            : 'pagination-chevron'
                    }
                    onClick={() => {
                        if (props.currentPage != props.maxPages) {
                            props.setPage(parseInt(props.currentPage) + 1)
                        }
                    }}
                >
                    <a>
                        <i
                            className="material-icons"
                            style={{ lineHeight: 'inherit' }}
                        >
                            {'>'}
                        </i>
                    </a>
                </li>
            </ul>
        </div>
    )
}

export { Pagination }
```
- utils/useDebounce.tsx
```tsx
import React, { useState, useEffect } from 'react'

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value])

    return debouncedValue
}

export { useDebounce }
```
#### Katalog pages
- addProduct/index.tsx
```tsx
import { authenticatedVerification } from '@/components/Authorization/AuthorizationUtils'
import { AddProduct } from '@/components/Products/addProcuts'

const Home = (props: any) => {
    return <AddProduct {...props} />
}

export default Home

export const getServerSideProps = async (context: any) => {
    let data = await authenticatedVerification(context.req, {}, 1)

    // data.props.shopItems = shopItems.items;
    return data
}
```
- api/hello.ts
```ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    name: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    res.status(200).json({ name: 'John Doe' })
}
```
- auth/index.tsx
```tsx
import React from 'react'
import { loginVerification } from '@/components/Authorization/AuthorizationUtils'

const Index = () => {
    return <div></div>
}

export default Index

export const getServerSideProps = async (context:any) => {
    return loginVerification(context.req, context.res, {
        token: context.query.token,
    })
}
```
- basket/index.tsx
```tsx
import { authenticatedVerification } from '@/components/Authorization/AuthorizationUtils'
import { BasketMain } from '@/components/Basket/BasketMain'

const Home = (props: any) => {
    return <BasketMain {...props} />
}

export default Home

export const getServerSideProps = async (context: any) => {
    let data = await authenticatedVerification(context.req, {}, 1)
   
    // data.props.shopItems = shopItems.items;
    return data
}
```
- login/index.tsx
```tsx
import { Inter } from 'next/font/google'
import { notAuthenticatedVerification } from '@/components/Authorization/AuthorizationUtils'
import { LoginMain } from '@/components/Login/LoginMain'
const inter = Inter({ subsets: ['latin'] })

const Home = (props: any) => {
    return <LoginMain {...props} />
}

export default Home

export const getServerSideProps = async (context: any) => {
    let data = await notAuthenticatedVerification(context.req, {}, 1)
    // if (data.props.xusr != null && data.props.xusr) {
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: '/',
    //         },
    //         props: {
    //             ...data.props,
    //         },
    //     }
    // }
    return data
}
```
- logout/index.tsx
```tsx
import React from 'react';
import { logoutVerification } from '@/components/Authorization/AuthorizationUtils';

const Index = () => {
    return (
        <div></div>
    )
}

export default Index;

export const getServerSideProps = async (context:any) => {
    return logoutVerification(context.req, context.res, {});
}
```
- register/index.tsx
```tsx
import { Inter } from 'next/font/google'
import { notAuthenticatedVerification } from '@/components/Authorization/AuthorizationUtils'
import { RegisterMain } from '@/components/Register/RegisterMain'
const inter = Inter({ subsets: ['latin'] })

const Home = (props: any) => {
    return <RegisterMain {...props} />
}

export default Home

export const getServerSideProps = async (context: any) => {
    let data = await notAuthenticatedVerification(context.req, {}, 1)
    // if (data.props.xusr != null && data.props.xusr) {
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: '/',
    //         },
    //         props: {
    //             ...data.props,
    //         },
    //     }
    // }
    return data
}
```
- _app.tsx
```tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import 'react-dropdown/style.css'
import '../../public/styles/index.scss'
export default function App({
    Component,
    pageProps: { ...pageProps },
}: AppProps) {
    return <Component {...pageProps} />
}
```
- _document.tsx
```tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
```
- index.tsx
```tsx
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ShopList } from '@/components/Shop/ShopList'
import { notAuthenticatedVerification } from '@/components/Authorization/AuthorizationUtils'
import { getShopItems } from '@/services/shopService'
const inter = Inter({ subsets: ['latin'] })

const Home = (props: any) => {
    return <ShopList {...props} />
}

export default Home

export const getServerSideProps = async (context: any) => {
    let data = await notAuthenticatedVerification(context.req, {}, 1)
    let page = 1
    if (context.query.page) {
        page = context.query.page
    }
    let debouncedSearch = ''
    if (context.query.debouncedsearch) {
        debouncedSearch = context.query.debouncedsearch
    }
    let shopItems: any = await getShopItems(page, debouncedSearch)
    if (shopItems.status == 'OK') {
        data.props.shopItems = shopItems.items
        data.props.itemCount = shopItems.itemCount
        data.props.page = page
    }
    // data.props.shopItems = shopItems.items;
    return data
}
```
### Katalog services
- authServices.tsx
```tsx
import axios from 'axios'
const API_URL = 'http://127.0.0.1:4000'
export const login = async (data: any, token?: string) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `${API_URL}/auth/login`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? token : '',
            },
            data: data,
        })
            .then((result: any) => resolve(result.data))
            .catch((error: any) => resolve(error))
    })
}
export const register = async (data: any, token?: string) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `${API_URL}/auth/register`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? token : '',
            },
            data: data,
        })
            .then((result: any) => resolve(result.data))
            .catch((error: any) => resolve(error))
    })
}

export const verify = async (token?: string) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `${API_URL}/auth/verify`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? token : '',
            },
        })
            .then((result: any) => resolve(result.data))
            .catch((error: any) => resolve(error))
    })
}

export const addProduct = async (data: any, token?: string) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `${API_URL}/shop/addProduct`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? token : '',
            },
            data: data,
        })
            .then((result: any) => resolve(result.data))
            .catch((error: any) => resolve(error))
    })
}
```
- shopServices.tsx
```tsx
import axios from 'axios'
const API_URL = 'http://127.0.0.1:4000'
export const login = async (data: any, token?: string) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: '127.0.0.1:4000/auth/login',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? token : '',
            },
            data: data,
        })
            .then((result: any) => resolve(result.data))
            .catch((error: any) => resolve(error))
    })
}

export const getShopItems = async (
    page: number,
    debouncedSearch: string,
    data?: any,
    token?: string
) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: `${API_URL}/shop/getItems/` + page,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? token : '',
            },
            data: {
                debouncedSearch: debouncedSearch,
            },
        })
            .then((result: any) => resolve(result.data))
            .catch((error: any) => resolve(error))
    })
}

export const buyShopItem = async (productId: string, token?: string) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `${API_URL}/shop/buyItem`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? token : '',
            },
            data: {
                productId: productId,
            },
        })
            .then((result: any) => resolve(result.data))
            .catch((error: any) => resolve(error))
    })
}

export const BuyProducts = async (shopData: any, token?: string) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `${API_URL}/shop/buyItems`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? token : '',
            },
            data: shopData,
        })
            .then((result: any) => resolve(result.data))
            .catch((error: any) => resolve(error))
    })
}
```
### Katalog styles
- Home.module.css
```css
.main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 6rem;
    min-height: 100vh;
}

.description {
    display: inherit;
    justify-content: inherit;
    align-items: inherit;
    font-size: 0.85rem;
    max-width: var(--max-width);
    width: 100%;
    z-index: 2;
    font-family: var(--font-mono);
}

.description a {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}

.description p {
    position: relative;
    margin: 0;
    padding: 1rem;
    background-color: rgba(var(--callout-rgb), 0.5);
    border: 1px solid rgba(var(--callout-border-rgb), 0.3);
    border-radius: var(--border-radius);
}

.code {
    font-weight: 700;
    font-family: var(--font-mono);
}

.grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(25%, auto));
    width: var(--max-width);
    max-width: 100%;
}

.card {
    padding: 1rem 1.2rem;
    border-radius: var(--border-radius);
    background: rgba(var(--card-rgb), 0);
    border: 1px solid rgba(var(--card-border-rgb), 0);
    transition: background 200ms, border 200ms;
}

.card span {
    display: inline-block;
    transition: transform 200ms;
}

.card h2 {
    font-weight: 600;
    margin-bottom: 0.7rem;
}

.card p {
    margin: 0;
    opacity: 0.6;
    font-size: 0.9rem;
    line-height: 1.5;
    max-width: 30ch;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 4rem 0;
}

.center::before {
    background: var(--secondary-glow);
    border-radius: 50%;
    width: 480px;
    height: 360px;
    margin-left: -400px;
}

.center::after {
    background: var(--primary-glow);
    width: 240px;
    height: 180px;
    z-index: -1;
}

.center::before,
.center::after {
    content: '';
    left: 50%;
    position: absolute;
    filter: blur(45px);
    transform: translateZ(0);
}

.logo,
.thirteen {
    position: relative;
}

.thirteen {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 75px;
    height: 75px;
    padding: 25px 10px;
    margin-left: 16px;
    transform: translateZ(0);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: 0px 2px 8px -1px #0000001a;
}

.thirteen::before,
.thirteen::after {
    content: '';
    position: absolute;
    z-index: -1;
}

/* Conic Gradient Animation */
.thirteen::before {
    animation: 6s rotate linear infinite;
    width: 200%;
    height: 200%;
    background: var(--tile-border);
}

/* Inner Square */
.thirteen::after {
    inset: 0;
    padding: 1px;
    border-radius: var(--border-radius);
    background: linear-gradient(
        to bottom right,
        rgba(var(--tile-start-rgb), 1),
        rgba(var(--tile-end-rgb), 1)
    );
    background-clip: content-box;
}

/* Enable hover only on non-touch devices */
@media (hover: hover) and (pointer: fine) {
    .card:hover {
        background: rgba(var(--card-rgb), 0.1);
        border: 1px solid rgba(var(--card-border-rgb), 0.15);
    }

    .card:hover span {
        transform: translateX(4px);
    }
}

@media (prefers-reduced-motion) {
    .thirteen::before {
        animation: none;
    }

    .card:hover span {
        transform: none;
    }
}

/* Mobile */
@media (max-width: 700px) {
    .content {
        padding: 4rem;
    }

    .grid {
        grid-template-columns: 1fr;
        margin-bottom: 120px;
        max-width: 320px;
        text-align: center;
    }

    .card {
        padding: 1rem 2.5rem;
    }

    .card h2 {
        margin-bottom: 0.5rem;
    }

    .center {
        padding: 8rem 0 6rem;
    }

    .center::before {
        transform: none;
        height: 300px;
    }

    .description {
        font-size: 0.8rem;
    }

    .description a {
        padding: 1rem;
    }

    .description p,
    .description div {
        display: flex;
        justify-content: center;
        position: fixed;
        width: 100%;
    }

    .description p {
        align-items: center;
        inset: 0 0 auto;
        padding: 2rem 1rem 1.4rem;
        border-radius: 0;
        border: none;
        border-bottom: 1px solid rgba(var(--callout-border-rgb), 0.25);
        background: linear-gradient(
            to bottom,
            rgba(var(--background-start-rgb), 1),
            rgba(var(--callout-rgb), 0.5)
        );
        background-clip: padding-box;
        backdrop-filter: blur(24px);
    }

    .description div {
        align-items: flex-end;
        pointer-events: none;
        inset: auto 0 0;
        padding: 2rem;
        height: 200px;
        background: linear-gradient(
            to bottom,
            transparent 0%,
            rgb(var(--background-end-rgb)) 40%
        );
        z-index: 1;
    }
}

/* Tablet and Smaller Desktop */
@media (min-width: 701px) and (max-width: 1120px) {
    .grid {
        grid-template-columns: repeat(2, 50%);
    }
}

@media (prefers-color-scheme: dark) {
    .vercelLogo {
        filter: invert(1);
    }

    .logo,
    .thirteen img {
        filter: invert(1) drop-shadow(0 0 0.3rem #ffffff70);
    }
}

@keyframes rotate {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0deg);
    }
}
```
- globals.css
```css
:root {
    --max-width: 1100px;
    --border-radius: 12px;
    --font-mono: ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
        'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro',
        'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace;

    --foreground-rgb: 0, 0, 0;
    --background-start-rgb: 214, 219, 220;
    --background-end-rgb: 255, 255, 255;

    --primary-glow: conic-gradient(
        from 180deg at 50% 50%,
        #16abff33 0deg,
        #0885ff33 55deg,
        #54d6ff33 120deg,
        #0071ff33 160deg,
        transparent 360deg
    );
    --secondary-glow: radial-gradient(
        rgba(255, 255, 255, 1),
        rgba(255, 255, 255, 0)
    );

    --tile-start-rgb: 239, 245, 249;
    --tile-end-rgb: 228, 232, 233;
    --tile-border: conic-gradient(
        #00000080,
        #00000040,
        #00000030,
        #00000020,
        #00000010,
        #00000010,
        #00000080
    );

    --callout-rgb: 238, 240, 241;
    --callout-border-rgb: 172, 175, 176;
    --card-rgb: 180, 185, 188;
    --card-border-rgb: 131, 134, 135;
}

@media (prefers-color-scheme: dark) {
    :root {
        --foreground-rgb: 255, 255, 255;
        --background-start-rgb: 0, 0, 0;
        --background-end-rgb: 0, 0, 0;

        --primary-glow: radial-gradient(
            rgba(1, 65, 255, 0.4),
            rgba(1, 65, 255, 0)
        );
        --secondary-glow: linear-gradient(
            to bottom right,
            rgba(1, 65, 255, 0),
            rgba(1, 65, 255, 0),
            rgba(1, 65, 255, 0.3)
        );

        --tile-start-rgb: 2, 13, 46;
        --tile-end-rgb: 2, 5, 19;
        --tile-border: conic-gradient(
            #ffffff80,
            #ffffff40,
            #ffffff30,
            #ffffff20,
            #ffffff10,
            #ffffff10,
            #ffffff80
        );

        --callout-rgb: 20, 20, 20;
        --callout-border-rgb: 108, 108, 108;
        --card-rgb: 100, 100, 100;
        --card-border-rgb: 200, 200, 200;
    }
}

* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}

html,
body {
    max-width: 100vw;
    overflow-x: hidden;
}

body {
    color: rgb(var(--foreground-rgb));
    background: linear-gradient(
            to bottom,
            transparent,
            rgb(var(--background-end-rgb))
        )
        rgb(var(--background-start-rgb));
}

a {
    color: inherit;
    text-decoration: none;
}

@media (prefers-color-scheme: dark) {
    html {
        color-scheme: dark;
    }
}
```
