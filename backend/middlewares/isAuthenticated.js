import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated!",
      });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid token!",
      });
    }

    req.id = verifyToken.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};
