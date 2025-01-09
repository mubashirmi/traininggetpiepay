const jwt = require("jsonwebtoken");

exports.adminLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    if ( email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {expiresIn: "1h"});
        return res.status(200).json({ message: "Admin loggedIn successfully", token });
    } else {
        res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
