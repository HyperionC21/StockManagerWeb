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

function BenchmarkChart() {
  const [selectedBenchmark, setSelectedBenchmark] = useState('SPY');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setChartData(null);

    fetch(`${API_BASE_URL}/benchmark?benchmark=${selectedBenchmark}&step=7`)
      .then((response) => {
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        return response.json();
      })
      .then((json) => {
        if (cancelled) return;
        if (json.error) {
          setError(json.error);
        } else {
          setChartData(json);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Benchmark fetch error:', err);
        setError('Failed to load benchmark data');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedBenchmark]);

  const series = chartData
    ? [
        { name: 'Portfolio', data: chartData.portfolio_return },
        { name: chartData.benchmark_name, data: chartData.benchmark_return },
      ]
    : [];

  const options = {
    chart: {
      id: 'benchmark-chart',
      toolbar: { show: false },
    },
    colors: ['#4f46e5', '#f59e0b'],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'top',
    },
    xaxis: {
      categories: chartData ? chartData.dates : [],
      tickAmount: 10,
      labels: {
        rotate: -45,
      },
    },
    yaxis: {
      labels: {
        formatter: (v) => v?.toFixed(1) + '%',
      },
    },
    tooltip: {
      y: {
        formatter: (v) => v?.toFixed(2) + '%',
      },
    },
  };

  const outperformance = chartData ? chartData.outperformance : null;
  const outperformancePositive = outperformance !== null && outperformance >= 0;

  return (
    <div>
      <div className="period-selector" style={{ paddingBottom: '12px' }}>
        {BENCHMARKS.map((b) => (
          <button
            key={b.value}
            className={`period-btn${selectedBenchmark === b.value ? ' period-btn--active' : ''}`}
            onClick={() => setSelectedBenchmark(b.value)}
          >
            {b.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="error-banner">{error}</div>
      ) : (
        <>
          {chartData && (
            <div className="benchmark-summary">
              <div className="benchmark-stat">
                <span className="benchmark-stat__label">Portfolio</span>
                <span
                  className={`benchmark-stat__val ${
                    chartData.portfolio_total_return >= 0
                      ? 'metrics__value--positive'
                      : 'metrics__value--negative'
                  }`}
                >
                  {chartData.portfolio_total_return >= 0 ? '+' : ''}
                  {chartData.portfolio_total_return?.toFixed(2)}%
                </span>
              </div>
              <div className="benchmark-stat">
                <span className="benchmark-stat__label">{chartData.benchmark_name}</span>
                <span
                  className={`benchmark-stat__val ${
                    chartData.benchmark_total_return >= 0
                      ? 'metrics__value--positive'
                      : 'metrics__value--negative'
                  }`}
                >
                  {chartData.benchmark_total_return >= 0 ? '+' : ''}
                  {chartData.benchmark_total_return?.toFixed(2)}%
                </span>
              </div>
              <div className="benchmark-stat">
                <span className="benchmark-stat__label">Outperformance</span>
                <span
                  className={`benchmark-stat__val ${
                    outperformancePositive
                      ? 'metrics__value--positive'
                      : 'metrics__value--negative'
                  }`}
                >
                  {outperformancePositive ? '+' : ''}
                  {outperformance?.toFixed(2)}%
                </span>
              </div>
            </div>
          )}

          <div className="performance-chart" style={{ position: 'relative' }}>
            <Chart
              options={options}
              series={series}
              type="line"
              height={350}
              width="100%"
            />
            {loading && (
              <div className="chart-loading">
                <div className="chart-loading__spinner" />
                Updating chart...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default BenchmarkChart;
