import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import { useState } from 'react';
import { useOutletContext } from 'react-router';
import HandOverContract from '../contracts/HandOverContract';
import { ethers } from 'ethers';
import { getAbiHandOver, HAND_OVER_ADDRESS } from '../contracts/config';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../components/Loading';

interface FormData {
  baseOn: string;
  senderUnit: string;
  senderRepresentative: string;
  senderPosition: string;
  receiverUnit: string;
  receiverRepresentative: string;
  receiverPosition: string;
  receiverAddress: string;
  deviceId: string;
  deviceName: string;
  quantity: number;
  notes: string;
  senderSignature: string;
}

const CreatePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { web3Provider, address } = useOutletContext<any>();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    baseOn: '',
    senderUnit: '',
    senderRepresentative: '',
    senderPosition: '',
    receiverUnit: '',
    receiverRepresentative: '',
    receiverPosition: '',
    receiverAddress: '',
    deviceId: '',
    deviceName: '',
    quantity: 0,
    notes: '',
    senderSignature: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (web3Provider & address) return;
    try {
      const handOverContract = new HandOverContract(web3Provider);
      listenEvent();
      await handOverContract.createHandOver(
        formData.baseOn,
        formData.senderUnit,
        formData.senderRepresentative,
        formData.senderPosition,
        formData.receiverUnit,
        formData.receiverRepresentative,
        formData.receiverPosition,
        formData.receiverAddress,
        formData.deviceId,
        formData.deviceName,
        formData.quantity,
        formData.notes,
        formData.senderSignature
      );
      setFormData({
        baseOn: '',
        senderUnit: '',
        senderRepresentative: '',
        senderPosition: '',
        receiverUnit: '',
        receiverRepresentative: '',
        receiverPosition: '',
        receiverAddress: '',
        deviceId: '',
        deviceName: '',
        quantity: 0,
        notes: '',
        senderSignature: ''
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const listenEvent = () => {
    const contract = new ethers.Contract(
      HAND_OVER_ADDRESS,
      getAbiHandOver(),
      web3Provider
    );
    contract.once('CreateHandOverEvent', (_uid) => {
      setIsLoading(false);
      toast.success('Success', { position: 'top-center' });
    });
  };

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full text-center">
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-left block mb-1">
                    Căn cứ quyết định số
                  </label>
                  <input
                    type="text"
                    name="baseOn"
                    value={formData.baseOn}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="md:text-left  block mb-1">
                    Đơn vị gửi (A)
                  </label>
                  <input
                    type="text"
                    name="senderUnit"
                    value={formData.senderUnit}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="md:text-left  block mb-1">
                    Người đại diện
                  </label>
                  <input
                    type="text"
                    name="senderRepresentative"
                    value={formData.senderRepresentative}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="md:text-left  block mb-1">Vị trí (A)</label>
                  <input
                    type="text"
                    name="senderPosition"
                    value={formData.senderPosition}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="md:text-left  block mb-1">
                    Đơn vị nhận (B)
                  </label>
                  <input
                    type="text"
                    name="receiverUnit"
                    value={formData.receiverUnit}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="md:text-left  block mb-1">
                    Người đại diện
                  </label>
                  <input
                    type="text"
                    name="receiverRepresentative"
                    value={formData.receiverRepresentative}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="md:text-left  block mb-1">Vị trí (B)</label>
                  <input
                    type="text"
                    name="receiverPosition"
                    value={formData.receiverPosition}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="md:text-left  block mb-1">
                    Địa chỉ người nhận
                  </label>
                  <input
                    type="text"
                    name="receiverAddress"
                    value={formData.receiverAddress}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="md:text-left  block mb-1">
                    ID thiết bị
                  </label>
                  <input
                    type="text"
                    name="deviceId"
                    value={formData.deviceId}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 font-mono"
                    placeholder="bytes32 hex..."
                  />
                </div>
                <div>
                  <label className="md:text-left  block mb-1">
                    Tên thiết bị
                  </label>
                  <input
                    type="text"
                    name="deviceName"
                    value={formData.deviceName}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="md:text-left  block mb-1">Số lượng</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="md:text-left  block mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="md:text-left  block mb-1">
                    Chữ ký bên A
                  </label>
                  <input
                    type="text"
                    name="senderSignature"
                    value={formData.senderSignature}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 font-mono"
                    placeholder="0x..."
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 text-right">
              {!isLoading ? (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                  Submit
                </button>
              ) : (
                <Loading />
              )}
            </div>
          </form>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default CreatePage;
