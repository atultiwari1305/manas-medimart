const {Router} = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const user = require('../models/item')

const router = Router();

router.post('/register', async (req,res)=>{
    let email = req.body.email;
    let name = req.body.name;
    let password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const record = await user.findOne({email:email})
    if(record){
        return res.send(400).send({
            message: "Email is already registered"
        })
    }else{
        const userCred = new user({
            name:name,
            email:email,
            password:hashedPassword
        })

        const result = await userCred.save();

        //JWT token
        const {_id} = await result.toJSON()
        const token = jwt.sign({_id:_id},"secret")
        res.cookie("jwt",token,{
            httpOnly: true,
            maxAge: 24*60*60*1000
        })

        res.json({
            id:result._id
        })
    }
})

router.post('/login',(req,res)=>{
    res.send("login user");
})

router.get('/user',(req,res)=>{
    res.send("user");
})

module.exports = router;