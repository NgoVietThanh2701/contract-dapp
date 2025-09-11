import { useEffect, useMemo, useState } from 'react';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import nodata_img from '../assets/nodata.jpg';
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router';
import HandOverContract from '../contracts/HandOverContract';
import DataTable from '../components/common/DataTable';
import { columns } from './Dashboard/Home';
import ModalView from '../components/ModalView';

const HistoryHandOver = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [handOversHistory, setHandOversHistory] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { address, web3Provider } = useOutletContext<any>();

  const [modal, setModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [handOver, setHandOver] = useState<any>();

  const getHandOversHistory = async () => {
    if (!address) return;
    try {
      const handOverContract = new HandOverContract();
      const response = await handOverContract.getHandOversIsSigned(address);
      const listHandOvers = [];
      for (let i = 0; i < response.length; i++) {
        listHandOvers.push(convertObjectProduct(response[i]));
      }
      setHandOversHistory(listHandOvers.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  console.log(handOversHistory);

  useEffect(() => {
    getHandOversHistory();
  }, [address]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertObjectProduct = (data: any) => {
    return {
      uid: data.uid.toNumber(),
      receiverAddress: data.receiverAddress,
      senderAddress: data.senderAddress,
      handOverDetails: {
        baseOn: data.handOverDetails.baseOn,
        dateHandOver: new Date(data.handOverDetails.dateHandOver * 1000),
        deviceId: ethers.utils.parseBytes32String(
          data.handOverDetails.deviceId
        ),
        deviceName: data.handOverDetails.deviceName,
        notes: data.handOverDetails.notes,
        quantity: data.handOverDetails.quantity.toNumber(),
        receiverPosition: data.handOverDetails.receiverPosition,
        receiverRepresentative: data.handOverDetails.receiverRepresentative,
        receiverUnit: data.handOverDetails.receiverUnit,
        receiverSignature: data.handOverDetails.receiverSignature,
        senderPosition: data.handOverDetails.senderPosition,
        senderRepresentative: data.handOverDetails.senderRepresentative,
        senderSignature: data.handOverDetails.senderSignature,
        senderUnit: data.handOverDetails.senderUnit
      }
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleView = (handOvera: any) => {
    setHandOver(handOvera);
    setModal(true);
  };

  const actionView = {
    field: 'action',
    headerName: 'Thao tác',
    width: 110,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: any) => (
      <button
        onClick={() => handleView(params.row)}
        className="text-white bg-green-500 px-3 py-1.5 rounded-md"
      >
        Chi tiết
      </button>
    )
  };

  // Lọc rows theo deviceName hoặc baseOn
  const [filterText, setFilterText] = useState('');

  const filteredRows = useMemo(() => {
    if (!filterText) return handOversHistory;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return handOversHistory.filter((row: any) => {
      const deviceName = row.handOverDetails?.deviceName?.toLowerCase() || '';
      const baseOn = row.handOverDetails?.baseOn?.toLowerCase() || '';
      return (
        deviceName.includes(filterText.toLowerCase()) ||
        baseOn.includes(filterText.toLowerCase())
      );
    });
  }, [handOversHistory, filterText]);

  return (
    <>
      {modal && (
        <ModalView
          handOver={handOver}
          setModal={setModal}
          web3Provider={web3Provider}
        />
      )}
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full text-center">
          {/* Thanh filter */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Tìm theo thiết bị hoặc căn cứ..."
              className="px-3 py-2 border rounded-lg w-72 text-sm"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          {handOversHistory.length > 0 ? (
            <DataTable
              columns={columns.concat(actionView)}
              rows={filteredRows}
            />
          ) : (
            <div className="flex flex-col gap-3 items-center justify-center mt-10">
              <img src={nodata_img} alt="no data" />
              Không có dữ liệu nào!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryHandOver;
