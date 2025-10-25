import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


// register -> localhost/api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User Already Exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // ✅ Dynamic
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",  // ✅ Dynamic
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return res.json({ success: true, message: "User Registered Successfully", user: { _id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// Login ->  localhost/api/user/login 

// In your login controller
export const login = async (req, res) => {
    try {
        const { email, password, guestCart } = req.body; // guestCart is optional
        if (!email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid Credentials" });

        // Merge guest cart with user cart
        if (guestCart && Object.keys(guestCart).length > 0) {
            user.cartItems = { ...user.cartItems }; // clone existing cart
            for (const [productId, qty] of Object.entries(guestCart)) {
                if (user.cartItems[productId]) {
                    user.cartItems[productId] += qty; // sum quantities
                } else {
                    user.cartItems[productId] = qty;
                }
            }
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
             secure: process.env.NODE_ENV === "production",  // ✅ Dynamic
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",  // ✅ Dynamic
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({
            success: true,
            message: "Logged In Successfully",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                cartItems: user.cartItems || {},
            },
        });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// Auth -> localhost/api/user/is-auth

export const isAuth = async (req, res) => {
    try {
        const { userId } = req.body; // This comes from AuthUser middleware
        if (!userId) {
            return res.json({ success: false, message: "Not Authorized" });
        }
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Logout -> localhost/api/user/logout

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // ✅ Dynamic
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",  // ✅ Dynamic
            path: '/'  // ✅ Add this
        })
        return res.json({ success: true, message: "Successfully Logout" })

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}