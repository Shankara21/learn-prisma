const { User } = require("../models");
const sendResponse = require("../utils/response");
const brcrypt = require("bcryptjs");
const { generateToken, verifyToken } = require("../utils/processToken");
module.exports = {
  index: async (req, res) => {
    try {
      const newToken = req.newToken;
      const users = await User.findMany({});
      const authUser = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
      });
      delete authUser.password;
      sendResponse(
        res,
        200,
        {
          users,
          authUser,
          ...(newToken && { newToken }),
        },
        "Success get all users"
      );
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  },
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const user = User.findUnique({
        where: { id: parseInt(id) },
      });
      const newToken = req.newToken;

      if (!user) {
        sendResponse(res, 404, null, "User not found");
      } else {
        sendResponse(
          res,
          200,
          {
            user,
            ...(newToken && { newToken }),
          },
          "Success read user"
        );
      }
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  },
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await brcrypt.hash(password, 10);
      // find existing name or email
      const existingUser = await User.findFirst({
        where: {
          OR: [
            {
              name,
            },
            {
              email,
            },
          ],
        },
      });
      if (existingUser) {
        sendResponse(res, 400, null, "Name or email already exists");
      }
      const user = await User.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      delete user.password;
      sendResponse(res, 200, user, "Success register user");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        sendResponse(res, 400, null, "Email not found");
      }
      const isPasswordMatch = await brcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        sendResponse(res, 400, null, "Password not match");
      }
      const data = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      const token = generateToken(data);
      delete user.password;
      sendResponse(res, 200, { token }, "Success login");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  },
};
