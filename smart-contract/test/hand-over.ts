import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import { expect } from "chai";

describe("Hand Overs", () => {
   let sender: SignerWithAddress, receiver: SignerWithAddress;
   let handOver: Contract;
   beforeEach(async () => {
      await ethers.provider.send("hardhat_reset", []); /* reset network hardhat  */
      [sender, receiver] = await ethers.getSigners();

      const HandOver = await ethers.getContractFactory("HandOver");
      handOver = await HandOver.deploy();
   });

   it("Create hand over", async () => {
      await handOver
         .connect(sender)
         .createHandOver(
            "Căn cứ luật an toàn thông tin",
            "ATTT",
            "Ngô Viết Thành",
            "CTO",
            "Cty Napa",
            "Lan Anh",
            "Tester",
            receiver.address,
            ethers.utils.formatBytes32String("id device"),
            "Thiết bị giám sát thông minh",
            27,
            "Tải trọng nhẹ note",
            "chukysocuarsender",
         );

      // get hand over of receiver
      let handOversReceiver = await handOver.getHandOversByReceiver(receiver.address);
      expect(handOversReceiver.length).equal(1);
      expect(handOversReceiver[0].isSigned).equal(false);
      console.log(
         "Signature of receiver is 0x ?",
         handOversReceiver[0].handOverDetails.receiverSignature,
      );

      // get hand over of sender
      let handOversSender = await handOver.getHandOversBySender(sender.address);
      expect(handOversSender.length).equal(1);
      expect(handOversSender[0].isSigned).equal(false);

      let handOverIsSigned = await handOver.getHandOversIsSigned(sender.address);
      expect(handOverIsSigned.length).equal(0);
      // receiver sign hand over
      const signatureReceiver = "chu ky so cua receiver";
      await handOver.connect(receiver).signHandOver(handOversReceiver[0].uid, signatureReceiver);
      handOverIsSigned = await handOver.getHandOversIsSigned(sender.address);
      expect(handOverIsSigned.length).equal(1);
      expect(handOverIsSigned[0].isSigned).equal(true);
      expect(handOverIsSigned[0].handOverDetails.receiverSignature).equal(signatureReceiver);
      console.log(handOverIsSigned[0]);
   });
});
