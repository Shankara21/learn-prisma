const { verifyToken } = require("../utils/processToken");
const sendResponse = require("../utils/response");

function authMiddleware(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  const token = verifyToken(authorizationHeader);
  if (!token) {
    return sendResponse(res, 401, null, "Unauthorized");
  } else {
    req.user = token;
    next();
  }
}

module.exports = authMiddleware;
