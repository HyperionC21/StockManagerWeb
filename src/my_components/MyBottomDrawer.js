import Drawer from '@material-ui/core/Drawer';
import { Tabs, Tab, Box, Button } from '@material-ui/core';
import React from 'react';
import TransactionForm from './TransactionForm';
import DividendForm from './DividendForm';
import './MyBottomDrawer.css';

const MyBottomDrawer = ({ controls }) => {
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
    <div className="drawer-host">
      <Drawer
        anchor="right"
        variant="persistent"
        open={open}
        PaperProps={{ className: 'drawer-paper' }}
      >
        <div className="drawer-content">
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Controls" />
            <Tab label="Transaction Form" />
            <Tab label="Dividend Form" />
          </Tabs>
          <Box hidden={value !== 0} p={2}>
            <div className="drawer-controls">
              {controls}
            </div>
          </Box>
          <Box hidden={value !== 1} p={2}>
            <TransactionForm />
          </Box>
          <Box hidden={value !== 2} p={2}>
            <DividendForm />
          </Box>
          <div className="drawer-actions">
            <Button onClick={handleClose}>Close</Button>
          </div>
        </div>
      </Drawer>
      {!open && (
        <div className="drawer-fab">
          {/* Add your arrow or any other element here */}
          <Button color="default" onClick={handleOpen}>Open Forms</Button>
        </div>
      )}
    </div>
  );
};

export default MyBottomDrawer;
