const User = require("../models/User");

exports.getAllUsers = async ( req , res ) => {
    try{
        const users = await User.findAll();
        console.log(users);
        if(!users || users.length === 0){
            res.status(200).json({message : "No Users Exist"});
        }else{
            res.status(200).json(users);
        }
    }catch(err){
        res.status(500).json({message : "Internal Server Error" , error : err})
    }
}