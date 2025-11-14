const express = require("express");
const router = express.Router();
const roles = require("../api/roles/index");
const auth = require("../api/auth/authController");

router.post("/roles", roles.create);
router.post("/register", auth.register);

module.exports = router;
