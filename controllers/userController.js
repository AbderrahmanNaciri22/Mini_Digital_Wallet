// controllers/userController.js
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/users.json");

let users = []


const saveUsersToFile = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};


const getUsersFromFile = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

const getAllUsers = (req, res) => {
  const users = getUsersFromFile();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users));

};

const getUser = (req,res,id)=>{
  const users = getUsersFromFile();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users[id]));
}


const updateUser = (req, res, id) => {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const parsed = JSON.parse(body);

      const users = getUsersFromFile();

      const index = users.findIndex(
        u => u.id === parseInt(id)
      );

      if (index === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
          message: "User not found"
        }));
      }


      if (parsed.name !== undefined) {
        users[index].name = parsed.name;
      }

      saveUsersToFile(users);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users[index]));

    } catch (error) {
      console.error(error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        message: "Invalid JSON"
      }));
    }
  });
};

const deleteUser = (req, res, id) => {
  const users = getUsersFromFile();
  const index = users.findIndex(
    u => u.id === parseInt(id)
  );

  if (index === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      message: "User not found"
    }));
  }

  const deletedUser = users.splice(index, 1);

  saveUsersToFile(users);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    message: "User deleted successfully",
    user: deletedUser[0]
  }));
};





const createUser = (req, res) => {
  let body = "";
   const users = getUsersFromFile();


  req.on("data", chunk => {
    body += chunk.toString();
  });


  req.on("end", () => {
    try {
      const parsed = JSON.parse(body);

      if (!parsed.name) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({message: "Name required"}));
      }

      const newUser = {
        id: users.length + 1,
        name: parsed.name,
      };


      users.push(newUser);


      saveUsersToFile(users);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));

    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON" }));
    }
  });
};


module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
