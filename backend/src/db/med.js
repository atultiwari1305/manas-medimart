const mongoose = require('mongoose');
const Medicine = require('../models/medicine');

mongoose.connect("mongodb+srv://atulrajtiwari098:S1hUMvFDaRPOg9FP@cluster0.nobfwwq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
}).then(()=>{
    console.log("Connection to DB successful");
    Medicine.find({})
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