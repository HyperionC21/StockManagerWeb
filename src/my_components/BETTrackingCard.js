import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { API_BASE_URL } from './constants.tsx';

function BETTrackingCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/bet_tracking`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="chart-loading">
        <div className="chart-loading__spinner" />
        Loading BET tracking…
      </div>
    );
  }

  if (error || !data) {
    return <div className="error-banner">{error || 'No data'}</div>;
  }

  const { composition, missing_from_top10, extra_holdings, tracking_error } = data;
  const heldCount = composition.filter((r) => r.held).length;

  const chartOptions = {
    chart: { type: 'bar', toolbar: { show: false }, zoom: { enabled: false } },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '60%', borderRadius: 3 },
    },
    dataLabels: { enabled: false },
    colors: ['#94a3b8', '#4f46e5'],
    xaxis: { categories: composition.map((r) => r.ticker) },
    yaxis: { labels: { formatter: (v) => v.toFixed(1) + '%' } },
    legend: { position: 'top' },
    tooltip: {
      shared: true,
      y: { formatter: (v) => v.toFixed(2) + '%' },
    },
  };

  const series = [
    { name: 'BET Weight', data: composition.map((r) => r.bet_weight) },
    { name: 'Your Weight', data: composition.map((r) => r.user_weight) },
  ];

  return (
    <div>
      {/* Summary strip */}
      <div className="bet-summary">
        <div className="bet-summary__stat">
          <span className="bet-summary__label">Tracking Error</span>
          <span className="bet-summary__value">{tracking_error}%</span>
        </div>
        <div className="bet-summary__stat">
          <span className="bet-summary__label">Positions Held</span>
          <span className="bet-summary__value">
            {heldCount} / {composition.length}
          </span>
        </div>
        <div className="bet-summary__stat">
          <span className="bet-summary__label">Romanian NAV</span>
          <span className="bet-summary__value">
            {data.total_romanian_nav.toLocaleString('ro-RO', {
              maximumFractionDigits: 0,
            })}{' '}
            RON
          </span>
        </div>
      </div>

      {/* Grouped bar chart: BET vs user per ticker */}
      <Chart
        options={chartOptions}
        series={series}
        type="bar"
        height={260}
        width="100%"
      />

      {/* Divergence table */}
      <div className="bet-table">
        <div className="bet-table__header">
          <span>Ticker</span>
          <span>Name</span>
          <span>BET</span>
          <span>You</span>
          <span>Δ</span>
        </div>
        {composition.map((row) => (
          <div
            key={row.ticker}
            className={`bet-table__row${!row.held ? ' bet-table__row--missing' : ''}`}
          >
            <span className="bet-table__ticker">{row.ticker}</span>
            <span className="bet-table__name">{row.name}</span>
            <span>{row.bet_weight.toFixed(2)}%</span>
            <span>{row.user_weight.toFixed(2)}%</span>
            <span
              className={
                row.divergence >= 0
                  ? 'metrics__value--positive'
                  : 'metrics__value--negative'
              }
            >
              {row.divergence > 0 ? '+' : ''}
              {row.divergence.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Chips for missing / extra */}
      {missing_from_top10.length > 0 && (
        <div className="bet-chips">
          <span className="bet-chips__label">Not held:</span>
          {missing_from_top10.map((t) => (
            <span key={t} className="bet-chip bet-chip--missing">
              {t}
            </span>
          ))}
        </div>
      )}

      {extra_holdings.length > 0 && (
        <div className="bet-chips">
          <span className="bet-chips__label">Outside top 10:</span>
          {extra_holdings.map((t) => (
            <span key={t} className="bet-chip bet-chip--extra">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default BETTrackingCard;
