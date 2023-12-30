const { verifyToken, refreshToken } = require("../utils/processToken");
function refreshTokenMiddleware(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  const token = verifyToken(authorizationHeader);
  
  const newToken = refreshToken(token);
  req.newToken = newToken;
  next();
}

module.exports = refreshTokenMiddleware;
