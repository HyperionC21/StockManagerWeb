import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { API_BASE_URL } from './constants.tsx';

const VIEW_ANNUAL = 'annual';
const VIEW_TICKER = 'ticker';

function MyDividendChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState(VIEW_ANNUAL);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dividends_analysis`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="div-chart__loading">
        <div className="chart-loading__spinner" />
        Loading dividend data…
      </div>
    );
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  const annual = data?.annual_summary ?? {};
  const years = annual.years ?? [];
  const byTicker = (data?.by_ticker ?? []).filter((t) => t.ticker != null && t.ticker === t.ticker);

  const annualChart = {
    series: [{ name: 'Dividends', data: years.map((y) => y.total_dividends) }],
    options: {
      chart: { id: 'div-annual', toolbar: { show: false }, animations: { speed: 400 } },
      plotOptions: {
        bar: { borderRadius: 6, columnWidth: '50%' },
      },
      colors: ['#6366f1'],
      dataLabels: { enabled: false },
      xaxis: { categories: years.map((y) => y.year), labels: { style: { fontSize: '12px' } } },
      yaxis: {
        labels: {
          formatter: (v) => `${v.toFixed(0)}`,
          style: { fontSize: '12px' },
        },
      },
      tooltip: { y: { formatter: (v) => `${v.toFixed(2)}` } },
      grid: { borderColor: 'rgba(148,163,184,0.15)', strokeDashArray: 4 },
    },
  };

  const tickerChart = {
    series: [{ name: 'Dividends', data: byTicker.map((t) => t.total_dividends) }],
    options: {
      chart: { id: 'div-ticker', toolbar: { show: false }, animations: { speed: 400 } },
      plotOptions: {
        bar: { borderRadius: 5, horizontal: true, barHeight: '60%' },
      },
      colors: ['#6366f1'],
      dataLabels: { enabled: false },
      xaxis: { categories: byTicker.map((t) => t.ticker), labels: { formatter: (v) => Number(v).toFixed(0), style: { fontSize: '12px' } } },
      yaxis: { labels: { style: { fontSize: '12px' } } },
      tooltip: { x: { show: true }, y: { formatter: (v) => `${v.toFixed(2)}` } },
      grid: { borderColor: 'rgba(148,163,184,0.15)', strokeDashArray: 4 },
    },
  };

  const summaryItems = [
    { label: 'Lifetime', value: annual.total_lifetime_dividends != null ? `${annual.total_lifetime_dividends.toFixed(2)}` : 'N/A' },
    { label: 'Avg / Year', value: annual.avg_annual_dividends != null ? `${annual.avg_annual_dividends.toFixed(2)}` : 'N/A' },
    { label: 'Avg YoY Growth', value: annual.avg_yoy_growth_pct != null ? `${annual.avg_yoy_growth_pct.toFixed(1)}%` : 'N/A' },
  ];

  return (
    <div className="div-chart">
      <div className="div-chart__header">
        <div className="div-chart__stats">
          {summaryItems.map((item) => (
            <div key={item.label} className="div-chart__stat">
              <span className="div-chart__stat-label">{item.label}</span>
              <span className="div-chart__stat-value">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="period-selector">
          <button
            className={`period-btn${view === VIEW_ANNUAL ? ' period-btn--active' : ''}`}
            onClick={() => setView(VIEW_ANNUAL)}
          >
            By Year
          </button>
          <button
            className={`period-btn${view === VIEW_TICKER ? ' period-btn--active' : ''}`}
            onClick={() => setView(VIEW_TICKER)}
          >
            By Ticker
          </button>
        </div>
      </div>

      {years.length === 0 && byTicker.length === 0 ? (
        <div className="div-chart__empty">No dividend records found.</div>
      ) : (
        <div className="div-chart__plot">
          {view === VIEW_ANNUAL ? (
            <Chart
              options={annualChart.options}
              series={annualChart.series}
              type="bar"
              height={280}
              width="100%"
            />
          ) : (
            <Chart
              options={tickerChart.options}
              series={tickerChart.series}
              type="bar"
              height={Math.max(200, byTicker.length * 40 + 60)}
              width="100%"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default MyDividendChart;
