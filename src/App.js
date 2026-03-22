import './App.css';
import MyPieChart from './my_components/MyPieChart'
import MyToggleButton from './my_components/MyToggleButton';
import React, { useEffect, useState } from "react";
import TextPicker from './my_components/TextPicker';
import SecurityMetrics from './my_components/SecurityMetrics';
import MyLineChart from './my_components/MyLineChart';
import MyTable from './my_components/MyTable';
import MyDiscreteSlider from './my_components/MyDiscreteSlider';
import TransactionForm from './my_components/TransactionForm';
import DividendForm from './my_components/DividendForm';

import { API_BASE_URL } from './my_components/constants.tsx';
import MyPortfolioTable from './my_components/MyPortfolioTable.js';
import BenchmarkChart from './my_components/BenchmarkChart';
import AnalyticsPanel from './my_components/AnalyticsPanel';

const INITIAL_STEP = 90;

const TIME_PERIODS = [
  { value: '', label: 'All' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '1Q', label: '1Q' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
  { value: 'YTD', label: 'YTD' },
  { value: '3Y', label: '3Y' },
  { value: '5Y', label: '5Y' },
];

function App() {

  const [isAbsolute, setIsAbsolute] = useState(false);
  const [data, setData] = useState([]);
  const [lineData, setLineData] = useState({
    'date' : [],
    'profit' : []
  });
  const [isLineLoading, setIsLineLoading] = useState(false);
  const [perfError, setPerfError] = useState(null);
  const [compError, setCompError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const options = [
    { value: 'TICKER', label: 'TICKER' },
    { value: 'COUNTRY', label: 'COUNTRY' },
    { value: 'SECTOR', label: 'SECTOR' }
  ]
  const [selectedOption, setSelectedOption] = useState('TICKER');

  const [focusedTicker, setFocusedTicker] = useState('ALL');

  const [step, setStep] = React.useState(INITIAL_STEP);

  useEffect(() => {
    setIsLineLoading(true);
    setPerfError(null);

    const params = { step, kind: isAbsolute ? 'Absolute' : 'Percentage' };
    if (focusedTicker !== 'ALL') {
      params.filter_kind = selectedOption;
      params.filters = focusedTicker;
    }
    if (selectedPeriod) {
      params.default_interval = selectedPeriod;
    }
    const searchParams = new URLSearchParams(params);

    fetch(`${API_BASE_URL}/performance?` + searchParams)
      .then((response) => {
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        return response.json();
      })
      .then((res_val) => {
        const dateSeries = Object.values(res_val.date);
        const profitSeries = Object.values(res_val.profit);
        setLineData({ 'date' : dateSeries, 'profit' : profitSeries });
      })
      .catch((error) => {
        console.error('Performance fetch error:', error);
        setPerfError('Failed to load performance data');
      })
      .finally(() => {
        setIsLineLoading(false);
      });
  }, [focusedTicker, isAbsolute, step, selectedOption, selectedPeriod]);

  useEffect(() => {
    setCompError(null);
    fetch(`${API_BASE_URL}/composition?hue=${selectedOption}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        return response.json();
      })
      .then((json) => {
        const mappedData = Object.keys(json.LABEL).map((key) => ({
          name: json.LABEL[key],
          value: json.VALUE[key]
        }));
        setData(mappedData);
      })
      .catch((error) => {
        console.error('Composition fetch error:', error);
        setCompError('Failed to load composition data');
      });
  }, [selectedOption]);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Stock Manager</h1>
        <p className="app__subtitle">Portfolio insights and performance at a glance</p>
      </header>

      <main className="app__content">
        <section className="card">
          <div className="card__title-row">
            <h2 className="card__title">Portfolio Composition</h2>
            <div className="control-row">
              <p className="control-row__label">Group By</p>
              <TextPicker
                options={options}
                cb={setSelectedOption}
                className="text-picker"
              />
            </div>
          </div>
          {compError ? (
            <div className="error-banner">{compError}</div>
          ) : (
            <MyPieChart height={"250px"} data={data} cb={setFocusedTicker} />
          )}
        </section>

        <section className="card">
          <h2 className="card__title">Performance</h2>
          <div className="perf-controls">
            <div className="perf-control-group">
              <span className="perf-control-group__label">Period</span>
              <div className="period-selector">
                {TIME_PERIODS.map((p) => (
                  <button
                    key={p.value}
                    className={`period-btn${selectedPeriod === p.value ? ' period-btn--active' : ''}`}
                    onClick={() => setSelectedPeriod(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="perf-control-group">
              <span className="perf-control-group__label">Values</span>
              <MyToggleButton cb={setIsAbsolute} value={isAbsolute} />
            </div>
            <div className="perf-control-group">
              <span className="perf-control-group__label">Interval</span>
              <MyDiscreteSlider onChangeStep={setStep} initialValue={INITIAL_STEP} />
            </div>
          </div>
          <div className="chart-area">
            {perfError ? (
              <div className="error-banner">{perfError}</div>
            ) : (
              <MyLineChart
                profit={lineData.profit}
                date={lineData.date}
                option={focusedTicker}
                loading={isLineLoading}
                isAbsolute={isAbsolute}
              />
            )}
          </div>
        </section>

        <section className="card card--split">
          <div className="card__pane">
            <h2 className="card__title">Security Metrics</h2>
            <SecurityMetrics
              focusedTicker={focusedTicker}
              selectedOption={selectedOption}
              selectedPeriod={selectedPeriod}
            />
          </div>
          <div className="card__pane">
            <h2 className="card__title">Transaction History</h2>
            <MyTable ticker={focusedTicker} selectedOption={selectedOption} />
          </div>
        </section>

        <section className="card">
          <h2 className="card__title">Portfolio Table</h2>
          <MyPortfolioTable />
        </section>

        <section className="card">
          <h2 className="card__title">Benchmark Comparison</h2>
          <BenchmarkChart selectedPeriod={selectedPeriod} />
        </section>

        <section className="card">
          <h2 className="card__title">Portfolio Analytics</h2>
          <AnalyticsPanel selectedPeriod={selectedPeriod} />
        </section>

        <section className="card">
          <h2 className="card__title">Record Activity</h2>
          <div className="entry-forms">
            <TransactionForm />
            <DividendForm />
          </div>
        </section>
      </main>
    </div>
  );
}


export default App;
