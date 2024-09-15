import React, { useState } from 'react';

import { SERVER_ADDRESS } from './constants.tsx';

const SERVER_PORT = '5001'
const SERVER_URL = `http://${SERVER_ADDRESS}:${SERVER_PORT}/`

const DividendForm = () => {
  const [ticker, setTicker] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [fxForm, setFxForm] = useState('');

  const dataPost = () => {
    const data = {
        ticker: ticker,
        date: date,
        amount: amount,
        fx: fxForm,
    }

    fetch(`${SERVER_URL}new_dividend`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
      })
    
    setTicker('');
    setAmount(0);
    setDate('');
    setFxForm(1);
}


  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center" }}>
    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "center" }}>
      <p style={{ textAlign: "left", width:"25%", margin: 10 }}>{'TICKER:'}</p>
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="AAPL"
        style={{ textAlign: "right", justifyContent: "flex-end", margin: 10 }}
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "center" }}>
      <p style={{ textAlign: "left", width:"25%", margin: 10 }}>{'DATE:'}</p>
      <input
        type="text"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="2022-01-01"
        style={{ textAlign: "right", justifyContent: "flex-end", margin: 10 }}
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "center" }}>
      <p style={{ textAlign: "left", width:"25%", margin: 10 }}>{'AMOUNT:'}</p>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="5"
        style={{ textAlign: "right", justifyContent: "flex-end", margin: 10 }}
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "center" }}>
      <p style={{ textAlign: "left", width:"25%", margin: 10 }}>{'FX:'}</p>
      <input
        type="text"
        value={fxForm}
        onChange={(e) => setFxForm(e.target.value)}
        placeholder="1"
        style={{ textAlign: "right", justifyContent: "flex-end", margin: 10 }}
      />
    </div>
    <div style={{ display:'flex', justifyContent:'center' }}>
        <button onClick={dataPost}>Submit</button>
    </div>
  </div>
  );
};

export default DividendForm;
