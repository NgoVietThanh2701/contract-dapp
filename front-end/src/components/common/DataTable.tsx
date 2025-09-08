import { DataGrid } from '@mui/x-data-grid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTable = ({ rows, columns, height }: any) => {
  console.log(rows);
  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      getRowId={(row) => row.uid}
      getRowHeight={() => height ?? 100}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 4, page: 0 }
        }
      }}
      pageSizeOptions={[4]}
    />
  );
};

export default DataTable;
