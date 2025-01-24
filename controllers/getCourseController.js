const { Course, Part, Video, Assessment, Question } = require("../models/index");

// For admin to get All Courses 
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            include: {
                model: Part,
                include: [
                    {
                        model: Video,
                    },
                    {
                        model: Assessment,
                        include: [
                            {
                                model: Question,
                                attributes: ['id', 'text', 'options'], // Fetch only necessary attributes
                            },
                        ],
                    },
                ],
            },
        });

        if (!courses || courses.length === 0) {
            return res.status(200).json({ message: "No Courses Exist" });
        }

        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
};

exports.getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findByPk(id, {
            include: {
                model: Part,
                include: [
                    {
                        model: Video,
                    },
                    {
                        model: Assessment,
                        include: [
                            {
                                model: Question,
                                attributes: ['id', 'text', 'options'], // Fetch only necessary attributes
                            },
                        ],
                    },
                ],
            },
        });

        if (!course) {
            return res.status(404).json({ message: "Course Not Found" });
        }

        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
};
