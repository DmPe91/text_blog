import PostModel from "../models/post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .limit(7)
      .exec();

    const tags = posts.map((obj) => obj.tags).flat();
    const uniq = tags.filter(function (item, pos) {
      return tags.indexOf(item) == pos;
    });
    //.slice(0, 8);

    res.json(uniq);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort(
        req.query.keyword === "date" ? { createdAt: -1 } : { viewsCount: -1 }
      )
      .populate("user")
      .exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};
export const getSearchTag = async (req, res) => {
  try {
    const name = req.params.id;
    const posts = await PostModel.find({ tags: name }).populate("user");
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    ).populate("user");
    if (!doc) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete({
      _id: postId,
    }).then((doc, err) => {
      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена",
        });
      }
      res.json({
        success: true,
      });
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Не удалось удалить статью",
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось загрузить статью",
    });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.body.user,
        tags: req.body.tags.split(","),
      }
    );
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};
export const updateComment = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        $inc: { commentsCount: 1 },
      }
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};
