import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

const DataTable = ({ rows, columns, height }: any) => {
  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      getRowId={(row) => row.code}
      getRowHeight={() => height ?? 100}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 4, page: 0 },
        },
      }}
      pageSizeOptions={[4]}
    />
  );
};

export default DataTable;
