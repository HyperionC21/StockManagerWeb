import React, { useState } from 'react';
import { API_BASE_URL } from './constants.tsx';
import './FormStyles.css';

const TransactionForm = () => {
  const [tickerForm, setTickerForm] = useState('');
  const [dateForm, setDateForm] = useState('');
  const [amountForm, setAmountForm] = useState('');
  const [priceForm, setPriceForm] = useState('');
  const [feeForm, setFeeForm] = useState('');
  const [fxForm, setFxForm] = useState('');
  const [kindForm, setKindForm] = useState('BUY');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  const dataPost = () => {
    const data = { ticker: tickerForm, date: dateForm, amount: amountForm, kind: kindForm, fx: fxForm, fee: feeForm, price: priceForm };
    setSubmitting(true);
    setSubmitMsg(null);
    fetch(`${API_BASE_URL}/new_transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to submit');
        setSubmitMsg('Transaction added successfully');
        setTickerForm(''); setAmountForm(''); setDateForm(''); setPriceForm(''); setFeeForm(''); setFxForm('');
      })
      .catch(() => setSubmitMsg('Error submitting transaction'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="form-card">
      <p className="form-title">New Transaction</p>

      {submitMsg && (
        <div className={`form-msg ${submitMsg.includes('Error') ? 'form-msg--error' : 'form-msg--success'}`}>
          {submitMsg}
        </div>
      )}

      <div className="form-row">
        <label className="form-label">Ticker</label>
        <input className="form-input" placeholder="AAPL" value={tickerForm} onChange={e => setTickerForm(e.target.value)} />
      </div>

      <div className="form-row">
        <label className="form-label">Date</label>
        <input className="form-input" type="date" value={dateForm} onChange={e => setDateForm(e.target.value)} />
      </div>

      <div className="form-grid-2">
        <div className="form-row">
          <label className="form-label">Amount</label>
          <input className="form-input" type="number" placeholder="5" value={amountForm} onChange={e => setAmountForm(e.target.value)} />
        </div>
        <div className="form-row">
          <label className="form-label">Price</label>
          <input className="form-input" type="number" placeholder="225.6" value={priceForm} onChange={e => setPriceForm(e.target.value)} />
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-row">
          <label className="form-label">Fee</label>
          <input className="form-input" type="number" placeholder="0" value={feeForm} onChange={e => setFeeForm(e.target.value)} />
        </div>
        <div className="form-row">
          <label className="form-label">FX</label>
          <input className="form-input" type="number" placeholder="1" value={fxForm} onChange={e => setFxForm(e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label">Kind</label>
        <div className="form-toggle">
          <button
            className={`form-toggle__btn${kindForm === 'BUY' ? ' form-toggle__btn--active-buy' : ''}`}
            onClick={() => setKindForm('BUY')}
          >
            BUY
          </button>
          <button
            className={`form-toggle__btn${kindForm === 'SELL' ? ' form-toggle__btn--active-sell' : ''}`}
            onClick={() => setKindForm('SELL')}
          >
            SELL
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button className="form-button" onClick={dataPost} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default TransactionForm;
