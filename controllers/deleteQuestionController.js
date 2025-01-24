const { Question } = require('../models/index');

exports.deleteQuestion = async (req, res) => {
    const { questionId } = req.params;

    try {
        // Delete the question
        await Question.destroy({ where: { id: questionId } });

        res.status(200).json({ message: "Question deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
