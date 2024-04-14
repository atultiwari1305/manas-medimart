const mongoose = require('mongoose');
const Item = require('../models/item');

mongoose.connect("mongodb://localhost:27017/manas-medimart",{
}).then(()=>{
    console.log("Connection to DB successful");
    Item.find({})
        .then(items => {
            console.log("Items found:", items);
        })
        .catch(err => {
            console.error("Error fetching items:", err);
        })
}).catch((e)=>{
    console.log(e)
    console.log("Connection to DB unsuccessful");
})