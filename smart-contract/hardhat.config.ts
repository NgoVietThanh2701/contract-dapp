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
      arbitest: {
         url: "https://sepolia-rollup.arbitrum.io/rpc",
         accounts: [process.env.PRIVATE_KEY ?? ""],
      },
   },
   etherscan: {
      apiKey: process.env.API_KEY,
   },
};

export default config;
