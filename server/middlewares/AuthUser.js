import jwt from "jsonwebtoken";  // ADD THIS LINE

const AuthUser = async (req, res, next) => {
  console.log('Cookies received:', req.cookies);  // Debug line
  console.log('Headers:', req.headers.cookie);    // Debug line
  
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized - No Token" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      if (!req.body) req.body = {}; 
      req.body.userId = tokenDecode.id;
    } else {
      return res.json({ success: false, message: "Not Authorized - Invalid Token" });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: `Token Error: ${error.message}` });
  }
};

export default AuthUser;