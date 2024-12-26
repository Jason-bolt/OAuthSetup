import { Router } from "express";
import authController from "../controller";
import { tryCatch } from "../../../utils/error/try.catch.helper";
import authMiddleware from "../middleware";

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

router.post(
  "/register",
  authMiddleware.isValidRegisterationBody,
  authMiddleware.isUniqueEmail,
  authMiddleware.isUniqueUsername,
  authMiddleware.isValidRegistrationPassowrd,
  tryCatch(authController.registerUser),
);

router.post(
  "/login",
  authMiddleware.isValidEmailAndPassword,
  tryCatch(authController.login),
);

router.post(
  "/reset-password",
  tryCatch(authMiddleware.checkToken),
  tryCatch(authMiddleware.isOldAndNewPasswordValid),
  tryCatch(authController.resetPassword),
);

export default router;
