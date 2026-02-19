
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


const retirerWallet = (req,res,id) =>{
  let body = "";
  const wallets = getWalletFromFile();
    req.on("data", chunk => {
    body += chunk.toString();
  });
   req.on("end", () => {
    try {
      const parsed = JSON.parse(body);

      if (!parsed.amount || parsed.amount <= 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Invalid amount" }));
      }

      const wallet = wallets.find(w => w.id === Number(id));

      if (!wallet) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Wallet not found" }));
      }

      if(wallet.sold !=0){
              wallet.sold -= Number(parsed.amount);
      }


      saveWalletToFile(wallets);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(wallet));

    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON" }));
    }
  });

}

const deposerWallet = (req, res, id) => {
  let body = "";
  const wallets = getWalletFromFile();

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const parsed = JSON.parse(body);

      if (!parsed.amount || parsed.amount <= 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Invalid amount" }));
      }

      const wallet = wallets.find(w => w.id === Number(id));

      if (!wallet) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Wallet not found" }));
      }

      wallet.sold += Number(parsed.amount);

      saveWalletToFile(wallets);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(wallet));

    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON" }));
    }
  });
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
  createWallet,
  deposerWallet,
  retirerWallet
};
