import { Router } from "express";
import userController from "../controller";
import { tryCatch } from "../../../utils/error/try.catch.helper";

const router = Router();

router.get("/:id", tryCatch(userController.getUserById));
router.get("/email/:email", tryCatch(userController.getUserByEmail));

export default router;
