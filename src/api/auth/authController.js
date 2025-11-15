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
        roleId: "a014c4a7-e91d-46f2-bb2b-131ef6e541f7",
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

    req.user = formatedUser;

    const token = jwt.sign(formatedUser, secretKey, { expiresIn: "1h" });

    return res.status(200).json({ newUser: formatedUser, token: token });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};

const login = async (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  const { email, password } = req.body;

  const getUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      role: {
        select: {
          roleName: true,
        },
      },
    },
  });

  let isPasswordValid = false;
  if (getUser) isPasswordValid = bcrypt.compare(password, getUser.password);

  if (!isPasswordValid)
    return res.status(401).json({ message: "Wrong email or password" });

  const formatedUser = {
    id: getUser.userId,
    name: getUser.name,
    email: getUser.email,
    role: getUser.role.roleName,
  };

  req.user = formatedUser;

  const token = jwt.sign(formatedUser, secretKey, { expiresIn: "1h" });
  return res.status(200).json({ token });
};

module.exports = {
  register,
  login,
};
