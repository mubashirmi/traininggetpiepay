const { User, UserCourseStatus, Course } = require("../models/index");
const { Op } = require("sequelize");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: UserCourseStatus,
                    include: [
                        {
                            model: Course,
                            attributes: ["id", "courseName"], // Only fetch course name
                        },
                    ],
                },
            ],
        });

        if (!users || users.length === 0) {
            return res.status(200).json({ message: "No Users Exist" });
        }

        // Format response
        const formattedUsers = users.map(user => {
            const startedCourse = user.UserCourseStatuses.find(status => status.status === "started");
            const completedCoursesCount = user.UserCourseStatuses.filter(status => status.status === "completed").length;

            return {
                id: user.id,
                userName: user.userName,
                email: user.email,
                startedCourse: startedCourse ? startedCourse.Course.courseName : "No Course Started",
                completedCoursesCount: completedCoursesCount
            };
        });

        res.status(200).json(formattedUsers);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
