import React from 'react';
import { useEffect, useState } from "react";

import { API_BASE_URL } from './constants.tsx';

function SecurityMetrics(props) {
  const { focusedTicker, selectedOption, selectedPeriod } = props;

  const [p_e, setPe] = useState('N/A');
  const [total_div_amt, setTotalDivAmt] = useState(0);
  const [security_div_amt, setSecurityDivAmt] = useState(0);
  const [total_cost_basis_amt, setTotalCostBasisAmt] = useState(0);
  const [total_security_equity_gain_amt, setTotalSecurityEquityGainAmt] = useState(0);
  const [total_security_equity_amt, setTotalSecurityEquityAmt] = useState(0);
  const [annualized_profit_perc, setAnnualizedProfitPerc] = useState(0);
  const [div_yield, setDivYield] = useState(0);
  const [period_profit, setPeriodProfit] = useState(0);
  const [total_fees, setTotalFees] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isSingleTicker = selectedOption === 'TICKER' && focusedTicker !== 'ALL';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const period = selectedPeriod || 'ALL';

    async function fetchAll() {
      try {
        const mkUrl = (metric, extra = {}) =>
          `${API_BASE_URL}/metric?` + new URLSearchParams({
            ticker: focusedTicker,
            filter_kind: selectedOption,
            metric,
            ...extra
          });

        if (isSingleTicker) {
          const [peRes, divRes, secDivRes, yieldRes, costRes, equityAmtRes, equityGainRes, yoyRes, profitRes, feeRes] = await Promise.all([
            fetch(mkUrl('PE')).then(r => r.json()),
            fetch(mkUrl('div_val', { period })).then(r => r.json()),
            fetch(mkUrl('security_div_amt')).then(r => r.json()),
            fetch(mkUrl('div_yield', { period: '1Y' })).then(r => r.json()),
            fetch(mkUrl('cost_basis', { period })).then(r => r.json()),
            fetch(mkUrl('security_equity_amt')).then(r => r.json()),
            fetch(mkUrl('security_equity_gain_amt')).then(r => r.json()),
            fetch(mkUrl('annualized_profit_perc_period', { period })).then(r => r.json()),
            fetch(mkUrl('profit', { period })).then(r => r.json()),
            fetch(mkUrl('fee', { period })).then(r => r.json()),
          ]);

          if (cancelled) return;

          setPe(peRes.val);
          setTotalDivAmt(divRes.val);
          setSecurityDivAmt(secDivRes.val);
          setDivYield(yieldRes.val);
          setTotalCostBasisAmt(costRes.val);
          setTotalSecurityEquityAmt(equityAmtRes.val);
          setTotalSecurityEquityGainAmt(equityGainRes.val);
          setAnnualizedProfitPerc(yoyRes.val);
          setPeriodProfit(profitRes.val);
          setTotalFees(feeRes.val);
        } else {
          const [divRes, yieldRes, costRes, navRes, yoyRes, profitRes, feeRes] = await Promise.all([
            fetch(mkUrl('div_val', { period })).then(r => r.json()),
            fetch(mkUrl('div_yield', { period: '1Y' })).then(r => r.json()),
            fetch(mkUrl('cost_basis', { period })).then(r => r.json()),
            fetch(mkUrl('nav', { period })).then(r => r.json()),
            fetch(mkUrl('annualized_profit_perc_period', { period })).then(r => r.json()),
            fetch(mkUrl('profit', { period })).then(r => r.json()),
            fetch(mkUrl('fee', { period })).then(r => r.json()),
          ]);

          if (cancelled) return;

          setTotalDivAmt(divRes.val);
          setDivYield(yieldRes.val);
          setTotalCostBasisAmt(costRes.val);
          const nav = navRes.val;
          const cost = costRes.val;
          setTotalSecurityEquityAmt(nav);
          setTotalSecurityEquityGainAmt(
            (isNaN(Number(nav)) || isNaN(Number(cost))) ? 0 : Number(nav) - Number(cost)
          );
          setAnnualizedProfitPerc(yoyRes.val);
          setPeriodProfit(profitRes.val);
          setTotalFees(feeRes.val);
        }
      } catch (e) {
        if (!cancelled) setError('Failed to load metrics');
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [focusedTicker, selectedOption, selectedPeriod, isSingleTicker]);

  const safeFixed = (v, d = 0) => {
    const n = Number(v);
    return isNaN(n) ? 'N/A' : n.toFixed(d);
  };

  const colorClass = (v) => {
    const n = Number(v);
    if (isNaN(n)) return '';
    if (n > 0) return 'metrics__value--positive';
    if (n < 0) return 'metrics__value--negative';
    return '';
  };

  const equityGain = total_security_equity_gain_amt;
  const totalGain = (isNaN(Number(equityGain)) || isNaN(Number(total_div_amt)))
    ? 'N/A'
    : Number(equityGain) + Number(total_div_amt);

  const metricsList = [
    { metric_name: 'Cost Basis', metric_val: safeFixed(total_cost_basis_amt), colored: false },
    { metric_name: 'Market Value', metric_val: safeFixed(total_security_equity_amt), colored: false },
    { metric_name: 'Equity Gain', metric_val: safeFixed(equityGain), colored: true, raw: equityGain },
    { metric_name: 'Period Profit', metric_val: safeFixed(period_profit), colored: true, raw: period_profit },
    {
      metric_name: 'Total Gain',
      metric_val: totalGain === 'N/A' ? 'N/A' : safeFixed(totalGain),
      colored: true,
      raw: totalGain
    },
    { metric_name: 'Dividends Received', metric_val: safeFixed(total_div_amt), colored: false },
    ...(isSingleTicker ? [{ metric_name: 'Lifetime Dividends', metric_val: safeFixed(security_div_amt), colored: false }] : []),
    { metric_name: 'Annualized Return', metric_val: `${annualized_profit_perc}%`, colored: true, raw: annualized_profit_perc },
    { metric_name: 'Dividend Yield', metric_val: `${div_yield}%`, colored: false },
    { metric_name: 'Total Fees', metric_val: safeFixed(total_fees), colored: false },
    ...(isSingleTicker && p_e !== 'N/A' ? [{ metric_name: 'P/E Ratio', metric_val: p_e, colored: false }] : []),
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
              <span className={`metrics__value${metric.colored ? ` ${colorClass(metric.raw)}` : ''}`}>
                {metric.metric_val}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SecurityMetrics;
