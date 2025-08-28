import abiHandOver from "./abis/handOver.json";
import { ethers } from "ethers";

export const PRODUCT_ADDRESS: string = import.meta.env.VITE_HANDOVER || "";
export const getAbiProduct = () => abiHandOver;
export const rpcProvider: ethers.providers.JsonRpcProvider =
  new ethers.providers.JsonRpcProvider(import.meta.env.VITE_PUBLIC_RPC_TESTNET);
