import jwt from ".pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken";
import User from "../models/UserModel.js"
import { compare } from ".pnpm/bcrypt@6.0.0/node_modules/bcrypt";
import bcrypt from ".pnpm/bcrypt@6.0.0/node_modules/bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
}

export const signup = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        if (!firstName || !lastName) {
            return res.status(400).json({ message: "First name and last name are required" })
        }

        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            profileSetup: true // Set to true since user provided name during registration
        })
        const token = createToken(user.email, user.id);
        res.cookie("jwt", token, {
            maxAge,
            secure: true, // Always secure on Vercel
            sameSite: "None", // Required for cross-origin cookies
            httpOnly: true,
            domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined
        })
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image
            },
            token: token // Send token in response for fallback
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        console.log("Login attempt for email:", email);

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await User.findOne({ email })
        console.log("User found:", user ? "Yes" : "No");
        if (!user) {
            return res.status(400).json({ message: "Invalid user" })
        }

        console.log("Comparing passwords...");
        const auth = await compare(password, user.password);
        console.log("Password match:", auth);

        if (!auth) {
            return res.status(400).json({ message: "Invalid password" })
        }

        console.log("Login successful, creating token...");
        const token = createToken(user.email, user.id);
        res.cookie("jwt", token, {
            maxAge,
            secure: true, // Always secure on Vercel
            sameSite: "None", // Required for cross-origin cookies
            httpOnly: true,
            domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined
        })
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image
            },
            token: token // Send token in response for fallback
        })
    } catch (error) {
        console.log("Login error:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getUserInfo = async (req, res, next) => {
    try {
        const userData = await User.findById(req.userId)
        if (!userData) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json({

            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image

        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req;
        const { firstName, lastName, password } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({ message: "First name and last name are required" })
        }

        // Build update object
        const updateData = {
            firstName,
            lastName,
            profileSetup: true
        };

        // Add password to update if provided (hash it first)
        if (password && password.trim()) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const userData = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true
        })
        return res.status(200).json({
            user: {
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const logout = async (req, res, next) => {
    try {
        // Clear the JWT cookie
        res.cookie("jwt", "", {
            maxAge: 1, // Set to 1ms to expire immediately
            secure: true, // Always secure on Vercel
            sameSite: "None", // Required for cross-origin cookies
            httpOnly: true,
            domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("Logout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}