import { Router } from "express";
import baseController from "../controller";
import { tryCatch } from "../../../utils/error/try.catch.helper";

const router = Router();

router.get("/", tryCatch(baseController.something));

export default router;
