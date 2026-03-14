import React from 'react';
import { useEffect, useState } from "react";

import { API_BASE_URL } from './constants.tsx';

function SecurityMetrics(props) {
  const { focusedTicker, selectedOption } = props;

  const [p_e, setPe] = useState(0.5);
  const [total_div_amt, setTotalDivAmt] = useState(0);
  const [total_cost_basis_amt, setTotalCostBasisAmt] = useState(0);
  const [total_security_equity_gain_amt, setTotalSecurityEquityGainAmt] = useState(0);
  const [total_security_equity_amt, setTotalSecurityEquityAmt] = useState(0);
  const [annualized_profit_perc, setAnnualizedProfitPerc] = useState(5);
  const [div_yield, setDivYield] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchAll() {
      try {
        const mkUrl = (metric, extra = {}) =>
          `${API_BASE_URL}/metric?` + new URLSearchParams({
            ticker: focusedTicker,
            filter_kind: selectedOption,
            metric,
            ...extra
          });

        const [peRes, divRes, yieldRes, costRes, navRes, yoyRes] = await Promise.all([
          (selectedOption === 'TICKER' && focusedTicker !== 'ALL')
            ? fetch(mkUrl('PE')).then(r => r.json())
            : Promise.resolve({ val: 'N/A' }),
          fetch(mkUrl('div_val')).then(r => r.json()),
          fetch(mkUrl('div_yield', { period: '1Y' })).then(r => r.json()),
          fetch(mkUrl('cost_basis')).then(r => r.json()),
          fetch(mkUrl('nav')).then(r => r.json()),
          fetch(mkUrl('annualized_profit_perc_period')).then(r => r.json()),
        ]);

        if (cancelled) return;

        setPe(peRes.val);
        setTotalDivAmt(peRes.val === 'N/A' ? divRes.val : divRes.val);
        setTotalDivAmt(divRes.val);
        setDivYield(yieldRes.val);
        setTotalCostBasisAmt(costRes.val);
        setTotalSecurityEquityAmt(navRes.val);
        setAnnualizedProfitPerc(yoyRes.val);
      } catch (e) {
        if (!cancelled) setError('Failed to load metrics');
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [focusedTicker, selectedOption]);

  useEffect(() => {
    const val = total_security_equity_amt - total_cost_basis_amt;
    setTotalSecurityEquityGainAmt(val);
  }, [total_security_equity_amt, total_cost_basis_amt]);

  const safeFixed = (v, d = 0) => {
    const n = Number(v);
    return isNaN(n) ? 'N/A' : n.toFixed(d);
  };

  const metricsList = [
    { metric_name: 'P/E', metric_val: p_e },
    { metric_name: 'Cost Basis Amount', metric_val: safeFixed(total_cost_basis_amt) },
    { metric_name: 'Equity Amount', metric_val: safeFixed(total_security_equity_amt) },
    { metric_name: 'Dividend Amount', metric_val: safeFixed(total_div_amt) },
    { metric_name: 'Equity Gain Amount', metric_val: safeFixed(total_security_equity_gain_amt) },
    { metric_name: 'Total Gain Amount', metric_val: safeFixed(total_security_equity_gain_amt + total_div_amt) },
    { metric_name: 'YoY Percent Return', metric_val: `${annualized_profit_perc}%` },
    { metric_name: 'Dividend Yield', metric_val: `${div_yield}%` },
  ];

  return (
    <div className="metrics">
      <div className="metrics__header">
        <div>
          <p className="metrics__eyebrow">Focused Ticker</p>
          <h3 className="metrics__title">{focusedTicker}</h3>
        </div>
        <div className="metrics__badge">{loading ? 'Loading...' : 'Snapshot'}</div>
      </div>
      {error ? (
        <div className="error-banner">{error}</div>
      ) : (
        <div className="metrics__grid">
          {metricsList.map((metric) => (
            <div key={metric.metric_name} className="metrics__item">
              <span className="metrics__label">{metric.metric_name}</span>
              <span className="metrics__value">{metric.metric_val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SecurityMetrics;
