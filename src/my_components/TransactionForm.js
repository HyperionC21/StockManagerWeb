import React, { useState } from 'react';
import { Box, Button, Grid, MenuItem, TextField } from '@material-ui/core';
import { SERVER_ADDRESS } from './constants.tsx';

const SERVER_PORT = '5000'
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
    <Box display="flex" flexDirection="column" gridGap={16}>
      <Box fontSize={18} fontWeight={600}>New Transaction</Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Ticker"
            variant="outlined"
            fullWidth
            value={tickerForm}
            onChange={(e) => setTickerForm(e.target.value)}
            placeholder="AAPL"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            value={dateForm}
            onChange={(e) => setDateForm(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Amount"
            type="number"
            variant="outlined"
            fullWidth
            value={amountForm}
            onChange={(e) => setAmountForm(e.target.value)}
            placeholder="5"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Price"
            type="number"
            variant="outlined"
            fullWidth
            value={priceForm}
            onChange={(e) => setPriceForm(e.target.value)}
            placeholder="225.6"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fee"
            type="number"
            variant="outlined"
            fullWidth
            value={feeForm}
            onChange={(e) => setFeeForm(e.target.value)}
            placeholder="0"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="FX"
            type="number"
            variant="outlined"
            fullWidth
            value={fxForm}
            onChange={(e) => setFxForm(e.target.value)}
            placeholder="1"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Kind"
            select
            variant="outlined"
            fullWidth
            value={kindForm}
            onChange={(e) => setKindForm(e.target.value)}
          >
            <MenuItem value="BUY">BUY</MenuItem>
            <MenuItem value="SELL">SELL</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={dataPost}>Submit</Button>
      </Box>
    </Box>
  );
};

export default TransactionForm;
