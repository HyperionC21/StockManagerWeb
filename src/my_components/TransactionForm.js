import React, { useState } from 'react';
import { SERVER_ADDRESS } from './constants.tsx';

const SERVER_PORT = '5001'
const SERVER_URL = `http://${SERVER_ADDRESS}:${SERVER_PORT}/`

const TransactionForm = () => {
  const [tickerForm, setTickerForm] = useState('');
  const [dateForm, setDateForm] = useState('');
  const [amountForm, setAmountForm] = useState('');
  const [priceForm, setPriceForm] = useState('');
  const [feeForm, setFeeForm] = useState('');
  const [fxForm, setFxForm] = useState('');
  const [kindForm, setKindForm] = useState('BUY');

  const dataPost = () => {
      const data = {
          ticker: tickerForm,
          date: dateForm,
          amount: amountForm,
          kind: kindForm,
          fx: fxForm,
          fee: feeForm,
          price: priceForm
      }

      fetch(`${SERVER_URL}new_transaction`, {
          method: "POST",
          headers: {'Content-Type': 'application/json'}, 
          body: JSON.stringify(data)
        })
      
      setTickerForm('');
      setAmountForm(0);
      setDateForm('');
      setPriceForm(0);
      setFeeForm(0);
      setFxForm(1);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center" }}>
    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "center" }}>
      <p style={{ textAlign: "left", width:"25%", margin: 10 }}>{'TICKER:'}</p>
      <input
        type="text"
        value={tickerForm}
        onChange={(e) => setTickerForm(e.target.value)}
        placeholder="AAPL"
        style={{ textAlign: "right", justifyContent: "flex-end", margin: 10 }}
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "center" }}>
      <p style={{ textAlign: "left", width:"25%", margin: 10 }}>{'DATE:'}</p>
      <input
        type="text"
        value={dateForm}
        onChange={(e) => setDateForm(e.target.value)}
        placeholder="2022-01-01"
        style={{ textAlign: "right", justifyContent: "flex-end", margin: 10 }}
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "center" }}>
      <p style={{ textAlign: "left", width:"25%", margin: 10 }}>{'AMOUNT:'}</p>
      <input
        type="text"
        value={amountForm}
        onChange={(e) => setAmountForm(e.target.value)}
        placeholder="5"
        style={{ textAlign: "right", justifyContent: "flex-end", margin: 10 }}
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "center" }}>
      <p style={{ textAlign: "left", width:"25%", margin: 10 }}>{'PRICE:'}</p>
      <input
        type="text"
        value={priceForm}
        onChange={(e) => setPriceForm(e.target.value)}
        placeholder="225.6"
        style={{ textAlign: "right", justifyContent: "flex-end", margin: 10 }}
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "center" }}>
      <p style={{ textAlign: "left", width:"25%", margin: 10 }}>{'FEE:'}</p>
      <input
        type="text"
        value={feeForm}
        onChange={(e) => setFeeForm(e.target.value)}
        placeholder="0"
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
    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "center", marginLeft: -30 }}>
      <p style={{ textAlign: "left", width:"25%", margin: 10 }}>{'KIND:'}</p>
      <select
        value={kindForm}
        onChange={(e) => setKindForm(e.target.value)}
        style={{ textAlignLast:"right", justifyContent:"flex-end", width: "25%", margin: 10 }}
      >
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>
    </div>
    <div style={{ display:'flex', justifyContent:'center' }}>
        <button onClick={dataPost}>Submit</button>
    </div>
  </div>
  );
};

export default TransactionForm;
