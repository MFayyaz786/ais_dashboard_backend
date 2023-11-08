const express = require("express");
const zargarUserRouter = express.Router();
const authController = require("./zargarUserController");
zargarUserRouter.post("/signup", authController.register);
zargarUserRouter.post("/login", authController.login);
module.exports = zargarUserRouter;
