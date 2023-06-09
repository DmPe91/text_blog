import express from "express";
import multer from "multer";
import cors from "cors";
import mongoose from "mongoose";

import { registerValidator, loginValidation } from "./validation/auth.js";
import { postValidation } from "./validation/postCreate.js";

import {
  UserControlers,
  PostControllers,
  CommentControllers,
} from "./controlers/index.js";
import { handleValidationsErrors, checkAuth } from "./utils/index.js";

mongoose
  .connect(
    "mongodb+srv://dmper67:wwwwww@cluster0.k7vaefm.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("mongo ok"))
  .catch((err) => console.log("erorr mongo", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationsErrors,
  UserControlers.login
);
app.post(
  "/auth/register",
  registerValidator,
  handleValidationsErrors,
  UserControlers.register
);
app.get("/auth/me", checkAuth, UserControlers.auth);

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post(
  "/posts",
  checkAuth,
  postValidation,
  handleValidationsErrors,
  PostControllers.create
);
app.post("/posts/comment/add", checkAuth, CommentControllers.addComment);
app.get("/tags", PostControllers.getLastTags);
app.get("/posts/search", PostControllers.getAll);
app.get("/comments", CommentControllers.getLastСomments);
app.get("/comments/:id", CommentControllers.getPostComments);
app.get("/tags/:id", PostControllers.getSearchTag);
app.get("posts/tags", PostControllers.getLastTags);
app.get("/posts/:id", PostControllers.getOne);
app.delete("/posts/:id", checkAuth, PostControllers.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postValidation,
  handleValidationsErrors,
  PostControllers.update
);
app.patch("/comments/:id", PostControllers.updateComment);

app.listen(1488, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("ok");
});
