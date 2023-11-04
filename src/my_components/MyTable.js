import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const SERVER_ADDRESS = '192.168.100.5'
const SERVER_PORT = '5001'
const SERVER_URL = `http://${SERVER_ADDRESS}:${SERVER_PORT}/`


const columns = [
  { field: 'ticker', headerName: 'Ticker', width: 90 },
  {
    field: 'date',
    headerName: 'Date',
    type: 'date',
    width: 120,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    type: 'number',
    width: 90,
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 90,
  },
  {
    field: 'total',
    headerName: 'Total',
    type: 'number',
    width: 90,
  },
  {
    field: 'fx',
    headerName: 'Fx',
    type: 'number',
    width: 90,
  },
  { field: 'kind', headerName: 'Kind', width: 100 }
];

export default function MyTable(props) {

    const ticker = props.ticker;
    const selectedOption = props.selectedOption;

    const [rows, setRows] = React.useState([

      ]);
  

    React.useEffect(() => {
        const searchParams = new URLSearchParams({
          ticker : props.ticker,
          filter_kind : props.selectedOption
        })

        fetch(`${SERVER_URL}activity?` + searchParams)
          .then((response) => response.json())
          .then((data) => {
            const rows_ = Object.keys(data['date']).map((key) => ({
                id: key,
                amount: data['amount'][key] || null,
                date: new Date(data['date'][key]),
                fx: data['fx'][key] || null,
                kind: data['kind'][key],
                price: data['price'][key] || null,
                ticker: data['ticker'][key],
                total: data['total'][key] || null
              }));
            console.log(rows_);
            setRows(rows_);
          })
          .catch((error) => {
            // Handle any errors here
            console.log(error);
          });
      }, [ticker]);

  return (
    <div style={{ width: "90%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}