import express from 'express';
import { login, logout, signup,verifyEmail,forgotPassword, resetPassword, checkAuth } from '../controllers/auth_controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

// gets 
router.get("/check-auth",verifyToken,checkAuth)


// posts 
router.post("/signup",signup)
router.post("/verify-email",verifyEmail)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token",resetPassword)
router.post("/login",login)


router.post("/logout",logout)

export default router;