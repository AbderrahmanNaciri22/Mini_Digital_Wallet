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
    return createWallet(req, res);
  }


  const match = pathname.match(/^\/wallets\/(\d+)\/deposit\/(\d+)$/);

  if (match && req.method === "PUT") {
    const id = match[1];
    const user = match[2];

    deposerWallet(req, res, id,user);
    return true;
  }

   const match2 = pathname.match(/^\/wallets\/(\d+)\/retirer\/(\d+)$/);

  if (match2 && req.method === "PUT") {
    const id = match2[1];
    const userId = match2[2]
    retirerWallet(req, res, id,userId);
    return true;
  }

  return false;
};

module.exports = walletRoutes;
