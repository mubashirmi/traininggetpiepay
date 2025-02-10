const { Course, Part, Video, Assessment, Question , sequelize } = require("../models/index");

// For admin to get All Courses 
exports.getAllCourses = async (req, res) => {
    try {
        // Fetch courses with a count of parts
        const courses = await Course.findAll({
            attributes: [
                'id',
                'courseName',
                'courseCategory',
                'courseThumbnailPhoto',
                'courseDescription',
                [sequelize.fn('COUNT', sequelize.col('Parts.id')), 'partCount'], // Count the number of parts
            ],
            include: [
                {
                    model: Part,
                    attributes: [], // Exclude Part details, we only need the count
                },
            ],
            group: ['Course.id'], // Group by Course to count parts correctly
        });

        if (!courses || courses.length === 0) {
            return res.status(200).json({ message: "No Courses Exist" });
        }

        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
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
