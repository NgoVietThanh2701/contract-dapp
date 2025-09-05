import abiHandOver from './abis/handOver.json';
import { ethers } from 'ethers';

export const HAND_OVER_ADDRESS: string = import.meta.env.VITE_HANDOVER || '';
export const getAbiHandOver = () => abiHandOver;
export const rpcProvider: ethers.providers.JsonRpcProvider =
  new ethers.providers.JsonRpcProvider(import.meta.env.VITE_PUBLIC_RPC_SEPOLIA);
