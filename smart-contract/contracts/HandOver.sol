// SPDX-License-Identifier: NONE
pragma solidity ^0.8.19;

struct HandOverDetails {
   string baseOn;
   uint256 dateHandOver;
   string senderUnit;
   string senderRepresentative;
   string senderPosition;
   string receiverUnit;
   string receiverRepresentative;
   string receiverPosition;
   bytes32 deviceId;
   string deviceName;
   uint256 quantity;
   string notes;
   bytes receiverSignature;
   bytes senderSignature;
}

struct HandOverInfo {
   uint256 uid;
   address senderAddress;
   address receiverAddress;
   bool isSigned;
   HandOverDetails handOverDetails;
}

contract HandOver {
   event CreateHandOverEvent(uint _uid);
   event SignHandOverEvent(uint _uid);

   uint256 private uid;

   mapping(uint256 => HandOverInfo) private handOverInfos;

   constructor() {
      uid = 1;
   }

   function createHandOver(
      string calldata _baseOn,
      string calldata _senderUnit,
      string calldata _senderRepresentative,
      string calldata _senderPosition,
      string calldata _receiverUnit,
      string calldata _receiverRepresentative,
      string calldata _receiverPosition,
      address _receiverAddress,
      bytes32 _deviceId,
      string calldata _deviceName,
      uint256 _quantity,
      string calldata _notes,
      bytes calldata _senderSignature
   ) external {
      require(_receiverAddress != address(0), "Receiver zero address");
      require(_quantity > 0, "Quantity must be > 0");

      uint256 currentUid = uid;
      HandOverInfo memory hand_over_info;
      hand_over_info.uid = currentUid;
      hand_over_info.senderAddress = msg.sender;
      hand_over_info.receiverAddress = _receiverAddress;
      hand_over_info.isSigned = false;
      hand_over_info.handOverDetails.baseOn = _baseOn;
      hand_over_info.handOverDetails.dateHandOver = block.timestamp;
      hand_over_info.handOverDetails.senderUnit = _senderUnit;
      hand_over_info.handOverDetails.senderRepresentative = _senderRepresentative;
      hand_over_info.handOverDetails.senderPosition = _senderPosition;
      hand_over_info.handOverDetails.receiverUnit = _receiverUnit;
      hand_over_info.handOverDetails.receiverRepresentative = _receiverRepresentative;
      hand_over_info.handOverDetails.receiverPosition = _receiverPosition;
      hand_over_info.handOverDetails.deviceId = _deviceId;
      hand_over_info.handOverDetails.deviceName = _deviceName;
      hand_over_info.handOverDetails.quantity = _quantity;
      hand_over_info.handOverDetails.notes = _notes;
      hand_over_info.handOverDetails.senderSignature = _senderSignature;
      hand_over_info.handOverDetails.receiverSignature = "";

      handOverInfos[currentUid] = hand_over_info;
      emit CreateHandOverEvent(uid);
      uid = currentUid + 1;
   }

   function getHandOversIsSigned(address _address) external view returns (HandOverInfo[] memory) {
      uint256 count = 0;

      // Đếm số phần tử hợp lệ
      for (uint256 i = 1; i < uid; i++) {
         if (
            (handOverInfos[i].senderAddress == _address ||
               handOverInfos[i].receiverAddress == _address) && handOverInfos[i].isSigned
         ) {
            count++;
         }
      }

      HandOverInfo[] memory hand_overs = new HandOverInfo[](count);
      uint256 index = 0;
      for (uint256 i = 1; i < uid; i++) {
         if (
            (handOverInfos[i].senderAddress == _address ||
               handOverInfos[i].receiverAddress == _address) && handOverInfos[i].isSigned
         ) {
            hand_overs[index] = handOverInfos[i];
            index++;
         }
      }
      return hand_overs;
   }

   function getHandOversBySender(address _address) external view returns (HandOverInfo[] memory) {
      uint256 count = 0;

      // Đếm số phần tử hợp lệ
      for (uint256 i = 1; i < uid; i++) {
         if (handOverInfos[i].senderAddress == _address && handOverInfos[i].isSigned == false) {
            count++;
         }
      }

      HandOverInfo[] memory hand_overs = new HandOverInfo[](count);
      uint256 index = 0;
      for (uint256 i = 1; i < uid; i++) {
         if (handOverInfos[i].senderAddress == _address && handOverInfos[i].isSigned == false) {
            hand_overs[index] = handOverInfos[i];
            index++;
         }
      }
      return hand_overs;
   }

   function getHandOversByReceiver(address _address) external view returns (HandOverInfo[] memory) {
      uint256 count = 0;

      // Đếm số phần tử hợp lệ
      for (uint256 i = 1; i < uid; i++) {
         if (handOverInfos[i].receiverAddress == _address && handOverInfos[i].isSigned == false) {
            count++;
         }
      }

      HandOverInfo[] memory hand_overs = new HandOverInfo[](count);
      uint256 index = 0;
      for (uint256 i = 1; i < uid; i++) {
         if (handOverInfos[i].receiverAddress == _address && handOverInfos[i].isSigned == false) {
            hand_overs[index] = handOverInfos[i];
            index++;
         }
      }
      return hand_overs;
   }

   function signHandOver(uint256 _uid, bytes calldata _receiverSignature) external {
      require(_uid > 0, "Invalid UID");
      HandOverInfo storage hand_over = handOverInfos[_uid];
      require(msg.sender == hand_over.receiverAddress, "Only receiver can sign");
      require(hand_over.isSigned == false, "Aldready signed");
      hand_over.handOverDetails.receiverSignature = _receiverSignature;
      hand_over.isSigned = true;

      emit SignHandOverEvent(_uid);
   }
}
