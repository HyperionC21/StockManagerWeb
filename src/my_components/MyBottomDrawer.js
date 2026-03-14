import Drawer from '@material-ui/core/Drawer';
import { Tabs, Tab } from '@material-ui/core';
import React from 'react';
import TransactionForm from './TransactionForm';
import DividendForm from './DividendForm';
import './MyBottomDrawer.css';

const MyBottomDrawer = ({ controls }) => {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(true);

  return (
    <div className="drawer-host">
      <Drawer
        anchor="right"
        variant="persistent"
        open={open}
        PaperProps={{ className: 'drawer-paper' }}
      >
        <div className="drawer-header">
          <span className="drawer-header__title">Portfolio Manager</span>
          <button className="drawer-close-btn" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        </div>

        <Tabs value={value} onChange={(_, v) => setValue(v)} className="drawer-tabs">
          <Tab label="Controls" />
          <Tab label="Transaction" />
          <Tab label="Dividend" />
        </Tabs>

        <div className="drawer-tab-content">
          <div hidden={value !== 0} className="drawer-tab-panel">
            <div className="drawer-controls">{controls}</div>
          </div>
          <div hidden={value !== 1} className="drawer-tab-panel">
            <TransactionForm />
          </div>
          <div hidden={value !== 2} className="drawer-tab-panel">
            <DividendForm />
          </div>
        </div>
      </Drawer>

      {!open && (
        <div className="drawer-fab">
          <button className="drawer-fab-btn" onClick={() => setOpen(true)}>
            ☰ Forms
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBottomDrawer;
