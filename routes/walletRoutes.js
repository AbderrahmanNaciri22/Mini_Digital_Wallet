const { getWallets, createWallet } = require("../controllers/walletController");

const walletRoutes = (req, res) => {

  console.log("Wallet route hit:", req.method, req.url);

  if (req.method === "GET" && req.url === "/wallets") {
    getWallets(req, res);
    return true;
  }

  if (req.method === "POST" && req.url === "/wallets") {
    createWallet(req, res);
    return true;
  }

  return false;
};

module.exports = walletRoutes;
