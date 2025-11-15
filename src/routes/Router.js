const express = require("express");
const router = express.Router();
const roles = require("../api/roles/index");
const auth = require("../api/auth/authController");
const ensureAuth = require("../middlewares/verify-auth");
const ensureAdmin = require("../middlewares/ensureAdmin");

router.post("/roles", roles.create);
router.post("/register", auth.register);
router.post("/login", auth.login);

module.exports = router;
