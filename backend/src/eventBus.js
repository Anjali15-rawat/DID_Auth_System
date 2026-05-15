// ═══════════════════════════════════════════════════
// eventBus.js — Centralized Socket.IO event broadcaster
// ═══════════════════════════════════════════════════
//
// WHY: In enterprise SIEM platforms (Splunk, QRadar, Darktrace),
// events flow through a centralized message bus. This module
// provides a thin wrapper so any service can broadcast events
// without importing the Socket.IO instance directly.
//
// CHANNELS:
//   fraud-events      — ML prediction results, risk scores
//   auth-events       — wallet connections, DID registrations
//   telemetry-events  — system metrics, counters
//   incident-events   — investigation state changes
//   system-health     — backend/ML/chain health pings

let io = null;
let connectedClients = 0;

/**
 * Attach the Socket.IO server instance and wire up
 * connection tracking + periodic health broadcasts.
 */
function initialize(socketServer) {
  io = socketServer;

  io.on("connection", (socket) => {
    connectedClients++;
    console.log(`🔌 Client connected (${connectedClients} total) — ${socket.id}`);

    // Send initial state to the newly connected client
    socket.emit("system-health", {
      ts: Date.now(),
      connectedClients,
      uptime: process.uptime(),
      status: "online",
    });

    socket.on("disconnect", () => {
      connectedClients--;
      console.log(`🔌 Client disconnected (${connectedClients} total) — ${socket.id}`);
    });
  });

  // Periodic health heartbeat — every 15 seconds
  setInterval(() => {
    io.emit("system-health", {
      ts: Date.now(),
      connectedClients,
      uptime: process.uptime(),
      status: "online",
    });
  }, 15000);

  console.log("📡 EventBus initialized — real-time channels active");
}

/**
 * Emit an event to ALL connected clients.
 * @param {string} channel — one of the defined event channels
 * @param {object} payload — JSON-serializable data
 */
function emit(channel, payload) {
  if (!io) {
    console.warn("⚠️ EventBus: Socket.IO not initialized yet, event dropped:", channel);
    return;
  }
  io.emit(channel, { ...payload, _ts: Date.now() });
}

/**
 * Get the raw Socket.IO server instance (for advanced use only).
 */
function getIO() {
  return io;
}

/**
 * Returns the current number of connected WebSocket clients.
 */
function getClientCount() {
  return connectedClients;
}

module.exports = { initialize, emit, getIO, getClientCount };
