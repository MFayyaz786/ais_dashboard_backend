const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Database is connected.");
  })
  .catch((err) => {
    console.log(err);
  });
