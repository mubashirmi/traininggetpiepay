const {  Part ,Video ,UserPartStatus,UserVideoStatus } = require("../models/index");

exports.deletePart = async ( req , res ) => {
    const { partId } = req.params;
    try {
        await UserVideoStatus.destroy({ where: { partId } });
        await Video.destroy({ where: { partId } });

        // Delete part-related statuses
        await UserPartStatus.destroy({ where: { partId } });

        // Delete the part
        await Part.destroy({ where: { id: partId } });
        res.status(200).json({ message : "Part Deleted Successfully"})
        
    } catch (error) {
        res.status(500).json({ message : "Internal Server Error" , error })
    }
}