import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { SERVER_ADDRESS } from './constants.tsx';

const SERVER_PORT = '5000'
const SERVER_URL = `http://${SERVER_ADDRESS}:${SERVER_PORT}/`


const columns = [
  { field: 'ticker', 
    headerName: '🏷️ Ticker', 
    width: 120 
  },
  {
    field: 'sector',
    headerName: '🏭 Sector',
    width: 120,
  },
  {
    field: 'country',
    headerName: '🌍 Country',
    width: 90,
  },
  {
    field: 'fx',
    headerName: '💱 FX',
    width: 90,
  },
  {
    field : 'n_shares',
    headerName : '🧾 # Shares',
    width: 90,
    type: 'number'
  },
  {
    field : 'price',
    headerName : '💵 Price',
    width: 90,
    type: 'number'
  },
  {
    field : 'profit',
    headerName : '📈 Profit',
    width: 90,
    type: 'number'
  },
  {
    field : 'profit_perc',
    headerName : '📊 Profit %',
    width: 90,
    type: 'number'
  },
  {
    field : 'total_fee',
    headerName : '💸 Fee',
    width: 120,
    type: 'number'
  },
  {
    field : 'total_cost',
    headerName : '🧮 Cost',
    width: 120,
    type: 'number'
  },
  {
    field : 'value',
    headerName : '💰 Value',
    width: 120,
    type: 'number'
  }
];

export default function MyPortfolioTable(props) {


    const [rows, setRows] = React.useState([

      ]);
  

    React.useEffect(() => {
        const searchParams = new URLSearchParams({
          ticker : props.ticker,
          filter_kind : props.selectedOption
        })

        fetch(`${SERVER_URL}portfolio_stats`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            const rows_ = Object.keys(data['DT']).map((key) => ({
                id: key,
                ticker: data['TICKER'][key],
                sector : data['SECTOR'][key],
                country : data['COUNTRY'][key],
                fx : data['FX'][key],
                n_shares : data['N_SHARES'][key],
                price : data['PRICE'][key],
                profit : data['PROFIT'][key],
                profit_perc : data['PROFIT%'][key],
                total_fee : data['TOTAL_FEE'][key],
                total_cost : data['TOTAL_COST'][key],
                value : data['TOTAL_VALUE'][key]
              }));
            console.log(rows_);
            setRows(rows_);
          })
          .catch((error) => {
            // Handle any errors here
            console.log(error);
          });
      }, []);

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        density="compact"
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'table-row-even' : 'table-row-odd'
        }
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 50 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: 12,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f8fafc',
            color: '#111827',
            fontWeight: 600,
            borderBottom: '1px solid rgba(148, 163, 184, 0.3)'
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(148, 163, 184, 0.15)'
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.06)'
          },
          '& .table-row-even': {
            backgroundColor: '#f8fafc'
          },
          '& .table-row-odd': {
            backgroundColor: '#ffffff'
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(148, 163, 184, 0.2)'
          }
        }}
      />
    </div>
  );
}