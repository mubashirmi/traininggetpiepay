const { User , UserCourseStatus , UserPartStatus , UserVideoStatus } = require("../models/index");

exports.deleteUser = async ( req , res ) => {
    const { userId } = req.params;
    try {
        await UserCourseStatus.destroy({ where : {userId} });
        await UserPartStatus.destroy({ where : {userId} });
        await UserVideoStatus.destroy({ where : {userId} });
        await User.destroy({ where : { id : userId} });

        res.status(200).json({ message: "User deleted successfully" });
        
    } catch (error) {
        res.status(500).json({ message : "Internal Server Error" , error })
    }
}