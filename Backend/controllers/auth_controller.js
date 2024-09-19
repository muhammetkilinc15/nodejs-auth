import { User } from "../models/user_model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import { generateTokenSetCookie } from "../utils/generateTokenSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/email.js";

dotenv.config();

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            throw new Error("User not found")
        }
        return res.status(200).json({user});
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}


export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw new Error("All fields are required")
        }
        const userAllreadyExist = await User.findOne({ email })
        if (userAllreadyExist) {
            throw new Error("User already exist")
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        await sendVerificationEmail(email, verificationToken);


        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 69 //  24 hours,
        });


        const savedUser = await user.save();

        generateTokenSetCookie(res, savedUser);

        return res.status(201).json({
            status: true,
            message: "User created successfully",
            user: {
                ...savedUser._doc,
                password: undefined
            }
        })

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            throw new Error("Invalid or expired verification code")
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email);
        return res.status(200).json({
            status: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            throw new Error("Email is required")
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found")
        }
        const resetToken = await crypto.randomBytes(32).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours

        // send email with reset token
        await sendPasswordResetEmail(email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        // save reset token and expires in database
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        return res.status(200).json({
            status: true,
            message: "Reset token sent to your email"
        })
    }
    catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            throw new Error("Invalid or expired reset token")
        }
        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();
        await sendResetSuccessEmail(user.email);

        return res.status(200).json({
            status: true,
            message: "Password reset successfully"
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new Error("All fields are required")
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found")
        }
        if (!user.isVerified) {
            throw new Error("Please verify your email")
        }
        const isPasswordMatch = await bcryptjs.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Invalid credentials")
        }
        generateTokenSetCookie(res, user);
        user.lastLogin = Date.now();
        await user.save();

        return res.status(200).json({
            status: true,
            message: "Login successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    }
    catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        status: true,
        message: "Logout successfully"
    })
}