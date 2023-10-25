import express from "express";
import multer from "multer";
import cors from "cors";
import mongoose from "mongoose";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { registerValidator, loginValidation } from "./validation/auth.js";
import { postValidation } from "./validation/postCreate.js";

import {
  UserControlers,
  PostControllers,
  CommentControllers,
} from "./controlers/index.js";
import { handleValidationsErrors, checkAuth } from "./utils/index.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnNnyT9p_Dn_8eiHsx48C4mCHE7mI81NI",
  authDomain: "text-blog-backend.firebaseapp.com",
  projectId: "text-blog-backend",
  storageBucket: "text-blog-backend.appspot.com",
  messagingSenderId: "38364562663",
  appId: "1:38364562663:web:615f96b64fea226aaace42",
  measurementId: "G-BKHB22BJ50",
};

const app_firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(app_firebase);

mongoose
  .connect(process.env.MONGODB_URI)
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

const port = process.env.PORT || 1487;

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server start on ${port}`);
});
