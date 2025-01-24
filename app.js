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
const editUpdateRoutes = require("./routes/editRoutes");
const assesmentRoutes = require("./routes/assesmentRoutes");

const app = express();
app.use(express.json());

app.use('/api',[adminRoutes,userLoginRoutes, deleteRoutes ,courseRoutes, getCourseRoutes,getAllUserRoutes , getUserCourseRoutes , getUserVideoRoutes , editUpdateRoutes , assesmentRoutes]);
app.use('/test', (req,res) => {
  res.send("server working")
})
const PORT = process.env.DB_PORT;
// sequelize.sync({ alter:true})
sequelize.sync()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Database connection failed:", err));


  module.exports = app