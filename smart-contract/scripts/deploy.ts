import { ethers, hardhatArguments } from "hardhat";
import * as Config from "./config";

async function main() {
   await Config.initConfig();
   const network = hardhatArguments.network ?? "dev";
   const [deployer] = await ethers.getSigners();
   console.log("deploy from address: ", deployer.address);

   const HandOver = await ethers.getContractFactory("HandOver");
   const handOver = await HandOver.deploy();
   console.log("Hand over address: ", handOver.address);
   Config.setConfig(network + ".HandOver", handOver.address);

   await Config.updateConfig();
}

main()
   .then(() => process.exit(0))
   .catch(error => {
      console.log(error);
      process.exit(1);
   });
