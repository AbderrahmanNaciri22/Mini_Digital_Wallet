const http = require("http");
const userRoutes = require("./routes/userRoutes");
const walletRoutes = require("./routes/walletRoutes");

const server = http.createServer((req, res) => {

  // Users routes
  const userHandled = userRoutes(req, res);
  if (userHandled !== false) return;

  // Wallet routes
  const walletHandled = walletRoutes(req, res);
  if (walletHandled !== false) return;

  // 404 fallback
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route Not Found" }));

});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
