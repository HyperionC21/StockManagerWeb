import React, { useState } from 'react';
import { API_BASE_URL } from './constants.tsx';

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
    const data = {
      ticker: tickerForm,
      date: dateForm,
      amount: amountForm,
      kind: kindForm,
      fx: fxForm,
      fee: feeForm,
      price: priceForm
    };

    setSubmitting(true);
    setSubmitMsg(null);

    fetch(`${API_BASE_URL}/new_transaction`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to submit');
        setSubmitMsg('Transaction added successfully');
        setTickerForm('');
        setAmountForm('');
        setDateForm('');
        setPriceForm('');
        setFeeForm('');
        setFxForm('');
      })
      .catch(() => {
        setSubmitMsg('Error submitting transaction');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const isError = submitMsg && submitMsg.includes('Error');

  return (
    <div className="entry-form">
      <h3 className="entry-form__title">New Transaction</h3>
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
            value={tickerForm}
            onChange={(e) => setTickerForm(e.target.value)}
            placeholder="AAPL"
          />
        </div>
        <div className="entry-form__field entry-form__field--full">
          <label className="entry-form__label">Date</label>
          <input
            className="entry-form__input"
            type="date"
            value={dateForm}
            onChange={(e) => setDateForm(e.target.value)}
          />
        </div>
        <div className="entry-form__field">
          <label className="entry-form__label">Amount</label>
          <input
            className="entry-form__input"
            type="number"
            value={amountForm}
            onChange={(e) => setAmountForm(e.target.value)}
            placeholder="5"
          />
        </div>
        <div className="entry-form__field">
          <label className="entry-form__label">Price</label>
          <input
            className="entry-form__input"
            type="number"
            value={priceForm}
            onChange={(e) => setPriceForm(e.target.value)}
            placeholder="225.6"
          />
        </div>
        <div className="entry-form__field">
          <label className="entry-form__label">Fee</label>
          <input
            className="entry-form__input"
            type="number"
            value={feeForm}
            onChange={(e) => setFeeForm(e.target.value)}
            placeholder="0"
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
        <div className="entry-form__field entry-form__field--full">
          <label className="entry-form__label">Kind</label>
          <select
            className="entry-form__select"
            value={kindForm}
            onChange={(e) => setKindForm(e.target.value)}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
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

export default TransactionForm;
