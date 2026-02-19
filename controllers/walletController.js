
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/wallet.json");


let wallets = [];

const saveWalletToFile = (wallets) => {
  fs.writeFileSync(filePath, JSON.stringify(wallets, null, 2));
};


const getWalletFromFile = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }

  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};








const getWallets = (req, res) => {
  const wallets = getWalletFromFile();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(wallets));
};

const createWallet = (req, res) => {
  let body = "";
   const wallet = getWalletFromFile();


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

      const newWallet = {
        id: wallet.length + 1,
        name: parsed.name,
        user_id:parsed.user_id,
        sold:parsed.sold
      };


      wallet.push(newWallet);


      saveWalletToFile(wallet);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newWallet));

    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON" }));
    }
  });
};

module.exports = {
  getWallets,
  createWallet
};
