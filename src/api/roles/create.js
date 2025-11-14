const prisma = require("../database/index.js");
const { randomUUID } = require("crypto");

const createRole = async (req, res) => {
  if (!req.body || !req.body.roleName) {
    return res.status(400).json({ message: "roleName is a mandatory field." });
  }
  const { roleName } = req.body;

  try {
    const result = await prisma.role.create({
      data: {
        roleName,
        roleId: randomUUID(),
      },
    });
    return res.status(200).json(result);
  } catch (e) {
    if (e.code == "P2002") {
      return res
        .status(400)
        .json({ message: "A role with this name already exists" });
    }
    return res.status(400).json({ error: e.message });
  }
};

module.exports = createRole;
