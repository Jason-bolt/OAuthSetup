import express from "express";
import cors from "cors";
import helmet from "helmet";
import appRouter from "../routes";
import { ApiError } from "../utils/error";
import { rateLimit } from "express-rate-limit";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: true,
});

app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", appRouter);

app.use(ApiError.appError);
app.use(ApiError.genericError);

export default app;
