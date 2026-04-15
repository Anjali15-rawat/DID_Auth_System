# 🔐 Decentralized Identity (DID) Authentication System  
### Blockchain + AI-Based Secure Identity Verification Platform  

A wallet-based decentralized identity system enabling secure, passwordless authentication using **Blockchain (Solidity)** and enhanced with **AI-powered fraud detection**.

---

## 📌 Overview  

This project is developed as part of an **IBM Final Year Internship Program**.

It provides a **privacy-first identity solution** where users authenticate via their **crypto wallet (MetaMask)** instead of traditional credentials.

---

## 🔗 Core Idea  
- Replace centralized identity systems  
- Enable user-owned identity (DID)  
- Detect suspicious behavior using Machine Learning  

---

## 🚀 Features  

### ✅ Implemented  
- MetaMask wallet connection  
- Wallet-based authentication  
- DID registration (linked to wallet address)  
- DID verification via smart contracts  
- Backend API integration (Node.js + Express)  
- Machine Learning fraud detection module  
- Modern React-based UI  
- Modular full-stack architecture  

### 🔄 Planned Enhancements  
- On-chain DID storage improvements  
- AI risk scoring dashboard  
- Identity fraud analytics panel  
- Role-based access control (RBAC)  
- Cloud deployment (AWS / GCP)  

---

## 🏗️ System Architecture  

The system follows a **modular, multi-layered architecture** integrating Blockchain, Backend APIs, and Machine Learning services.

### 🔹 High-Level Architecture  

```text
        ┌──────────────────────────────┐
        │        Frontend (React)      │
        │  - MetaMask + Ethers.js      │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │     Backend (Node.js)        │
        │  - REST APIs                 │
        └──────────────┬───────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌───────────────────┐     ┌──────────────────────┐
│ Blockchain Layer  │     │   ML Fraud Service   │
│  (Solidity)       │     │   (Python + Flask)   │
│ - Smart Contract  │     │ - Fraud Detection    │
│ - DID Storage     │     │ - Risk Analysis      │
└───────────────────┘     └──────────────────────┘

🔹 Component Breakdown

🖥️ Frontend (React.js)
Handles UI and user interaction
Integrates MetaMask wallet authentication
Uses Ethers.js to interact with blockchain

⚙️ Backend (Node.js + Express)
Acts as core orchestration layer
Handles API requests and validation
Communicates with blockchain and ML service

🔗 Blockchain (Solidity)
Stores and verifies Decentralized Identity (DID)
Executes secure smart contract logic
Ensures tamper-proof identity system

🧠 Machine Learning (Python + Flask)
Detects suspicious authentication patterns
Assigns fraud risk scores

🔄 Data Flow
1.User connects wallet via MetaMask
2.Frontend sends request to backend
3.Backend verifies identity via smart contract
4.ML service evaluates fraud risk
5.Backend returns response
6.Frontend displays result

🧠 AI Fraud Detection
Built using Scikit-learn
Detects suspicious login patterns
Extendable with:
Behavioral analysis
Geo-location anomaly detection
Frequency-based attack detection

🛠️ Tech Stack

Frontend
React.js
CSS3
Ethers.js

Backend
Node.js
Express.js

Blockchain
Solidity
Remix IDE
MetaMask

Machine Learning
Python
Flask
Pandas
Scikit-learn
Joblib


📂 Project Structure
DID_Auth_System/
├── backend/
├── blockchain/
├── frontend/
├── ml/
└── README.md


📊 Performance & Metrics (Update with real values)
🎯 Fraud detection accuracy: ~85–95%
⚡ API response time: ~100–300 ms
🔐 Reduced unauthorized access attempts by ~30–50%


⚙️ Setup Instructions

1️⃣ Clone Repository
git clone https://github.com/your-username/DID-Auth-System.git
cd DID-Auth-System

2️⃣ Backend Setup
cd backend
npm install
npm start

3️⃣ Frontend Setup
cd frontend
npm install
npm start

4️⃣ ML Service Setup
cd ml
pip install -r requirements.txt
python app.py

5️⃣ Blockchain Setup
Open Remix IDE
Deploy smart contract
Connect MetaMask
Update contract address
