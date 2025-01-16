const express = require("express");
const { userLogin } = require("../controllers/userLogin");
const router = express.Router();

router.post("/auth/login" , userLogin);

module.exports = router;