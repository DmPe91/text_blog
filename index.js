import express from "express";
import jwebt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://dmper67:wwwwww@cluster0.k7vaefm.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("mongo ok"))
  .catch((err) => console.log("erorr mongo", err));
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("TEST номер№2 номер№3 НОМЕР2");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body);
  const token = jwebt.sign(
    {
      email: req.body.email,
      fullname: "Отто Штрассер",
    },
    "enigma"
  );
  res.json({
    success: true,
    token,
  });
}),
  app.listen(1488, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log("ok");
  });
