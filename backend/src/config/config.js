require("dotenv").config();

const config = {
  PORT: process.env.PORT || 5000,
  RPC_URL: process.env.RPC_URL || "http://127.0.0.1:7545",
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,

  ML_SERVICE_URL:
    process.env.ML_SERVICE_URL ||
    "http://127.0.0.1:8000",

  ABI: [
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
  ]
};

module.exports = config;