import CommentModel from "../models/comment.js";
export const addComment = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      post: req.body.post,
      user: req.body.user,
    });
    const comment = await doc.save();
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось оставить комменарий",
    });
  }
};
export const getPostComments = async (req, res) => {
  try {
    const post = req.params.id;
    const comments = await CommentModel.find({ post: post });
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить комментарии статьи",
    });
  }
};
export const getLastСomments = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .sort({ createdAt: -1 })
      .limit(7)
      .exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить комментрарии",
    });
  }
};
