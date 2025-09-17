const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
  try {
    const auth = req.headers.authorization

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
        timestamp: new Date().toISOString(),
      })
    }

    const token = auth.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        message: "Access denied. Invalid token format.",
        timestamp: new Date().toISOString(),
      })
    }

    // Verify JWT_SIGN is available
    if (!process.env.JWT_SIGN) {
      console.error("❌ JWT_SIGN environment variable is not set")
      return res.status(500).json({
        message: "Server configuration error - JWT secret not configured.",
        timestamp: new Date().toISOString(),
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SIGN)
    req.user = decoded.userId
    next()
  } catch (error) {
    console.error("Authentication error:", error.message)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
        timestamp: new Date().toISOString(),
      })
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired.",
        timestamp: new Date().toISOString(),
      })
    }

    return res.status(500).json({
      message: "Token verification failed.",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

module.exports = authenticate
