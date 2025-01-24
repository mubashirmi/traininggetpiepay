const { Course, Part, Video , Assessment , Question } = require("../models/index");

exports.addCourse = async (req, res) => {
    const { courseName, courseCategory, courseThumbnailPhoto, courseSummary, parts } = req.body;

    try {
        // Validate course fields
        if (!courseName || !courseCategory || !courseThumbnailPhoto || !courseSummary) {
            return res.status(400).json({ message: "All course fields are required" });
        }

        // Create the course
        const course = await Course.create({
            courseName,
            courseCategory,
            courseThumbnailPhoto,
            courseSummary,
        });

        if (course && parts && Array.isArray(parts)) {
            for (const part of parts) {
                // Validate part fields
                if (!part.partName) {
                    throw new Error("Part name is required");
                }

                const newPart = await Part.create({
                    partName: part.partName,
                    courseId: course.id,
                });

                if (part.videos && Array.isArray(part.videos)) {
                    for (const video of part.videos) {
                        // Validate video fields
                        if (!video.videoName || !video.videoFile || typeof video.videoTime !== "number") {
                            throw new Error("All video fields are required");
                        }

                        await Video.create({
                            videoName: video.videoName,
                            videoFile: video.videoFile,
                            videoTime: video.videoTime,
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
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};