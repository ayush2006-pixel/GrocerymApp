import jwt from "jsonwebtoken";

const AuthSeller = async (req, res, next) => {
    const { seller_token } = req.cookies;

    if (!seller_token) {
        return res.json({ success: false , message : "Not Authorized"})
    }
    try {
        const tokenDecode = jwt.verify(seller_token, process.env.JWT_SECRET);

        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next();
        } else {
            return res.json({ success: false, message: "Not Authorized" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default AuthSeller