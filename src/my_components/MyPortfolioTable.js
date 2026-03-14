import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { API_BASE_URL } from './constants.tsx';

const columns = [
  { field: 'ticker', headerName: 'Ticker', width: 120 },
  { field: 'sector', headerName: 'Sector', width: 120 },
  { field: 'country', headerName: 'Country', width: 90 },
  { field: 'fx', headerName: 'FX', width: 90 },
  { field: 'n_shares', headerName: '# Shares', width: 90, type: 'number' },
  { field: 'price', headerName: 'Price', width: 90, type: 'number' },
  {
    field: 'profit',
    headerName: 'Profit',
    width: 100,
    type: 'number',
    renderCell: (params) => {
      const val = params.value;
      const color = val > 0 ? '#16a34a' : val < 0 ? '#dc2626' : '#111827';
      return <span style={{ color, fontWeight: 600 }}>{val}</span>;
    }
  },
  {
    field: 'profit_perc',
    headerName: 'Profit %',
    width: 100,
    type: 'number',
    renderCell: (params) => {
      const val = params.value;
      const color = val > 0 ? '#16a34a' : val < 0 ? '#dc2626' : '#111827';
      return <span style={{ color, fontWeight: 600 }}>{val}%</span>;
    }
  },
  { field: 'total_fee', headerName: 'Fee', width: 100, type: 'number' },
  { field: 'total_cost', headerName: 'Cost', width: 120, type: 'number' },
  { field: 'value', headerName: 'Value', width: 120, type: 'number' },
  {
    field: 'portfolio_perc',
    headerName: 'Portfolio %',
    width: 100,
    type: 'number',
    renderCell: (params) => {
      return <span>{params.value}%</span>;
    }
  },
];

export default function MyPortfolioTable() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/portfolio_stats`)
      .then((response) => {
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const rows_ = Object.keys(data['DT']).map((key) => ({
          id: key,
          ticker: data['TICKER'][key],
          sector: data['SECTOR'][key],
          country: data['COUNTRY'][key],
          fx: data['FX'][key],
          n_shares: data['N_SHARES'][key],
          price: data['PRICE'][key],
          profit: data['PROFIT'][key],
          profit_perc: data['PROFIT%'][key],
          total_fee: data['TOTAL_FEE'][key],
          total_cost: data['TOTAL_COST'][key],
          value: data['TOTAL_VALUE'][key],
          portfolio_perc: data['PORTFOLIO%'][key],
        }));
        setRows(rows_);
      })
      .catch((error) => {
        console.error('Portfolio stats error:', error);
        setError('Failed to load portfolio data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        autoHeight
        density="compact"
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'table-row-even' : 'table-row-odd'
        }
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 50 },
          },
          sorting: {
            sortModel: [{ field: 'value', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        sx={{
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: 3,
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
