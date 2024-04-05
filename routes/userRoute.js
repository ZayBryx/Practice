const express = require("express");
const router = express.Router();

const { home, logout } = require("../controller/userController");

router.get("/", home);
router.post("/logout", logout);

module.exports = router;
