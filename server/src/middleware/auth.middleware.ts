import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  userId?: number;
}

export const authenticateJWT: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as {
      userId: number;
    };
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
