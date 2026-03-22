import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { API_BASE_URL } from './constants.tsx';

const BENCHMARKS = [
  { value: 'SPY', label: 'S&P 500' },
  { value: 'QQQ', label: 'NASDAQ 100' },
  { value: 'IWM', label: 'Russell 2000' },
  { value: 'EFA', label: 'MSCI EAFE' },
  { value: 'GLD', label: 'Gold' },
  { value: 'AGG', label: 'Bonds' },
];

const BENCHMARK_COLORS = ['#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4'];

function BenchmarkChart({ selectedPeriod }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setResults([]);

    const fetchOne = (ticker) => {
      const params = new URLSearchParams({ benchmark: ticker, step: 7 });
      if (selectedPeriod) params.set('default_interval', selectedPeriod);
      return fetch(`${API_BASE_URL}/benchmark?` + params)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((json) => (json.error ? null : { ticker, ...json }))
        .catch(() => null);
    };

    Promise.all(BENCHMARKS.map((b) => fetchOne(b.value))).then((all) => {
      if (cancelled) return;
      const valid = all.filter(Boolean);
      if (valid.length === 0) {
        setError('Failed to load benchmark data');
      } else {
        setResults(valid);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [selectedPeriod]);

  const first = results[0];
  const dates = first ? first.dates : [];
  const portfolioReturn = first ? first.portfolio_return : [];
  const portfolioTotal = first ? first.portfolio_total_return : null;

  const series = results.length
    ? [
        { name: 'Portfolio', data: portfolioReturn },
        ...results.map((r, i) => ({
          name: BENCHMARKS.find((b) => b.value === r.ticker)?.label ?? r.ticker,
          data: r.benchmark_return,
        })),
      ]
    : [];

  const options = {
    chart: {
      id: 'benchmark-chart',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ['#4f46e5', ...BENCHMARK_COLORS],
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    legend: { position: 'top' },
    xaxis: {
      categories: dates,
      tickAmount: 10,
      labels: { rotate: -45 },
    },
    yaxis: {
      labels: { formatter: (v) => v?.toFixed(1) + '%' },
    },
    tooltip: {
      y: { formatter: (v) => v?.toFixed(2) + '%' },
    },
  };

  return (
    <div>
      {error ? (
        <div className="error-banner">{error}</div>
      ) : (
        <>
          {results.length > 0 && (
            <div className="benchmark-summary">
              <div className="benchmark-stat">
                <span className="benchmark-stat__label">Portfolio</span>
                <span className={`benchmark-stat__val ${portfolioTotal >= 0 ? 'metrics__value--positive' : 'metrics__value--negative'}`}>
                  {portfolioTotal >= 0 ? '+' : ''}{portfolioTotal?.toFixed(2)}%
                </span>
              </div>
              {results.map((r, i) => {
                const outperf = r.portfolio_total_return - r.benchmark_total_return;
                return (
                  <div key={r.ticker} className="benchmark-stat">
                    <span className="benchmark-stat__label" style={{ color: BENCHMARK_COLORS[i] }}>
                      {BENCHMARKS.find((b) => b.value === r.ticker)?.label ?? r.ticker}
                    </span>
                    <span className={`benchmark-stat__val ${r.benchmark_total_return >= 0 ? 'metrics__value--positive' : 'metrics__value--negative'}`}>
                      {r.benchmark_total_return >= 0 ? '+' : ''}{r.benchmark_total_return?.toFixed(2)}%
                    </span>
                    <span className={`benchmark-stat__sub ${outperf >= 0 ? 'metrics__value--positive' : 'metrics__value--negative'}`}>
                      {outperf >= 0 ? '+' : ''}{outperf.toFixed(2)}% vs portfolio
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="performance-chart" style={{ position: 'relative' }}>
            <Chart options={options} series={series} type="line" height={350} width="100%" />
            {loading && (
              <div className="chart-loading">
                <div className="chart-loading__spinner" />
                Loading benchmarks...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default BenchmarkChart;
