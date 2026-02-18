const http = require("http");
const userRoutes = require("./routes/userRoutes");

const server = http.createServer((req, res) => {

  // Users routes
  const handled = userRoutes(req, res);
  if (handled !== false) return;

  // 404 fallback
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route Not Found" }));

});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
