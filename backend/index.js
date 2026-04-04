const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const { ethers } = require("ethers");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ------------------------------
// BLOCKCHAIN CONFIGURATION
// ------------------------------
const RPC_URL = "http://127.0.0.1:7545";

// ⚠️ Use your Ganache Account 1 private key here
const PRIVATE_KEY = "0x24782f239cbfa7baad6f89f9db6133a378b0fa44d46f734bbd4f88e6bd53d1f2";

// Your deployed contract address
const CONTRACT_ADDRESS = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";

// Contract ABI
const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_did",
        "type": "string"
      }
    ],
    "name": "registerDID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getDID",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "identities",
    "outputs": [
      {
        "internalType": "string",
        "name": "did",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Blockchain setup
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

// ------------------------------
// REGISTER DID ON BLOCKCHAIN
// ------------------------------
app.post("/register-did", async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    const generatedDID = `did:example:${walletAddress.slice(2)}`;

    const tx = await contract.registerDID(walletAddress, generatedDID);
    await tx.wait();

    res.json({
      message: "DID registered successfully on blockchain 🚀",
      did: generatedDID,
      txHash: tx.hash
    });

  } catch (error) {
    console.error("Register DID Error:", error);
    res.status(500).json({ error: "Failed to register DID on blockchain" });
  }
});

// ------------------------------
// FETCH DID FROM BLOCKCHAIN
// ------------------------------
app.get("/get-did/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const result = await contract.getDID(walletAddress);
    const did = result[0];
    const owner = result[1];

    if (!did || did.trim() === "") {
      return res.status(404).json({ error: "No DID found for this address" });
    }

    res.json({
      did,
      owner
    });

  } catch (error) {
    console.error("Fetch DID Error:", error);
    res.status(500).json({ error: "Failed to fetch DID from blockchain" });
  }
});

// ------------------------------
// AI FRAUD DETECTION ROUTE
// ------------------------------
app.post("/check-fraud", async (req, res) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        login_attempts: req.body.login_attempts,
        failed_attempts: req.body.failed_attempts,
        request_frequency: req.body.request_frequency,
        odd_hour_access: req.body.odd_hour_access,
        new_device: req.body.new_device,
        location_change: req.body.location_change,
        multiple_wallet_switches: req.body.multiple_wallet_switches
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("Fraud Detection Error:", error);
    res.status(500).json({ error: "ML service error" });
  }
});

// ------------------------------
// ROOT ROUTE
// ------------------------------
app.get("/", (req, res) => {
  res.send("DID Authentication Backend Running with Blockchain + AI 🚀");
});

// ------------------------------
// START SERVER
// ------------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});