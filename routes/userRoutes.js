// routes/userRoutes.js

const {getUser,createUser,updateUser,deleteUser,getAllUsers} = require("../controllers/userController");

const userRoutes = (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const match = pathname.match(/^\/users\/(\d+)$/);

  if (req.url === "/users" && req.method === "GET") {
     return getAllUsers(req, res);
  }

  if (match && req.method === "GET") {
    const id = match[1]; 
    return getUser(req, res, id);
  }

  if (req.url === "/users" && req.method === "POST") {
     return createUser(req, res);
  }



  if (match && req.method === "PUT") {
    const id = match[1]; 
    return updateUser(req, res, id);
  }

  if (match && req.method === "DELETE") {
    const id = match[1]; 
    return deleteUser(req, res, id);
  }
  

  return false; 
};





module.exports = userRoutes;
