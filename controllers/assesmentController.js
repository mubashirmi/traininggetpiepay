const { Assessment, Question , UserAssessment , UserResponse, UserPartStatus, Part, UserVideoStatus, Video } = require('../models/index');
const {Op} = require("sequelize")
exports.getAssessmentQuestions = async (req, res) => {
    const { partId } = req.params;

    try {
        const assessment = await Assessment.findOne({
            where: { partId },
            include: [{ model: Question }],
        });

        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found for the given part' });
        }

        res.status(200).json({
            assessmentId: assessment.id,
            questions: assessment.Questions.map((q) => ({
                questionId: q.id,
                text: q.text,
                options: q.options,
            })),
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

exports.submitAssessment = async (req, res) => {
    const { userId, responses } = req.body;
    const { assessmentId } = req.params;

    try {
        // Find the assessment and its associated part
        const assessment = await Assessment.findByPk(assessmentId);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        const partId = assessment.partId;

        // Create or update user assessment
        const userAssessment = await UserAssessment.create({
            userId,
            partId,
            status: 'completed',
        });

        let score = 0;

        // Loop through responses to calculate score and save user responses
        for (const response of responses) {
            const question = await Question.findByPk(response.questionId);
            if (!question) {
                return res.status(404).json({ message: `Question with ID ${response.questionId} not found` });
            }

            const correct = question.correctOption === response.selectedOption;

            if (correct) {
                score += 1; // Increment score for correct answer
            }

            // Save the user response
            await UserResponse.create({
                userAssessmentId: userAssessment.id,
                questionId: response.questionId,
                selectedOption: response.selectedOption,
            });
        }

        // Update the score in UserAssessment
        userAssessment.score = score;
        await userAssessment.save();

        // Find the next part in the course
        const currentPart = await Part.findByPk(partId);
        const nextPart = await Part.findOne({
            where: {
                courseId: currentPart.courseId,
                id: { [Op.gt]: currentPart.id }, // Find the next part with a higher ID
            },
            order: [['id', 'ASC']],
        });

        if (nextPart) {
            // Update the status of the next part to "started"
            await UserPartStatus.upsert({
                userId,
                partId: nextPart.id,
                status: 'started',
            });

            // Find the first video of the next part
            const firstVideo = await Video.findOne({
                where: { partId: nextPart.id },
                order: [['id', 'ASC']],
            });

            if (firstVideo) {
                // Update the status of the first video to "started"
                await UserVideoStatus.upsert({
                    userId,
                    videoId: firstVideo.id,
                    status: 'started',
                });
            }
        }

        res.status(200).json({
            message: 'Assessment submitted successfully',
            score,
            total: responses.length,
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

