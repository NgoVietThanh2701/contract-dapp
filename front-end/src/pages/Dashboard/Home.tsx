/* eslint-disable @typescript-eslint/no-explicit-any */
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import DataTable from '../../components/common/DataTable';
import nodata_img from '../../assets/nodata.jpg';
import {
  Tabs,
  TabsHeader,
  TabsBody,
  TabPanel,
  Tab
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import HandOverContract from '../../contracts/HandOverContract';
import { useOutletContext } from 'react-router';
import { ethers } from 'ethers';
import ModalView from '../../components/ModalView';

const Home = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { address, web3Provider } = useOutletContext<any>();
  const [activeTab, setActiveTab] = useState('wait-sign');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [handOversWaitSign, setHandOversWaitSign] = useState<any>([]);
  const [handOversCreated, setHandOversCreated] = useState<any>([]);

  const [modal, setModal] = useState(false);
  const [handOver, setHandOver] = useState<any>();

  const getHandOversCreated = async () => {
    try {
      const handOverContract = new HandOverContract();
      const response = await handOverContract.getHandOversBySender(address);
      const listHandOvers = [];
      for (let i = 0; i < response.length; i++) {
        listHandOvers.push(convertObjectProduct(response[i]));
      }
      setHandOversCreated(listHandOvers.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const getHandOversWaitSign = async () => {
    try {
      const handOverContract = new HandOverContract();
      const response = await handOverContract.getHandOversByReceiver(address);
      const listHandOvers = [];
      for (let i = 0; i < response.length; i++) {
        listHandOvers.push(convertObjectProduct(response[i]));
      }
      setHandOversWaitSign(listHandOvers.reverse());
    } catch (error) {
      console.log(error);
    }
  };

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
        receiverSignature: data.handOverDetails.handOverDetails,
        senderPosition: data.handOverDetails.senderPosition,
        senderRepresentative: data.handOverDetails.senderRepresentative,
        senderSignature: data.handOverDetails.senderSignature,
        senderUnit: data.handOverDetails.senderUnit
      }
    };
  };

  useEffect(() => {
    getHandOversCreated();
    getHandOversWaitSign();
  }, []);

  type TabData = {
    label: string;
    value: string;
    desc: React.ReactNode;
  };

  const actionSign = {
    field: 'action',
    headerName: 'Thao tác',
    width: 110,
    renderCell: (params: any) => (
      <button
        onClick={() => handleSign(params.row)}
        className="text-white bg-green-500 px-3 py-1.5 rounded-md"
      >
        Xem chi tiết
      </button>
    )
  };

  const handleSign = (handOvera: any) => {
    setHandOver(handOvera);
    setModal(true);
  };

  const data: TabData[] = [
    {
      label: `Chờ ký (${handOversWaitSign.length})`,
      value: 'wait-sign',
      desc:
        handOversWaitSign.length > 0 ? (
          <DataTable
            columns={columns.concat(actionSign)}
            rows={handOversWaitSign}
          />
        ) : (
          <div className="flex flex-col gap-3 items-center justify-center mt-10">
            <img src={nodata_img} alt="no data" />
            Không có dữ liệu nào!
          </div>
        )
    },
    {
      label: `Đã tạo (${handOversCreated.length})`,
      value: 'created',
      desc:
        handOversCreated.length > 0 ? (
          <DataTable columns={columns} rows={handOversCreated} />
        ) : (
          <div className="flex flex-col gap-3 items-center justify-center mt-10">
            <img src={nodata_img} alt="no data" />
            Không có dữ liệu nào!
          </div>
        )
    }
  ];

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
          <Tabs value={activeTab}>
            <TabsHeader
              className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
              indicatorProps={{
                className:
                  'bg-transparent border-b-2 border-gray-900 shadow-none rounded-none'
              }}
              {...({} as any)}
            >
              {data.map(({ label, value }) => (
                <Tab
                  {...({} as any)}
                  key={value}
                  value={value}
                  onClick={() => setActiveTab(value)}
                  className={
                    activeTab === value ? 'text-[#EF4D2D] text-base' : 'text-sm'
                  }
                >
                  {label}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody {...({} as any)}>
              {data.map(({ value, desc }) => (
                <TabPanel key={value} value={value}>
                  {desc}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Home;

// eslint-disable-next-line react-refresh/only-export-components
export const columns = [
  {
    field: 'uid',
    headerName: 'ID',
    width: 15
  },
  {
    field: 'baseOn',
    headerName: 'Căn cứ',
    width: 80,
    renderCell: (params: any) => <div>{params.row.handOverDetails.baseOn}</div>
  },
  {
    field: 'senderUnit',
    headerName: 'Đơn vị A',
    width: 75,
    renderCell: (params: any) => (
      <div>{params.row.handOverDetails.senderUnit}</div>
    )
  },
  {
    field: 'senderRepresentative',
    headerName: 'Đại diện A',
    width: 75,
    renderCell: (params: any) => (
      <div>{params.row.handOverDetails.senderRepresentative}</div>
    )
  },
  {
    field: 'senderPosition',
    headerName: 'Vị trí A',
    width: 90,
    renderCell: (params: any) => (
      <div>{params.row.handOverDetails.senderPosition}</div>
    )
  },
  {
    field: 'receiverUnit',
    headerName: 'Đơn vị B',
    width: 90,
    renderCell: (params: any) => (
      <div>{params.row.handOverDetails.receiverUnit}</div>
    )
  },
  {
    field: 'receiverRepresentative',
    headerName: 'Đại diện B',
    width: 90,
    renderCell: (params: any) => (
      <div>{params.row.handOverDetails.receiverRepresentative}</div>
    )
  },
  {
    field: 'receiverPosition',
    headerName: 'Ví trí B',
    width: 90,
    renderCell: (params: any) => (
      <div>{params.row.handOverDetails.receiverPosition}</div>
    )
  },
  {
    field: 'receiverAddress',
    headerName: 'Địa chỉ người nhận',
    width: 130
  },
  {
    field: 'deviceId',
    headerName: 'ID thiết bị',
    width: 70,
    renderCell: (params: any) => (
      <div>{params.row.handOverDetails.deviceId}</div>
    )
  },
  {
    field: 'deviceName',
    headerName: 'Tên thiết bị',
    width: 90,
    renderCell: (params: any) => (
      <div>{params.row.handOverDetails.deviceName}</div>
    )
  }
];
