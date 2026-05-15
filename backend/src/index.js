const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const config = require("./config/config");
const eventBus = require("./eventBus");

const PORT = config.PORT || 5000;

// Create HTTP server instead of relying entirely on Express app.listen
const server = http.createServer(app);

// Initialize Socket.IO with permissive CORS for the frontend
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to the frontend domain
    methods: ["GET", "POST"]
  },
  pingInterval: 10000,
  pingTimeout: 5000
});

// Attach io to our centralized event bus
eventBus.initialize(io);

server.listen(PORT, () => {
  console.log(`🚀 HTTP & Socket.IO server running on port ${PORT}`);
  console.log(`🔗 Blockchain RPC: ${config.RPC_URL}`);
  console.log(`🤖 ML Service: ${config.ML_SERVICE_URL}`);
});