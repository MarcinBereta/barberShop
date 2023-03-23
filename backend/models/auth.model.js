let mongo = require('../db.js');

const auth = () => { }

auth.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        mongo.db.collection('users').findOne({ _id: id }, (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
}

auth.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        mongo.db.collection('users').findOne({ email: email }, (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
}

auth.registerUser = (user)=>{
    return new Promise((resolve, reject) => {
        mongo.db.collection('users').insertOne({
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