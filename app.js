require('dotenv').config();
const express = require("express");
const sequelize = require("./config/database");
const adminRoutes = require("./routes/adminRoutes")
const userLoginRoutes = require("./routes/authRoutes")
const courseRoutes = require("./routes/courseRoutes")

const app = express();
app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/auth', userLoginRoutes);
app.use('/courses', courseRoutes);







// sequelize.sync({force:true})
sequelize.sync()
  .then(() => {
    console.log("Database connected successfully.");
    const PORT = 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Database connection failed:", err));
