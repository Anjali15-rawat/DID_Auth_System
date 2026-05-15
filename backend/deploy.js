const fs = require("fs");
const solc = require("solc");
const { ethers } = require("ethers");
const path = require("path");

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
    const wallet = await provider.getSigner(0); // Automatically uses the first unlocked Ganache account

    const contractPath = path.resolve(__dirname, "../blockchain/DIDRegistry.sol");
    const source = fs.readFileSync(contractPath, "utf8");

    const input = {
        language: "Solidity",
        sources: {
            "DIDRegistry.sol": {
                content: source,
            },
        },
        settings: {
            evmVersion: "paris",
            outputSelection: {
                "*": {
                    "*": ["*"],
                },
            },
        },
    };

    console.log("Compiling contract...");
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors && output.errors.some(e => e.severity === 'error')) {
        console.error("Compilation failed:", output.errors);
        process.exit(1);
    }
    
    const contractFile = output.contracts["DIDRegistry.sol"]["DIDRegistry"];
    const abi = contractFile.abi;
    const bytecode = contractFile.evm.bytecode.object;

    console.log("Deploying contract...");
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("Contract deployed at:", address);

    // Save ABI and Address to JSON for frontend/backend
    const artifact = {
        address: address,
        abi: abi
    };
    fs.writeFileSync(path.resolve(__dirname, "DIDRegistry.json"), JSON.stringify(artifact, null, 2));

    // Update .env
    const envPath = path.resolve(__dirname, ".env");
    let envContent = fs.readFileSync(envPath, "utf8");
    envContent = envContent.replace(/CONTRACT_ADDRESS=0x[a-fA-F0-9]{40}/, `CONTRACT_ADDRESS=${address}`);
    fs.writeFileSync(envPath, envContent);
    console.log("Updated .env with new contract address");

    // Update frontend Index.tsx
    try {
        const frontendPath = path.resolve(__dirname, "../frontend/src/pages/Index.tsx");
        if (fs.existsSync(frontendPath)) {
            let frontendContent = fs.readFileSync(frontendPath, "utf8");
            frontendContent = frontendContent.replace(/const contractAddress = "0x[a-fA-F0-9]{40}";/, `const contractAddress = "${address}";`);
            fs.writeFileSync(frontendPath, frontendContent);
            console.log("Updated frontend Index.tsx with new contract address");
        }
    } catch (e) {
        console.error("Could not update frontend Index.tsx:", e.message);
    }
}

main().catch(console.error);
