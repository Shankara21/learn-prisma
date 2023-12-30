const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const generateToken = (data) => {
  const token = jwt.sign(data, jwt_secret, { expiresIn: 60 * 60 * 1 });
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwt_secret);
    return decoded;
  } catch (error) {
    return null;
  }
};

const refreshToken = (payload) => {
  const { iat, exp } = payload;
  const newIat = iat + 900;
  const newExp = exp + 900;

  const newPayload = {
    ...payload,
    iat: newIat,
    exp: newExp,
  };

  const newToken = jwt.sign(newPayload, jwt_secret);
  return newToken;
};

module.exports = {
  generateToken,
  verifyToken,
  refreshToken,
};
