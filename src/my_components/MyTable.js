import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { API_BASE_URL } from './constants.tsx';

const columns = [
  { field: 'ticker', headerName: 'Ticker', width: 90 },
  { field: 'date', headerName: 'Date', type: 'date', width: 120 },
  { field: 'amount', headerName: 'Amount', type: 'number', width: 90 },
  { field: 'price', headerName: 'Price', type: 'number', width: 90 },
  { field: 'total', headerName: 'Total', type: 'number', width: 90 },
  { field: 'fx', headerName: 'Fx', type: 'number', width: 90 },
  { field: 'kind', headerName: 'Kind', width: 100 }
];

export default function MyTable(props) {
  const ticker = props.ticker;
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const searchParams = new URLSearchParams({
      ticker: props.ticker,
      filter_kind: props.selectedOption
    });

    fetch(`${API_BASE_URL}/activity?` + searchParams)
      .then((response) => {
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        return response.json();
      })
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
        setRows(rows_);
      })
      .catch((error) => {
        console.error('Activity fetch error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ticker, props.selectedOption]);

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
      />
    </div>
  );
}
