import React from 'react';
import { useEffect, useState } from "react";

import { SERVER_ADDRESS } from './constants.tsx';

const SERVER_PORT = '5000'
const SERVER_URL = `http://${SERVER_ADDRESS}:${SERVER_PORT}/`

function SecurityMetrics(props) {
  // get the focused ticker and metrics list from props
  const { focusedTicker, selectedOption } = props;


  const [p_e, setPe] = useState(0.5);
  const [total_div_amt, setTotalDivAmt] = useState(0);
  const [total_cost_basis_amt, setTotalCostBasisAmt] = useState(0);
  const [total_security_equity_gain_amt, setTotalSecurityEquityGainAmt] = useState(0);
  const [total_security_equity_amt, setTotalSecurityEquityAmt] = useState(0);
  const [annualized_profit_perc, setAnnualizedProfitPerc] = useState(5);
  const [div_yield, setDivYield] = useState(0);

  useEffect(() => {
    async function fetch_PE() {

      if (selectedOption !== 'TICKER' || focusedTicker === 'ALL') {
        setPe('N/A')
        return;
      }

      var response = await fetch(`${SERVER_URL}metric?`+ new URLSearchParams({
        ticker: focusedTicker,
        metric: 'PE'
      }));
      var actualData = await response.json();
      var p_e_val = actualData['val']
    
  
      setPe(p_e_val)
    }

    fetch_PE();

  }, [focusedTicker])

  useEffect(() => {
    async function fetch_total_div_amt() {
      var response = await fetch(`${SERVER_URL}metric?`+ new URLSearchParams({
        ticker: focusedTicker,
        filter_kind: selectedOption,
        metric: 'div_val'
      }));
      var actualData = await response.json();
      var total_div_amt = actualData['val']
    
  
      setTotalDivAmt(total_div_amt)
    }

    fetch_total_div_amt();

  }, [focusedTicker])

  useEffect(() => {
    async function fetch_div_yield() {
      var response = await fetch(`${SERVER_URL}metric?`+ new URLSearchParams({
        ticker: focusedTicker,
        filter_kind: selectedOption,
        period: '1Y',
        metric: 'div_yield'
      }));
      var actualData = await response.json();
      var div_yield = actualData['val']
    
  
      setDivYield(div_yield);
    }

    fetch_div_yield();

  }, [focusedTicker])

  useEffect(() => {

    fetch(`${SERVER_URL}metric?` + new URLSearchParams({
      ticker: focusedTicker,
      filter_kind: selectedOption,
      metric: 'cost_basis'
    }))
    .then(response => response.json())
    .then(data => {
      const totalDivAmt = data['val'];
      setTotalCostBasisAmt(totalDivAmt);
    })
    .catch(error => console.error(error));

  }, [focusedTicker])

  useEffect(() => {

    const val = total_security_equity_amt - total_cost_basis_amt;
    setTotalSecurityEquityGainAmt(val);

  }, [total_security_equity_amt, total_cost_basis_amt])

  useEffect(() => {
    async function fetch_total_security_equity_amt() {

      var response = await fetch(`${SERVER_URL}metric?`+ new URLSearchParams({
        ticker: focusedTicker,
        filter_kind: selectedOption,
        metric: 'nav'
      }));
      var actualData = await response.json();
      var res = actualData['val']
    
  
      setTotalSecurityEquityAmt(res)
    }

    fetch_total_security_equity_amt();

  }, [focusedTicker])

  useEffect(() => {
    async function fetch_yoy_perc_return() {

      var response = await fetch(`${SERVER_URL}metric?`+ new URLSearchParams({
        ticker: focusedTicker,
        filter_kind: selectedOption,
        metric: 'annualized_profit_perc_period'
      }));
      var actualData = await response.json();
      var res = actualData['val']
    

      setAnnualizedProfitPerc(res)
    }

    fetch_yoy_perc_return();

  }, [focusedTicker])

  const metricsList = [{
    'metric_name' : 'P/E',
    'metric_val' : p_e
  },
  {
    'metric_name' : 'Cost Basis Amount',
    'metric_val' : total_cost_basis_amt.toFixed(0)
  },
  {
    'metric_name' : 'Equity Amount',
    'metric_val' : total_security_equity_amt.toFixed(0)
  },   
  {
    'metric_name' : 'Dividend Amount',
    'metric_val' : total_div_amt.toFixed(0)
  },
  {
    'metric_name' : 'Equity Gain Amount',
    'metric_val' : total_security_equity_gain_amt.toFixed(0)
  },
  {
    'metric_name' : 'Total Gain Amount',
    'metric_val' : (total_security_equity_gain_amt + total_div_amt).toFixed(0)
  },    
  {
    'metric_name' : 'YoY Percent Return',
    'metric_val' : `${annualized_profit_perc}%`
  },
  {
    'metric_name' : 'Dividend Yield',
    'metric_val' : `${div_yield}%`
  }
  ];


  // define a function to render each metric
  // return the JSX for the component
  return (
    <div className="metrics">
      <div className="metrics__header">
        <div>
          <p className="metrics__eyebrow">Focused Ticker</p>
          <h3 className="metrics__title">{focusedTicker}</h3>
        </div>
        <div className="metrics__badge">Snapshot</div>
      </div>
      <div className="metrics__grid">
        {metricsList.map((metric) => (
          <div key={metric.metric_name} className="metrics__item">
            <span className="metrics__label">{metric.metric_name}</span>
            <span className="metrics__value">{metric.metric_val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SecurityMetrics;
