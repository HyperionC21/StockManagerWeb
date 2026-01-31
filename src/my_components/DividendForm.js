import React, { useState } from 'react';
import { Box, Button, Grid, TextField } from '@material-ui/core';
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

  return (
    <Box display="flex" flexDirection="column" gridGap={16}>
      <Box fontSize={18} fontWeight={600}>New Dividend</Box>
      {submitMsg && (
        <Box fontSize={13} color={submitMsg.includes('Error') ? '#dc2626' : '#16a34a'}>
          {submitMsg}
        </Box>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Ticker" variant="outlined" fullWidth value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="AAPL" />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Date" type="date" variant="outlined" fullWidth value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Amount" type="number" variant="outlined" fullWidth value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="FX" type="number" variant="outlined" fullWidth value={fxForm} onChange={(e) => setFxForm(e.target.value)} placeholder="1" />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={dataPost} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Box>
  );
};

export default DividendForm;
