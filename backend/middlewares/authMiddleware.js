import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Log the incoming header to confirm presence/format
  console.log(
    "🔐 Authorization header:",
    req.headers.authorization || "(none)"
  );

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(
        "🟢 Parsed token (first 20 chars):",
        token?.slice(0, 20) || "(none)"
      );

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🧩 Decoded token payload:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        console.log("❌ User not found for decoded id:", decoded.id);
        return res
          .status(401)
          .json({ message: "Not authorized, user missing" });
      }

      return next();
    } catch (error) {
      console.error("❌ Token verification failed:", error?.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
