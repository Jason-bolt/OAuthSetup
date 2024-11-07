import express from "express";
import authRouter from "../../modules/Auth/router";
import userRouter from "../../modules/User/router";

const v1Router = express.Router();
v1Router.use("/auth", authRouter);
v1Router.use("/users", userRouter);

export default v1Router;
