import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { API_BASE_URL } from './constants.tsx';

// ── Error boundary wraps the whole card so render errors never white-screen App ──
class BETErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error: error.message };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="error-banner">
          BET tracking failed to render: {this.state.error}
        </div>
      );
    }
    return this.props.children;
  }
}

function BETTrackingCardInner() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/bet_tracking`)
      .then((r) => (r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`)))
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

  const composition = Array.isArray(data.composition) ? data.composition : [];
  const missing_from_top10 = Array.isArray(data.missing_from_top10) ? data.missing_from_top10 : [];
  const extra_holdings = Array.isArray(data.extra_holdings) ? data.extra_holdings : [];
  const heldCount = composition.filter((r) => r.held).length;

  const chartOptions = {
    chart: { type: 'bar', toolbar: { show: false }, zoom: { enabled: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: '60%', borderRadius: 3 } },
    dataLabels: { enabled: false },
    colors: ['#94a3b8', '#4f46e5'],
    xaxis: { categories: composition.map((r) => r.ticker) },
    yaxis: {
      labels: { formatter: (v) => (v != null && !isNaN(v) ? Number(v).toFixed(1) + '%' : '') },
    },
    legend: { position: 'top' },
    tooltip: {
      shared: true,
      y: { formatter: (v) => (v != null && !isNaN(v) ? Number(v).toFixed(2) + '%' : '') },
    },
  };

  const series = [
    { name: 'BET Weight', data: composition.map((r) => Number(r.bet_weight) || 0) },
    { name: 'Your Weight', data: composition.map((r) => Number(r.user_weight) || 0) },
  ];

  return (
    <div>
      <div className="bet-summary">
        <div className="bet-summary__stat">
          <span className="bet-summary__label">Tracking Error</span>
          <span className="bet-summary__value">
            {Number(data.tracking_error || 0).toFixed(2)}%
          </span>
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
            {Math.round(data.total_romanian_nav || 0).toLocaleString()} RON
          </span>
        </div>
      </div>

      <Chart options={chartOptions} series={series} type="bar" height={260} width="100%" />

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
            <span>{Number(row.bet_weight).toFixed(2)}%</span>
            <span>{Number(row.user_weight).toFixed(2)}%</span>
            <span
              className={
                row.divergence >= 0 ? 'metrics__value--positive' : 'metrics__value--negative'
              }
            >
              {row.divergence > 0 ? '+' : ''}
              {Number(row.divergence).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {missing_from_top10.length > 0 && (
        <div className="bet-chips">
          <span className="bet-chips__label">Not held:</span>
          {missing_from_top10.map((t) => (
            <span key={t} className="bet-chip bet-chip--missing">{t}</span>
          ))}
        </div>
      )}

      {extra_holdings.length > 0 && (
        <div className="bet-chips">
          <span className="bet-chips__label">Outside top 10:</span>
          {extra_holdings.map((t) => (
            <span key={t} className="bet-chip bet-chip--extra">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function BETTrackingCard() {
  return (
    <BETErrorBoundary>
      <BETTrackingCardInner />
    </BETErrorBoundary>
  );
}

export default BETTrackingCard;
