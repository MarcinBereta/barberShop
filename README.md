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

- user - pole typu ObjectId, które odnosi się do dokumentu w kolekcji "users". Jest wymagane (required: true).
- products - tablica obiektów, gdzie każdy obiekt zawiera:
- product - pole typu ObjectId, które odnosi się do dokumentu w kolekcji "products". Jest wymagane (required: true).
- quantity - pole typu Number, które reprezentuje ilość produktów. Jest wymagane (required: true).
- date - pole typu Date, które reprezentuje datę zakupu. Jest wymagane (required: true).
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

- name - pole typu String, które reprezentuje nazwę produktu. Jest wymagane (required: true).
- price - pole typu Number, które reprezentuje cenę produktu. Jest wymagane (required: true).
- description - pole typu String, które reprezentuje opis produktu. Nie jest wymagane (required: false).
- image - pole typu String, które reprezentuje ścieżkę do obrazka produktu. Nie jest wymagane (required: false).
- category - pole typu String, które reprezentuje kategorię produktu. Jest wymagane (required: true). Może przyjąć wartości: "shampoo", "conditioner", "mask", "oils". Jest również - zdefiniowany enum, który ogranicza wartości do tych podanych.
- quantity - pole typu Number, które reprezentuje ilość produktów. Jest wymagane (required: true).
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
#### Plik shop.model.js
Ten kod definiuje moduł products, który eksportuje funkcje odpowiedzialne za operacje na kolekcji "products" w bazie danych.
Funkcje dostępne w module products to:
-`getAllProducts()`: Pobiera wszystkie produkty z kolekcji "products". Zwraca obietnicę, która rozwiązuje się z wynikiem operacji (tablicą produktów) lub odrzuca się w przypadku błędu.
-`getProductById(id)`: Pobiera produkt z kolekcji "products" na podstawie podanego identyfikatora (_id). Zwraca obietnicę, która rozwiązuje się z wynikiem operacji (znalezionym produktem) lub odrzuca się w przypadku błędu.

-`addProduct(product)`: Dodaje nowy produkt do kolekcji "products" na podstawie podanych danych produktu. Zwraca obietnicę, która rozwiązuje się z wynikiem operacji (dodanym produktem) lub odrzuca się w przypadku błędu.

-`updateProduct(product)`: Aktualizuje istniejący produkt w kolekcji "products" na podstawie podanych danych produktu. Aktualizacja odbywa się na podstawie identyfikatora (_id) produktu. Zwraca obietnicę, która rozwiązuje się z wynikiem operacji (aktualizowanym produktem) lub odrzuca się w przypadku błędu.

-`buyProduct(product)`: Aktualizuje ilość produktu w kolekcji "products" po zakupie. Aktualizacja odbywa się na podstawie identyfikatora (_id) produktu. Zwraca obietnicę, która rozwiązuje się z wynikiem operacji (zaktualizowanym produktem) lub odrzuca się w przypadku błędu.

-`addProductToCustomer(product, customer)`: Dodaje informację o zakupionym produkcie przez klienta do kolekcji "customersProducts". Zwraca obietnicę, która rozwiązuje się z wynikiem operacji (dodanym rekordem) lub odrzuca się w przypadku błędu.

```js
var mongoUtil = require( './../mongoUtil' );
let mongo = mongoUtil.getDb();

const products = () => { }

products.getAllProducts = () => {
    return new Promise((resolve, reject) => {
        mongo.collection("products").find({}).toArray(function(err, res) {
            if (err) {
                console.log(err)
                reject(err)
            };
            resolve(result) ;
        });
    })
}

products.getProductById = (id) => {
    return new Promise((resolve, reject) => {
        mongo.collection('products').findOne({ _id: id }, (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
}

products.addProduct = (product)=>{
    return new Promise((resolve, reject) => {
        mongo.collection('products').insertOne({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category,
            quantity: product.quantity,
        }, (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
}

products.updateProduct = (product)=>{
    return new Promise((resolve, reject) => {
        mongo.collection('products').updateOne({
            _id: product._id
        }, {
            $set: {
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image,
                category: product.category,
                quantity: product.quantity,
            }
        }, (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
}

products.buyProduct = (product)=>{
    return new Promise((resolve, reject) => {
        mongo.collection('products').updateOne({
            _id: product._id
        }, {
            $set: {
                quantity: product.quantity,
            }
        }, (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
}

products.addProductToCustomer = (product, customer)=>{
    return new Promise((resolve, reject) => {
        mongo.collection('customersProducts').insertOne({
            customer: customer,
            product: product,
        }, (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
}


module.exports = products
```
#### Plik user.js

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
