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
            ethers.utils.toUtf8Bytes("chu ky so cua sender"),
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
      const signatureSender = "chu ky so cua sender";
      await handOver
         .connect(receiver)
         .signHandOver(handOversReceiver[0].uid, ethers.utils.toUtf8Bytes(signatureSender));
      handOverIsSigned = await handOver.getHandOversIsSigned(sender.address);
      expect(handOverIsSigned.length).equal(1);
      expect(handOverIsSigned[0].isSigned).equal(true);
      expect(
         ethers.utils.toUtf8String(handOverIsSigned[0].handOverDetails.receiverSignature),
      ).equal(signatureSender);
      console.log(handOverIsSigned[0]);
   });
});
