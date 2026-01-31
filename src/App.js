import './App.css';
import MyPieChart from './my_components/MyPieChart'
import MyToggleButton from './my_components/MyToggleButton';
import React, { useEffect, useState } from "react";
import TextPicker from './my_components/TextPicker';
import MyBottomDrawer from './my_components/MyBottomDrawer';
import SecurityMetrics from './my_components/SecurityMetrics';
import MyLineChart from './my_components/MyLineChart';
import MyTable from './my_components/MyTable';
import MyDiscreteSlider from './my_components/MyDiscreteSlider';

import { SERVER_ADDRESS } from './my_components/constants.tsx';
import MyPortfolioTable from './my_components/MyPortfolioTable.js';

const SERVER_PORT = '5000'
const STEP = 90
const SERVER_URL = `http://${SERVER_ADDRESS}:${SERVER_PORT}/`
const INITIAL_STEP = 90

function App() {

  const [isAbsolute, setIsAbsolute] = useState(false);
  const [data, setData] = useState([]);
  const [lineData, setLineData] = useState({
    'date' : ['2023-may-15'],
    'profit' : [1241]
  });
  const [isLineLoading, setIsLineLoading] = useState(false);
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

    var searchParams = new URLSearchParams({
      filter_kind: selectedOption,
      filters: focusedTicker,
      step: step,
      kind: isAbsolute ? 'Absolute' : 'Percentage'
    });

    if (focusedTicker === 'ALL') {
      searchParams = new URLSearchParams({
        step: step,
        kind: isAbsolute ? 'Absolute' : 'Percentage'
      });
    }

    fetch(`http://${SERVER_ADDRESS}:${SERVER_PORT}/performance?` + searchParams)
      .then((response) => response.json())
      .then((res_val) => {

        const dateSeries = Object.values(res_val.date);
        const profitSeries = Object.values(res_val.profit);
        const colorSeries = profitSeries.map((value) => {
          // If the value is positive, set the color to green; if negative, set it to red; otherwise, set it to black (or any other color of your choice)
          return value > 0 ? 'green' : value < 0 ? 'red' : 'black';
        });
        
        setLineData({
          'date' : dateSeries,
          'profit' : profitSeries 
        });
      })
      .finally(() => {
        setIsLineLoading(false);
      })
      .catch((error) => {
        // Handle any errors here
        console.log(error);
      });
  }, [focusedTicker, isAbsolute, step]);

    // Fetch the data from the API when the component mounts
  useEffect(() => {
    fetch(`http://${SERVER_ADDRESS}:${SERVER_PORT}/composition?hue=${selectedOption}`)
      .then((response) => response.json())
      .then((json) => {
        // Map the json to the format that Recharts expects
        console.log(json);
        const mappedData = Object.keys(json.LABEL).map((key) => ({
          name: json.LABEL[key],
          value: json.VALUE[key]
        }));
        // Set the state variable with the mapped data
        setData(mappedData);
      })
      .catch((error) => {
        // Handle any errors here
        console.log(error);
      });
  }, [selectedOption]);

  const controls = (
    <div>
      <h2 className="card__title">Controls</h2>
      <div className="control-row">
        <p className="control-row__label">Display Kind</p>
        <TextPicker
          style={{ width: "100%" }}
          options={options}
          cb={setSelectedOption}
          className="text-picker"
        />
      </div>
      <div className="control-row">
        <p className="control-row__label">Performance Chart Toggle</p>
        <div className="control-row__control">
          <MyToggleButton cb={setIsAbsolute} />
        </div>
      </div>
      <div className="control-row">
        <p className="control-row__label">Performance Chart Step</p>
        <div className="control-row__control control-row__control--wide">
          <MyDiscreteSlider onChangeStep={setStep} initialValue={INITIAL_STEP} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1 className="app__title">Stock Manager</h1>
          <p className="app__subtitle">Portfolio insights and performance at a glance</p>
        </div>
        <div className="app__drawer">
          <MyBottomDrawer controls={controls} />
        </div>
      </header>

      <main className="app__content">
        <section className="card">
          <h2 className="card__title">Portfolio Composition</h2>
          <MyPieChart height={"250px"} data={data} cb={setFocusedTicker} />
        </section>

        <section className="card">
          <h2 className="card__title">Performance</h2>
          <div className="chart-area">
            <MyLineChart
              profit={lineData.profit}
              date={lineData.date}
              option={focusedTicker}
              loading={isLineLoading}
            />
          </div>
        </section>

        <section className="card card--split">
          <div className="card__pane">
            <h2 className="card__title">Security Metrics</h2>
            <SecurityMetrics focusedTicker={focusedTicker} selectedOption={selectedOption} />
          </div>
          <div className="card__pane">
            <h2 className="card__title">Holdings Detail</h2>
            <MyTable ticker={focusedTicker} selectedOption={selectedOption} />
          </div>
        </section>

        <section className="card">
          <h2 className="card__title">Portfolio Table</h2>
          <MyPortfolioTable />
        </section>
      </main>
    </div>
  );
}


export default App;