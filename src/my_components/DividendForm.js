import React, { useState } from 'react';
import { API_BASE_URL } from './constants.tsx';
import './FormStyles.css';

const DividendForm = () => {
  const [ticker, setTicker] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [fxForm, setFxForm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  const dataPost = () => {
    const data = { ticker, date, amount, fx: fxForm };
    setSubmitting(true);
    setSubmitMsg(null);
    fetch(`${API_BASE_URL}/new_dividend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to submit');
        setSubmitMsg('Dividend added successfully');
        setTicker(''); setAmount(''); setDate(''); setFxForm('');
      })
      .catch(() => setSubmitMsg('Error submitting dividend'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="form-card">
      <p className="form-title">New Dividend</p>

      {submitMsg && (
        <div className={`form-msg ${submitMsg.includes('Error') ? 'form-msg--error' : 'form-msg--success'}`}>
          {submitMsg}
        </div>
      )}

      <div className="form-row">
        <label className="form-label">Ticker</label>
        <input className="form-input" placeholder="AAPL" value={ticker} onChange={e => setTicker(e.target.value)} />
      </div>

      <div className="form-row">
        <label className="form-label">Date</label>
        <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className="form-grid-2">
        <div className="form-row">
          <label className="form-label">Amount</label>
          <input className="form-input" type="number" placeholder="5" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="form-row">
          <label className="form-label">FX</label>
          <input className="form-input" type="number" placeholder="1" value={fxForm} onChange={e => setFxForm(e.target.value)} />
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

export default DividendForm;
