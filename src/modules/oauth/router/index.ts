import { Router } from "express";
import oauthController from "../controller";
import { tryCatch } from "../../../utils/error/try.catch.helper";

const router = Router();

router.get("/google", tryCatch(oauthController.initiateGoogleOAuth));
router.get("/google/callback", tryCatch(oauthController.googleOAuthCallback));

// router.get("/apple", tryCatch(oauthController.initiateAppleOAuth));
// router.get("/apple/callback", tryCatch(oauthController.appleOAuthCallback));

router.get("/facebook", tryCatch(oauthController.initiateFacebookOAuth));
router.get("/facebook/callback", tryCatch(oauthController.facebookOAuthCallback));

export default router;