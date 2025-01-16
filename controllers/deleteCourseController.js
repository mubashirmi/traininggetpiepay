const { Course,Part,Video,UserCourseStatus,UserPartStatus,UserVideoStatus } = require("../models/index");

exports.deleteCourse = async ( req , res ) => {
    const { courseId } = req.params;
    try {
        const parts = await Part.findAll({where:{courseId}});
        for(const part of parts){
            await UserVideoStatus.destroy({ where : {partId : part.id} });
            await Video.destroy({ where : {partId :part.id} });
        }
        await UserPartStatus.destroy({ where : { partId: parts.map((p) => p.id) } });
        await Part.destroy({ where : {courseId} });

        await UserCourseStatus.destroy({ where : {courseId} });

        await Course.destroy({ where : {id: courseId} })
        res.status(200).json({ message : "Course Deleted Successfully"})
        
    } catch (error) {
        res.status(500).json({ message : "Internal Server Error" , error })
    }
}