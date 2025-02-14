import { ethers } from "ethers";
import path from "path";
import fs from "fs";

// Set up the provider
const provider = new ethers.JsonRpcProvider("ETH-RPC-URL");

// Nonfungible Position Manager contract address on Sepolia

const V3NFTManagerAddress = "0x1238536071E1c677A632429e3655c799b22cDA52";
const abiPathNFTPositionManager = path.resolve(__dirname, "../abis/NonfungiblePositionManager.json");
const nonfungiblePositionManagerABI = JSON.parse(fs.readFileSync(abiPathNFTPositionManager, "utf8"));

const V3FactoryAddress = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c";
const abiPathFactory = path.resolve(__dirname, "../abis/Factory.json");
const factoryABI = JSON.parse(fs.readFileSync(abiPathFactory, "utf8"));


// Function to find the pool address
async function findPoolAddress(tokenId: number) {
  // Create a contract instance for the Nonfungible Position Manager
  const nftContract = new ethers.Contract(V3NFTManagerAddress, nonfungiblePositionManagerABI, provider);
  
  // Get the position details
  const position = await nftContract.positions(tokenId);
  const [token0, token1, fee] = [position.token0, position.token1, position.fee];
  
  // Log the parameters to ensure they are correct
  console.log(`Token0: ${token0}, Token1: ${token1}, Fee: ${fee}`);
  
  // Create a contract instance for the Factory
  const factoryContract = new ethers.Contract(V3FactoryAddress, factoryABI, provider);
  
  // Get the pool address
  try {
    const poolAddress = await factoryContract.getPool(token0, token1, fee);
    console.log(`Pool Address: ${poolAddress}`);
  } catch (error) {
    console.error("Error fetching pool address:", error);
  }
}

// Example usage
findPoolAddress(12345);