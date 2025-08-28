import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import DataTable from "../../components/common/DataTable";

const Home = () => {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          {/* <DataTable columns={columnDelveryHub} rows={productsDeliveryed} /> : */}
        </div>
      </div>
    </>
  );
};

export default Home;

const columnDelveryHub = [
  {
    field: "uid",
    headerName: "ID",
    width: 20,
  },
  {
    field: "code",
    headerName: "Mã sản phẩm",
    width: 150,
  },
  {
    field: "name",
    headerName: "Tên",
    width: 90,
  },
  {
    field: "images",
    headerName: "Hình ảnh",
    width: 130,
    renderCell: (params: any) => (
      <img
        className="rounded-full w-32 h-24 object-cover"
        src={params.row.images}
        alt=""
      />
    ),
  },
  {
    field: "quantity",
    headerName: "Số lượng",
    width: 80,
    renderCell: (params: any) => <span>{params.row.quantity} Kg</span>,
  },
  {
    field: "feeShip",
    headerName: "Phí ship",
    width: 90,
    renderCell: (params: any) => <span>{params.row.feeShip} AGT</span>,
  },
  {
    field: "from",
    headerName: "Người gửi",
    width: 120,
  },
  {
    field: "to",
    headerName: "Địa chỉ",
    width: 260,
    renderCell: (params: any) => <span>{params.row.to}</span>,
  },
];
