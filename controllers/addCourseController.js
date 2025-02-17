const app = require("../app");
const { Course, Part, Video, Assessment, Question } = require("../models/index");
const { adminLogin } = require("./adminController");

exports.addCourse = async (req, res) => {
    const { courseName, courseCategory, courseDescription, courseThumbnailPhoto, courseSummary, parts } = req.body;

    try {
        // Validate course fields
        if (!courseName || !courseCategory || !courseDescription || !courseThumbnailPhoto || !courseSummary) {
            return res.status(400).json({ message: "All Course fields are required" });
        }

        // Create the course
        const course = await Course.create({
            courseName,
            courseCategory,
            courseDescription,
            courseThumbnailPhoto,
            courseSummary,
        });

        if (course && parts && Array.isArray(parts)) {
            for (const part of parts) {
                // Validate part fields
                if (!part.partName) {
                    throw new Error("Part name is required");
                }

                // Create the new part – include pdfLink if provided
                const newPart = await Part.create({
                    partName: part.partName,
                    courseId: course.id,
                    pdfLink: part.pdfLink || null,
                });

                if (part.videos && Array.isArray(part.videos)) {
                    for (const video of part.videos) {
                        // Validate video fields
                        if (!video.videoName || !video.videoFile || typeof video.videoTime !== "string") {
                            throw new Error("All video fields are required");
                        }

                        // Convert videoTime (HH:MM:SS) into minutes
                        const videoTimeInMinutes = convertTimeToMinutes(video.videoTime);

                        await Video.create({
                            videoName: video.videoName,
                            videoFile: video.videoFile,
                            videoTime: videoTimeInMinutes,  // Save the converted value in minutes
                            videoStatus: "notStarted",
                            partId: newPart.id,
                        });
                    }
                }

                if (part.questions && Array.isArray(part.questions)) {
                    const assessment = await Assessment.create({ partId: newPart.id });

                    for (const question of part.questions) {
                        // Validate question fields
                        if (!question.text || !Array.isArray(question.options) || !question.correctOption) {
                            throw new Error("All question fields are required");
                        }

                        if (!question.options.includes(question.correctOption)) {
                            throw new Error(
                                `Correct option must be one of the provided options: ${question.options}`
                            );
                        }

                        await Question.create({
                            assessmentId: assessment.id,
                            text: question.text,
                            options: question.options,
                            correctOption: question.correctOption,
                        });
                    }
                }
            }
        }

        res.status(201).json({ message: "Course created successfully", course });
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            const errors = err.errors.map(e => e.message);
            return res.status(400).json({ message: "Validation Error", errors });
        }
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

// Helper function to convert HH:MM:SS format to total minutes
const convertTimeToMinutes = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return (hours * 60) + minutes + (seconds / 60); // Convert the time into minutes
};