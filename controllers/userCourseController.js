const { Course , Part , Video ,User , UserCourseStatus , UserVideoStatus , UserPartStatus } = require("../models/index");

// Get all Courses for a single User
// exports.getAllUserCourses = async (req, res) => {
//     const { userId } = req.query;

//     try {
//         const courses = await Course.findAll({
//             include: [
//                 {
//                     model: UserCourseStatus,
//                     where: { userId },
//                     required: false, // Allows fetching courses even if there's no status yet
//                 },
//                 {
//                     model: Part,
//                     include: Video,
//                 },
//             ],
//         });

//         res.status(200).json({ courses });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

exports.getAllUserCourses = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch all courses with user-specific statuses
        const courses = await Course.findAll({
            include: [
                {
                    model: UserCourseStatus,
                    where: { userId },
                    required: false, // Include courses even if no status exists for the user
                },
                {
                    model: Part,
                    include: [
                        {
                            model: UserPartStatus,
                            where: { userId },
                            required: false, // Include parts even if no status exists
                        },
                        {
                            model: Video,
                            include: [
                                {
                                    model: UserVideoStatus,
                                    where: { userId },
                                    required: false, // Include videos even if no status exists
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        // Format the data to match the desired response structure
        const formattedCourses = courses.map((course) => {
            return {
                courseId: course.id,
                courseName: course.courseName,
                courseCategory: course.courseCategory,
                courseThumbnailPhoto: course.courseThumbnailPhoto,
                status: course.UserCourseStatuses?.[0]?.status || 'notStarted',
                // parts: course.Parts.map((part) => ({
                //     partId: part.id,
                //     partName: part.partName,
                //     status: part.UserPartStatuses?.[0]?.status || 'notStarted',
                //     videos: part.Videos.map((video) => ({
                //         videoId: video.id,
                //         videoName: video.videoName,
                //         videoFile: video.videoFile,
                //         status: video.UserVideoStatuses?.[0]?.status || 'notStarted',
                //     })),
                // })),
            };
        });

        res.status(200).json(formattedCourses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserSingleCourses = async (req, res) => {
    const { userId, courseId } = req.params;

    try {
        // Fetch the course with user-specific statuses
        const course = await Course.findOne({
            where: { id: courseId },
            include: [
                {
                    model: UserCourseStatus,
                    where: { userId },
                    required: false, // Include course even if no status exists for the user
                },
                {
                    model: Part,
                    include: [
                        {
                            model: UserPartStatus,
                            where: { userId },
                            required: false, // Include parts even if no status exists
                        },
                        {
                            model: Video,
                            include: [
                                {
                                    model: UserVideoStatus,
                                    where: { userId },
                                    required: false, // Include videos even if no status exists
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found for the given user and course ID' });
        }

        // Format the data to match the desired response structure
        const formattedCourse = {
            courseId: course.id,
            courseName: course.courseName,
            courseCategory: course.courseCategory,
            courseThumbnailPhoto: course.courseThumbnailPhoto,
            status: course.UserCourseStatuses?.[0]?.status || 'notStarted',
            parts: course.Parts.map((part) => ({
                partId: part.id,
                partName: part.partName,
                status: part.UserPartStatuses?.[0]?.status || 'notStarted',
                videos: part.Videos.map((video) => ({
                    videoId: video.id,
                    videoName: video.videoName,
                    videoFile: video.videoFile,
                    status: video.UserVideoStatuses?.[0]?.status || 'notStarted',
                })),
            })),
        };

        res.status(200).json(formattedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.startCourse = async ( req ,res ) => {
    const { userId , courseId } = req.body;

    try{
        await UserCourseStatus.upsert({ userId , courseId , status : "started"});
        // To find first Part of course
        const firstPart = await Part.findOne({
            where : {courseId},
            order : [[ 'id' , 'ASC' ]]
        })
        if(firstPart){
            await UserPartStatus.upsert({ userId , partId : firstPart.id , status : "started"});
            // To find first Video of Part
            const firstVideo = await Video.findOne({
                where : { partId: firstPart.id },
                order : [[ 'id' , 'ASC' ]]
            });
            await UserVideoStatus.upsert({userId, videoId:firstVideo.id , status : "started"});
        }

        res.status(200).json({ message : "Course Started Successfully" })
    }catch(err){
        res.status(500).json({ message : "Internnal Server Error" , error : err })
    }
}