const jwt = require("jsonwebtoken");
const prisma = require("../api/database");

const secretKey = process.env.SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  const rawHeader = req.headers.authorization || "";
  const authHeader = rawHeader.includes(" ")
    ? rawHeader.split(" ")[1]
    : rawHeader;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization Required" });
  }

  try {
    const decoded = jwt.verify(authHeader, secretKey);

    const authUser = await prisma.user.findUnique({
      where: {
        userId: decoded.id,
      },
      include: {
        role: {
          select: {
            roleName: true,
          },
        },
      },
    });

    if (!authUser) return res.status(404).json({ message: "User not found" });

    const formatedUser = {
      id: authUser.userId,
      name: authUser.name,
      email: authUser.email,
      role: authUser.role.roleName,
    };

    req.user = formatedUser;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;