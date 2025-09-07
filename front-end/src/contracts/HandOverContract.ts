import { ethers } from 'ethers';
import { HAND_OVER_ADDRESS, getAbiHandOver, rpcProvider } from './config.ts';
import BaseInterface from './interfaces/BaseInterface.ts';

export default class HandOverContract extends BaseInterface {
  constructor(provider?: ethers.providers.Web3Provider) {
    super(provider || rpcProvider, HAND_OVER_ADDRESS, getAbiHandOver());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abi,
        rpcProvider
      );
    }
  }

  async createHandOver(
    baseOn: string,
    senderUint: string,
    senderRepresent: string,
    senderPosition: string,
    receiverUnit: string,
    receiverRepresent: string,
    receiverPosition: string,
    receiverAddress: string,
    deviceId: string,
    deviceName: string,
    quantity: number,
    notes: string,
    senderSignature: string
  ) {
    await this._contract.createHandOver(
      baseOn,
      senderUint,
      senderRepresent,
      senderPosition,
      receiverUnit,
      receiverRepresent,
      receiverPosition,
      receiverAddress,
      ethers.utils.formatBytes32String(deviceId),
      deviceName,
      quantity,
      notes,
      senderSignature,
      this._option
    );
  }
}
