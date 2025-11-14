const jwt = require("jsonwebtoken");
const prisma = require("../database");
const { randomUUID } = require("crypto");
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  const { name, email, password } = req.body;

  const regexEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const testEmail = regexEmail.test(email);
  console.log(testEmail);

  if (!testEmail) {
    return res.status(401).json({ message: "Invalid email." });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        userId: randomUUID(),
        password: bcrypt.hashSync(password, 10),
        roleId: "f42084d1-38b7-407f-8e57-182355c35648",
      },
      include: {
        role: {
          select: {
            roleName: true,
          },
        },
      },
    });

    const formatedUser = {
      id: newUser.userId,
      name,
      email,
      role: newUser.role.roleName,
    };

    const token = jwt.sign(formatedUser, secretKey, { expiresIn: "1h" });

    return res.status(200).json({ newUser: formatedUser, token: token });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};

module.exports = {
  register,
};