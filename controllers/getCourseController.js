const { Course, Part, Video } = require("../models/index");

// For admin to get All Courses 
exports.getAllCourses = async( req , res )=>{
    try{
        const courses = await Course.findAll({
            include : {
                model : Part ,
                include :Video
            }
        })

        if(!courses || courses.length === 0){
            res.status(200).json({message : "No Courses Exist"});
        }else{
            res.status(200).json(courses);
        }
    }catch(err){
        res.status(500).json({message:"Internal Server Error", error: err})
    }
}

// To get information of sinngle course 
exports.getCourseById = async( req , res )=>{
    const { id } = req.params;
    try{
        const course = await Course.findByPk(id,{
            include : {
                model : Part ,
                include :Video
            }
        })
        if(!course){
            res.status(404).json({ message : "Course Not Found" });
        }
        res.status(200).json(course)
    }catch(err){
        res.status(500).json({message:"Internal Server Error", error: err})
    }
}