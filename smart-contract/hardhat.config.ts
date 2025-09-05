import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
   solidity: {
      version: "0.8.19",
      settings: {
         optimizer: {
            enabled: true,
            runs: 1,
         },
         viaIR: true,
      },
   },
   networks: {
      sepolia: {
         url: process.env.SEPOLIA_URL,
         accounts: [process.env.PRIVATE_KEY || ""],
      },
   },
   etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY || "",
   },
};

export default config;
