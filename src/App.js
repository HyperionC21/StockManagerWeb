import logo from './logo.svg';
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

const SERVER_PORT = '5001'
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
  const options = [
    { value: 'TICKER', label: 'TICKER' },
    { value: 'COUNTRY', label: 'COUNTRY' },
    { value: 'SECTOR', label: 'SECTOR' }
  ]
  const [selectedOption, setSelectedOption] = useState('TICKER');

  const [focusedTicker, setFocusedTicker] = useState('ALL');

  const [step, setStep] = React.useState(INITIAL_STEP);



  useEffect(() => {

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

  return (
      
      <div style={{display: "flex", flexDirection: "column", height: "100%", justifyContent: "center"}}>
        <div style= {{ display: "flex", justifyContent: "center" }}>
  <MyBottomDrawer/>
</div>
    <div style={{display: "flex", flexDirection: "row", flex: "2", borderWidth: "5px", justifyContent: "center"}}>
      <div style={{flex: "2", justifyContent: "center", paddingLeft: "10%"}}>
        <MyPieChart height={"250px"} data={data} cb={setFocusedTicker}/>
      </div>
      <div style={{flex: "2", justifyContent: "center", marginTop: "5%"}}>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "center", marginRight: '2%'}}>
            <p style={{flex: "2", width: "50%"}}> Display Kind </p>
            <TextPicker style={{width: "50%", justifyContent: "center", flex: "3"}} options={options} cb={setSelectedOption} className="text-picker"/>
        </div>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "center", marginRight: '2%'}}>
            <p style={{flex: "1", width: "50%"}}> Performance Chart Toggle </p>
            <div style={{marginTop: "2%"}}> 
              <MyToggleButton cb={setIsAbsolute} />
            </div>
        </div>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "center", marginRight: '2%'}}>
            <p style={{flex: "1", width: "50%"}}> Performance Chart Step Slider </p>
            <div style={{marginTop: "2%", width: "50%"}}> 
              <MyDiscreteSlider onChangeStep={setStep} initialValue={INITIAL_STEP} />
            </div>
        </div>
      </div>
  </div>
  <div style= {{ display: "flex", width: "100%", flex: "5", justifyContent: "center", marginTop: "50px", paddingBottom: "100px" }}>
    <MyLineChart profit={lineData.profit} date={lineData.date} option={focusedTicker}/>
  </div>
  <div style={{display: "flex", flexDirection: "row", flex: "2", borderWidth: "5px", justifyContent: "center"}}>
    <div style={{flex: "7", justifyContent: "center", paddingLeft: "10%", marginTop: "-3%"}}>
      <SecurityMetrics focusedTicker={focusedTicker} selectedOption={selectedOption} />
    </div>
    <div style={{flex: "12", width: "500", justifyContent: "center"}}>
      <MyTable ticker={focusedTicker} selectedOption={selectedOption} />
    </div>
  </div>
  <div style={{display: "flex", paddingTop: "30px", flexDirection: "row", flex: "2", borderWidth: "5px", justifyContent: "center"}}>
    <MyPortfolioTable/>
  </div>
</div>


    
  );
}


export default App;