import { Router } from "express";
import authController from "../controller";
import { tryCatch } from "../../../utils/error/try.catch.helper";

const router = Router();

router.get("/google", tryCatch(authController.initiateGoogleOAuth));
router.get("/google/callback", tryCatch(authController.googleOAuthCallback));

router.get("/github", tryCatch(authController.initiateGithubOAuth));
router.get("/github/callback", tryCatch(authController.githubOAuthCallback));

router.get("/facebook", tryCatch(authController.initiateFacebookOAuth));
router.get(
  "/facebook/callback",
  tryCatch(authController.facebookOAuthCallback),
);

export default router;
