const { Course, Part, Video, User, UserCourseStatus, Assessment, Question, UserVideoStatus, UserPartStatus, UserPartPdfStatus } = require("../models/index");

exports.getAllUserCourses = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch all courses with user-specific statuses
        const courses = await Course.findAll({
            include: [
                {
                    model: UserCourseStatus,
                    where: { userId },
                    required: false,
                },
                {
                    model: Part,
                    include: [
                        {
                            model: UserPartStatus,
                            where: { userId },
                            required: false,
                        },
                        {
                            model: Video,
                            order: [['id', 'ASC']],
                            include: [
                                {
                                    model: UserVideoStatus,
                                    where: { userId },
                                    required: false,
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
                courseDescription: course.courseDescription,
                courseThumbnailPhoto: course.courseThumbnailPhoto,
                courseSummary: course.courseSummary,
                status: course.UserCourseStatuses?.[0]?.status || 'notStarted',
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
                    required: false,
                },
                {
                    model: Part,
                    include: [
                        {
                            model: UserPartStatus,
                            where: { userId },
                            required: false,
                        },
                        {
                            model: Video,
                            order: [['id', 'ASC']],
                            include: [
                                {
                                    model: UserVideoStatus,
                                    where: { userId },
                                    required: false,
                                },
                            ],
                        },
                        {
                            model: Assessment,
                            include: [
                                {
                                    model: Question,
                                    attributes: ['id', 'text', 'options'],
                                },
                            ],
                        },
                        {
                            model: UserPartPdfStatus,
                            where: { userId },
                            required: false,
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
            courseSummary: course.courseSummary,
            courseThumbnailPhoto: course.courseThumbnailPhoto,
            status: course.UserCourseStatuses?.[0]?.status || 'notStarted',
            parts: course.Parts.map((part) => ({
                partId: part.id,
                partName: part.partName,
                pdfLink: part.pdfLink,
                pdfStatus: (part.UserPartPdfStatuses && part.UserPartPdfStatuses.length > 0) ? part.UserPartPdfStatuses[0].pdfStatus : 'unseen',
                status: part.UserPartStatuses?.[0]?.status || 'notStarted',
                videos: part.Videos.map((video) => ({
                    videoId: video.id,
                    videoName: video.videoName,
                    videoFile: video.videoFile,
                    status: video.UserVideoStatuses?.[0]?.status || 'notStarted',
                })),
                questions: part.Assessment?.Questions.map((question) => ({
                    questionId: question.id,
                    text: question.text,
                    options: question.options,
                })) || [],
            })),
        };

        res.status(200).json(formattedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.startCourse = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        await UserCourseStatus.upsert({ userId, courseId, status: "started" });
        const firstPart = await Part.findOne({
            where: { courseId },
            order: [['id', 'ASC']],
        });
        if (firstPart) {
            await UserPartStatus.upsert({ userId, partId: firstPart.id, status: "started" });
            const firstVideo = await Video.findOne({
                where: { partId: firstPart.id },
                order: [['id', 'ASC']],
            });
            if (firstVideo) {
                await UserVideoStatus.upsert({ userId, videoId: firstVideo.id, status: "started" });
            }
        }

        res.status(200).json({ message: "Course Started Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
