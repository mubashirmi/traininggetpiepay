const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.userLogin = async (req,res)=>{
    try{
        const {email} = req.body;
        let user = await User.findOne({where:{email}});
        console.log(user)
        if(user){
            const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
            res.status(200).json({message : "User LoggedIn Successfully",token});
        }else{
            user = await User.create({ email });
            const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({message : "User Created Successfully",token})
        }
    }catch(err){
        res.status(500).json({message :"Internal Server Error", error:err.message})
    }
};

