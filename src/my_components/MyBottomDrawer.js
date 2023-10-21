import Drawer from '@material-ui/core/Drawer';
import { Tabs, Tab, Box, Button } from '@material-ui/core';
import React from 'react';
import TransactionForm from './TransactionForm';
import DividendForm from './DividendForm';

const MyBottomDrawer = () => {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div style={{ position: 'relative',  }}>
      <Drawer
        anchor="right"
        variant="persistent"
        open={open}
        PaperProps={{ style: { width: "25%", margin: "auto", borderRadius: 50, borderWidth: 10 } }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Transaction Form" />
          <Tab label="Dividend Form" />
        </Tabs>
        <Box hidden={value !== 0}>
          <form>
            <TransactionForm/>
          </form>
        </Box>
        <Box hidden={value !== 1}>
          <form>
            <DividendForm/>
          </form>
        </Box>
        <Button onClick={handleClose}>Close</Button>
      </Drawer>
      {!open && (
        <div style={{ position: 'right', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>
          {/* Add your arrow or any other element here */}
          <Button color="default" onClick={handleOpen}>Open Forms</Button>
        </div>
      )}
    </div>
  );
};

export default MyBottomDrawer;
