const Comment = require("../models/Comment");

const addComment = async (req, res) => {

    const bookId = req.params.id;
    const { text } = req.body;

    try {

        const comment = await Comment.create({
            book: bookId,
            user: req.user,
            text
        });

        res.json(comment);

    } catch (error) {

        res.status(500).json({ message: "Comment error" });

    }

};

module.exports = { addComment };