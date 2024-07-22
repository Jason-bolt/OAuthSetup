import express from "express";
import cors from "cors";
import helmet from "helmet";
import appRouter from "../routes";
import { ApiError } from "../utils/error";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", appRouter);

app.use(ApiError.appError);
app.use(ApiError.genericError);

export default app;
