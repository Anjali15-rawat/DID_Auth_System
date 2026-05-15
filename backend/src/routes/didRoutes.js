const express = require("express");
const router = express.Router();
const didController = require("../controllers/didController");

// Health check
router.get("/", didController.healthCheck);

// Generate DID (no blockchain write)
router.post("/register-did", didController.registerDID);

// Fetch DID from blockchain
router.get("/get-did/:walletAddress", didController.getDID);

// ML fraud check
router.post("/check-fraud", didController.checkFraud);

// Validation Pipeline (Enterprise SOC)
router.post("/validate-pipeline", didController.validatePipeline);

module.exports = router;