import React, { useState } from 'react';
import { API_BASE_URL } from './constants.tsx';

const DividendForm = () => {
  const [ticker, setTicker] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [fxForm, setFxForm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  const dataPost = () => {
    const data = {
      ticker: ticker,
      date: date,
      amount: amount,
      fx: fxForm,
    };

    setSubmitting(true);
    setSubmitMsg(null);

    fetch(`${API_BASE_URL}/new_dividend`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to submit');
        setSubmitMsg('Dividend added successfully');
        setTicker('');
        setAmount('');
        setDate('');
        setFxForm('');
      })
      .catch(() => {
        setSubmitMsg('Error submitting dividend');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const isError = submitMsg && submitMsg.includes('Error');

  return (
    <div className="entry-form">
      <h3 className="entry-form__title">New Dividend</h3>
      {submitMsg && (
        <p className={`entry-form__msg ${isError ? 'entry-form__msg--error' : 'entry-form__msg--ok'}`}>
          {submitMsg}
        </p>
      )}
      <div className="entry-form__grid">
        <div className="entry-form__field entry-form__field--full">
          <label className="entry-form__label">Ticker</label>
          <input
            className="entry-form__input"
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="AAPL"
          />
        </div>
        <div className="entry-form__field entry-form__field--full">
          <label className="entry-form__label">Date</label>
          <input
            className="entry-form__input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="entry-form__field">
          <label className="entry-form__label">Amount</label>
          <input
            className="entry-form__input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5"
          />
        </div>
        <div className="entry-form__field">
          <label className="entry-form__label">FX</label>
          <input
            className="entry-form__input"
            type="number"
            value={fxForm}
            onChange={(e) => setFxForm(e.target.value)}
            placeholder="1"
          />
        </div>
      </div>
      <div className="entry-form__footer">
        <button
          className="entry-form__submit"
          onClick={dataPost}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default DividendForm;
