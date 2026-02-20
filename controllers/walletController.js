
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/wallet.json");
const userPath = path.join(__dirname, "../data/users.json");
const waletTransactionPath = path.join(__dirname, "../data/walletTransction.json");




let wallets = [];


const saveWalletToFile = (data,filePath) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};


const getWalletFromFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }

  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

const users = getWalletFromFile(userPath);


const retirerWallet = (req,res,id,userId) =>{
  let body = "";

  const wallets = getWalletFromFile(filePath);
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
      if(wallet.user_id == userId){
                if(wallet.sold !=0 && wallet.sold>=Number(parsed.amount)){
              wallet.sold -= Number(parsed.amount);
      }else{
          res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Insufficient balance" }));
      }


      saveWalletToFile(wallets,filePath);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(wallet));
      }else{
         res.writeHead(200, { "Content-Type": "application/json" });
         res.end(JSON.stringify("Accès non autorisé"));
      }



    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON" }));
    }
  });

}

const deposerWallet = async (req, res, id,user) => {
  let body = "";
  const wallets = await getWalletFromFile(filePath);

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


      
      if(wallet.user_id == user){

         wallet.sold += Number(parsed.amount);

         saveWalletToFile(wallets,filePath);

         res.writeHead(200, { "Content-Type": "application/json" });
         res.end(JSON.stringify(wallet));

      }else{
         res.writeHead(200, { "Content-Type": "application/json" });
         res.end(JSON.stringify("Accès non autorisé"));
      }
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON" }));
    }
  });
};




const getWallets = (req, res) => {
  const wallets = getWalletFromFile(filePath);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(wallets));
};

const createWallet = (req, res) => {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const parsed = JSON.parse(body);

      if (!parsed.name || !parsed.user_id) {
        return res.end(JSON.stringify({ message: "Name and user_id required" }));
      }

      const wallets = getWalletFromFile(filePath);
      const users = getWalletFromFile(userPath);

      const user = users.find(u => u.id === Number(parsed.user_id));

      if (!user) {
        return res.end(JSON.stringify({ message: "User not found" }));
      }

      const newWallet = {
        id: wallets.length + 1,
        name: parsed.name,
        user_id: Number(parsed.user_id),
        sold: 0
      };

      wallets.push(newWallet);
      saveWalletToFile(wallets,filePath);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newWallet));

    } catch (error) {
      console.log("REAL ERROR:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Server error" }));
    }
  });
};


module.exports = {
  getWallets,
  createWallet,
  deposerWallet,
  retirerWallet
};
