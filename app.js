require('dotenv').config();
const express = require("express");
const sequelize = require("./config/database");
const adminRoutes = require("./routes/adminRoutes")
const userLoginRoutes = require("./routes/authRoutes")
const courseRoutes = require("./routes/courseRoutes")
const getCourseRoutes = require("./routes/getCoursesRoutes");
const getAllUserRoutes = require("./routes/getUsersRoutes");
const getUserCourseRoutes = require("./routes/userCourseRoutes");
const getUserVideoRoutes = require("./routes/userVideoRoutes");
const deleteRoutes = require("./routes/deleteRoutes");

const app = express();
app.use(express.json());

app.use('/api',[adminRoutes,userLoginRoutes, deleteRoutes ,courseRoutes, getCourseRoutes,getAllUserRoutes , getUserCourseRoutes , getUserVideoRoutes]);
app.use('/test', (req,res) => {
  res.send("server working")

})
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
