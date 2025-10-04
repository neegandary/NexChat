import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
    // Try to get token from cookie first, then from Authorization header
    let token = request.cookies.jwt;
    
    // If no cookie token, check Authorization header
    if (!token) {
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        }
    }

    if (!token) {
        return response.status(401).json({ message: "You are not authenticated" });
    }
    
    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        if (err) {
            console.log("JWT verification error:", err.message);
            return response.status(403).send({ message: "Token is not valid" });
        }
        request.userId = payload.userId;
        next();
    })
}

