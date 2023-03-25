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