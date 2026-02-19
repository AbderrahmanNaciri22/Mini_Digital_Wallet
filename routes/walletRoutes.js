const { getWallets, createWallet, deposerWallet ,retirerWallet} = require("../controllers/walletController");

const walletRoutes = (req, res) => {

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  console.log("Wallet route hit:", req.method, pathname);

  if (req.method === "GET" && pathname === "/wallets") {
    getWallets(req, res);
    return true;
  }

  if (req.method === "POST" && pathname === "/wallets") {
    createWallet(req, res);
    return true;
  }

  const match = pathname.match(/^\/wallets\/(\d+)\/deposit$/);

  if (match && req.method === "PUT") {
    const id = match[1];
    deposerWallet(req, res, id);
    return true;
  }

   const match2 = pathname.match(/^\/wallets\/(\d+)\/retirer$/);

  if (match2 && req.method === "PUT") {
    const id = match2[1];
    retirerWallet(req, res, id);
    return true;
  }

  return false;
};

module.exports = walletRoutes;
