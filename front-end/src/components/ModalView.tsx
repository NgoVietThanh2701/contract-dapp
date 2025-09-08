import { IoCloseCircleOutline } from 'react-icons/io5';
import { showShortAddress } from './header/UserDropdown';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import { useRef, useState } from 'react';
import { getAbiHandOver, HAND_OVER_ADDRESS } from '../contracts/config';
import { ethers } from 'ethers';
import Loading from '../components/Loading';
import HandOverContract from '../contracts/HandOverContract';
import toast, { Toaster } from 'react-hot-toast';

const pinataConfig = {
  root: 'https://api.pinata.cloud',
  headers: {
    pinata_api_key: import.meta.env.VITE_APP_PINATA_APIKEY,
    pinata_secret_api_key: import.meta.env.VITE_APP_PINATA_SECRETKEY
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModalView = ({ handOver, setModal, web3Provider }: any) => {
  const [signature, SetSignature] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);

  const saveSignature = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL();
      SetSignature(dataURL);
    }
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
    SetSignature('');
  };

  function base64ToFile(base64Data: string, filename = 'signature.png'): File {
    const [meta, content] = base64Data.split(',');
    const mime = meta.match(/:(.*?);/)![1];
    const byteArray = Uint8Array.from(atob(content), (c) => c.charCodeAt(0));
    return new File([byteArray], filename, { type: mime });
  }

  const handSignHandOver = async () => {
    if (!web3Provider) return;
    try {
      const url = `${pinataConfig.root}/pinning/pinFileToIPFS`;

      const formDataToUpload = new FormData();
      if (signature) {
        const blob = base64ToFile(signature);
        const file = new File([blob], 'signature.png', {
          type: 'image/png'
        });

        formDataToUpload.append('file', file);
        formDataToUpload.append(
          'pinataOptions',
          JSON.stringify({ cidVersion: 1 })
        );
        formDataToUpload.append(
          'pinataMetadata',
          JSON.stringify({ name: 'signature.png' })
        );
      }

      const response = await axios({
        method: 'post',
        url: url,
        data: formDataToUpload,
        headers: pinataConfig.headers
      });
      const urlImage = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      const handOverContract = new HandOverContract(web3Provider);
      listenEvent();
      setIsLoading(true);
      await handOverContract.signHandOver(handOver.uid, urlImage);
    } catch (error) {
      console.log(error);
      setModal(false);
      setIsLoading(false);
    }
  };

  console.log(signature);

  const listenEvent = () => {
    const contract = new ethers.Contract(
      HAND_OVER_ADDRESS,
      getAbiHandOver(),
      web3Provider
    );
    contract.once('SignHandOverEvent', (uid) => {
      setIsLoading(false);
      setModal(false);
      toast.success('Success', { position: 'top-center' });
    });
  };

  return (
    <div className="bg-[rgba(0,0,0,0.5)] z-9999999 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-centerr">
      <div className="flex flex-col gap-3 mt-5 w-[700px] h-fit bg-white rounded-lg py-4 relative">
        <button
          className="absolute top-2 right-2"
          onClick={() => setModal(false)}
        >
          <IoCloseCircleOutline color="black" size={24} />
        </button>
        <div className="max-w-4xl mx-auto flex flex-col px-8 pt-2 bg-white shadow-lg rounded-2xl">
          <h1 className="text-2xl font-bold text-center mb-4">
            BIÊN BẢN BÀN GIAO THIẾT BỊ
          </h1>

          <div className="flex gap-10 mb-6 text-sm text-gray-600">
            <p>
              Mã hợp đồng: <span className="font-semibold">{handOver.uid}</span>
            </p>
            <p>
              Căn cứ:{' '}
              <span className="italic">{handOver.handOverDetails.baseOn}</span>
            </p>
            <p>
              Ngày bàn giao:{' '}
              <span className="font-medium">
                {handOver.handOverDetails.dateHandOver.toLocaleDateString(
                  'vi-VN'
                )}
              </span>
            </p>
          </div>

          {/* Bên giao */}
          <div className="flex">
            <div className="mb-4 flex-1">
              <h2 className="font-bold text-lg mb-2">BÊN GIAO</h2>
              <div className="flex gap-6">
                <p>Đơn vị: {handOver.handOverDetails.senderUnit}</p>
                <p>Đại diện: {handOver.handOverDetails.senderRepresentative}</p>
              </div>
              <p>Chức vụ: {handOver.handOverDetails.senderPosition}</p>
              <p>Địa chỉ ví: {showShortAddress(handOver.senderAddress, 6)}</p>
            </div>

            {/* Bên nhận */}
            <div className="mb-4 flex-1">
              <h2 className="font-bold text-lg mb-2">BÊN NHẬN</h2>
              <div className="flex gap-6">
                <p>Đơn vị: {handOver.handOverDetails.receiverUnit}</p>
                <p>
                  Đại diện: {handOver.handOverDetails.receiverRepresentative}
                </p>
              </div>
              <p>Chức vụ: {handOver.handOverDetails.receiverPosition}</p>
              <p>Địa chỉ ví: {showShortAddress(handOver.receiverAddress, 6)}</p>
            </div>
          </div>

          {/* Thông tin thiết bị */}
          <div className="mb-4">
            <h2 className="font-bold text-lg mb-2">THIẾT BỊ BÀN GIAO</h2>
            <p>Mã thiết bị: {handOver.handOverDetails.deviceId}</p>
            <p>Tên thiết bị: {handOver.handOverDetails.deviceName}</p>
            <p>Số lượng: {handOver.handOverDetails.quantity}</p>
            <p>Ghi chú: {handOver.handOverDetails.notes}</p>
          </div>

          {/* Chữ ký */}
          <div className="grid grid-cols-2 gap-8 mt-8 text-center">
            {/* Bên giao */}
            <div>
              <p className="font-bold mb-2">ĐẠI DIỆN BÊN GIAO</p>
              <div className="h-28 flex items-center justify-center border border-gray-400 rounded-lg bg-gray-50 shadow-sm">
                {handOver.handOverDetails.senderSignature ? (
                  <img
                    src={handOver.handOverDetails.senderSignature}
                    alt="Sender signature"
                    className="h-20 object-contain"
                  />
                ) : (
                  <span className="text-gray-400">Chưa ký</span>
                )}
              </div>
              <p className="mt-2 font-medium">
                {handOver.handOverDetails.senderRepresentative}
              </p>
            </div>

            {/* Bên nhận */}
            <div>
              <p className="font-bold mb-2">ĐẠI DIỆN BÊN NHẬN</p>

              <div className="flex flex-col items-center border border-gray-400 rounded-lg bg-gray-50 shadow-sm p-3">
                {!handOver.handOverDetails.receiverSignature ? (
                  <div>
                    <SignatureCanvas
                      penColor="black"
                      ref={sigCanvas}
                      canvasProps={{
                        width: 280,
                        height: 80,
                        className: 'bg-white rounded shadow-inner'
                      }}
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={saveSignature}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Lưu
                      </button>
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={handOver.handOverDetails.receiverSignature}
                    alt="Sender signature"
                    className="h-20 object-contain"
                  />
                )}
              </div>

              <p className="mt-2 font-medium">
                {handOver.handOverDetails.receiverRepresentative}
              </p>
            </div>
          </div>

          {!handOver.handOverDetails.receiverSignature &&
            (!isLoading ? (
              <button
                onClick={handSignHandOver}
                className="bg-green-500 rounded-lg w-32 mb-3 mx-auto text-white px-3 py-2"
              >
                Ký biên bản
              </button>
            ) : (
              <Loading />
            ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ModalView;
