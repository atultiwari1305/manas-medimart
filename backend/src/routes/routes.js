const {Router} = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const user = require('../models/item')
const Medicine = require('../models/medicine');

const router = Router();

router.use(cookieParser());

router.delete('/medicines/:medicineId', async (req, res) => {
    const { medicineId } = req.params;
  
    try {
      // Find the medicine by ID and remove it
      const deletedMedicine = await Medicine.findByIdAndDelete(medicineId);
  
      if (!deletedMedicine) {
        return res.status(404).json({ message: 'Medicine not found' });
      }
  
      res.status(200).json({ message: 'Medicine removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.get('/medicines', async (req, res) => {
    try {
      const medicines = await Medicine.find();
      res.json(medicines);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.post('/addMed', async (req,res)=>{
    let name = req.body.name;
    let description = req.body.description;

    const medDetails = new Medicine({
        name:name,
        description:description
    })
    const result = await medDetails.save();
    res.json({
        id:result._id
    })
})

router.post('/register', async (req,res)=>{
    let email = req.body.email;
    let name = req.body.name;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const hashedConfirmPassword = await bcrypt.hash(confirmPassword,salt);

    const record = await user.findOne({email:email})
    if(record){
        return res.status(400).send({
            message: "Email is already registered"
        })
    }else{
        const userCred = new user({
            name:name,
            email:email,
            password:hashedPassword,
            confirmPassword:hashedConfirmPassword
        })

        const result = await userCred.save();

        //JWT token
        const {_id} = await result.toJSON()
        const token = jwt.sign({_id:_id},"secret")
        res.cookie("jwt",token,{
            httpOnly: true,
            maxAge: 24*60*60*1000,
            sameSite: 'strict'
        })

        res.json({
            id:result._id
        })
    }
})

router.post('/login', async (req,res)=>{
    const record = await user.findOne({email:req.body.email})
    if(!record){
        return res.status(404).send({
            message: "User not found"
        })
    }
    if(!(await bcrypt.compare(req.body.password,record.password))){
        return res.status(400).send({
            message: "Incorrect Password"
        })
    }
    const token = jwt.sign({_id:record._id},"secret")

    res.cookie("jwt",token,{
        httpOnly: true,
        maxAge: 24*60*60*1000,
        sameSite: 'strict'
    })
    res.send({
        message: "success"
    })
})

router.post('/logout',(req,res)=>{
    res.cookie('jwt','',{maxAge: 0})
    res.send({message: "success"})
})

router.get('/users', async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];
        console.log(req.cookies)
        if (!cookie) {
            return res.status(401).send({
                message: "Missing JWT token"
            });
        }
        const claims = jwt.verify(cookie, "secret");
        if (!claims) {
            return res.status(401).send({
                message: "Invalid JWT token"
            });
        }

        const record = await user.findOne({ _id: claims._id });
        if (!record) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        const { password, ...data } = record.toJSON();
        res.send(data);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).send({
            message: "Internal server error"
        });
    }
});


module.exports = router;