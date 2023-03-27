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
