let authModel = require('./auth.model');
let userModel = require('../models/user.model');
let shop = require('../models/shop');

exports.getItems = async (req, res) => {
    let items = await shop.find({})
    return res.status(200).send({ status:"OK", items: items });
}

exports.addItemToShop = async (req, res) => {
    let item = new shop({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        quantity: req.body.quantity
    })
    try{
        const newItem = await item.save()
        res.status(200).send({status:"OK", item: newItem})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

exports.updateItem = async (req, res)=>{
    if(req.body.name != null){
        res.item.name = req.body.name
    }
    if(req.body.price != null){
        res.item.price = req.body.price
    }
    if(req.body.description != null){
        res.item.description = req.body.description
    }
    if(req.body.image != null){
        res.item.image = req.body.image
    }
    if(req.body.category != null){
        res.item.category = req.body.category
    }
    if(req.body.quantity != null){
        res.item.quantity = req.body.quantity
    }
    try{
        const updatedItem = await res.item.save()
        res.status(200).send({status:"OK", item: updatedItem})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const  getItem = async (req, res,next)=>{
    let item;
    try{
        item = await shop.findById(req.params.id)
        if(item == null){
            return res.status(404).json({message:'Cannot find item'})
        }
    }catch(err){
        return res.status(500).json({message:err.message})
    }
    res.item = item;
    next()
}