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

const getUsers = (req, res) => {
  const users = getUsersFromFile();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users));

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

      if (!parsed.name || !parsed.email) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
          message: "Name and email required"
        }));
      }


      const newUser = {
        id: users.length + 1,
        name: parsed.name,
        email: parsed.email
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
  getUsers,
  createUser
};
