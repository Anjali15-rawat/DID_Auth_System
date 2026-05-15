const express = require("express");
const cors = require("cors");
const didRoutes = require("./routes/didRoutes");
const fraudRoutes = require("./routes/fraudRoutes");
const incidentRoutes = require("./routes/incidentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", didRoutes);
app.use("/api/fraud", fraudRoutes);
app.use("/api/incidents", incidentRoutes);

module.exports = app;