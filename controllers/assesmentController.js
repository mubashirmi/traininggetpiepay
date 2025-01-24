const { Assessment, Question , UserAssessment , UserResponse } = require('../models/index');

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
        // Create or update user assessment
        const userAssessment = await UserAssessment.create({
            userId,
            partId: (await Assessment.findByPk(assessmentId)).partId,
            status: 'completed',
        });

        let score = 0;

        for (const response of responses) {
            const question = await Question.findByPk(response.questionId);
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

        res.status(200).json({
            message: 'Assessment submitted successfully',
            score,
            total: responses.length,
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

