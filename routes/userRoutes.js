// routes/userRoutes.js

const {getUsers,createUser} = require("../controllers/userController");

const userRoutes = (req, res) => {

  if (req.url === "/users" && req.method === "GET") {
     return getUsers(req, res);
  }
  if (req.url === "/users" && req.method === "POST") {
     return createUser(req, res);
  }

  return false; 
};





module.exports = userRoutes;
