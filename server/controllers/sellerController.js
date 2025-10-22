import jwt from "jsonwebtoken";

// Seller_Login -> localhost/api/seller/login

export const seller_login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.cookie("seller_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Sends cookie only over HTTPS. False in development, true in production.
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Prevents CSRF issues.
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            return res.json({ success: true, message: "Login Successfully" })
        } else {
            return res.json({ success: false, message: "Invalid Credentials" })
        }
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Seller_Auth -> localhost/api/seller/is-auth
 
export const seller_isAuth = async (req, res) => {
    const { seller_token } = req.cookies;

    if (!seller_token) {
        return res.json({ success: false, message: "Not Authorized" });
    }

    try {
        const tokenDecode = jwt.verify(seller_token, process.env.JWT_SECRET);
        
        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            return res.json({ success: true, message: "Authorized" });
        } else {
            return res.json({ success: false, message: "Not Authorized" });
        }
    } catch (error) {
        return res.json({ success: false, message: "Invalid token" });
    }
}

// Seller_Logout -> localhost/api/seller/logout

export const seller_logout = async (req, res) => {
    try {
        res.clearCookie("seller_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        return res.json({ success: true, message: "Successfully Logout" })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}