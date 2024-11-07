<<<<<<< HEAD
// src/App.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SubscriptionTable from './components/SubscriptionTable';
import SubscriptionApply from './components/SubscriptionApply';
import SubscriptionCalendar from './components/SubscriptionCalendar';
=======
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Homeboard from './components/Homeboard';
import Account from './components/Account';
import SubscriptionTable from './components/subscription/SubscriptionTable';
import SubscriptionApply from './components/subscription/SubscriptionApply';
import SubscriptionConfirm from './components/subscription/SubscriptionConfirm';
import SubscriptionComplete from './components/subscription/SubscriptionComplete';
>>>>>>> upstream/develop

function App() {
  const [selectedTab, setSelectedTab] = useState('table');
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    if (tab === 'table') {
      navigate('/'); // Go to SubscriptionTable
    } else if (tab === 'calendar') {
      navigate('/calendar'); // Go to SubscriptionCalendar
    }
  };

  // Conditionally render the header title and tabs based on the route
  const isApplyPage = location.pathname === '/apply';

  return (
    <div style={styles.appContainer}>
      <Header />
      <main style={styles.mainContent}>
<<<<<<< HEAD
        {!isApplyPage && ( // Conditionally render this section
          <>
            <div style={styles.titleContainer}>
              <h2 style={styles.titleLeft}>공모주 청약안내</h2>
            </div>
            <div style={styles.tabContainer}>
              <span
                onClick={() => handleTabClick('table')}
                style={selectedTab === 'table' ? { ...styles.inactiveTab, ...styles.activeTab } : styles.inactiveTab}
              >
                청약종목안내
              </span>
              <span
                onClick={() => handleTabClick('calendar')}
                style={selectedTab === 'calendar' ? { ...styles.inactiveTab, ...styles.activeTab } : styles.inactiveTab}
              >
                청약일정조회
              </span>
            </div>
          </>
        )}
        <Routes>
          <Route path="/" element={<SubscriptionTable />} />
          <Route path="/apply" element={<SubscriptionApply />} />
          <Route path="/calendar" element={<SubscriptionCalendar />} />
=======
        <Routes>
          <Route path="/" element={<Homeboard />} />
          <Route path="/account/*" element={<Account />} />
          <Route path="/subscription" element={<SubscriptionTable />} />
          <Route path="/subscription/apply/:id" element={<SubscriptionApply />} />
          <Route path="/subscription/apply/confirm" element={<SubscriptionConfirm />} />
          <Route path="/subscription/apply/complete" element={<SubscriptionComplete />} />
>>>>>>> upstream/develop
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
  },
  mainContent: {
    flex: 1,
<<<<<<< HEAD
    padding: '20px',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto 20px',
  },
  titleLeft: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333D4B',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  activeTab: {
    borderBottom: '3px solid #333D4B',
    fontWeight: '700',
  },
  inactiveTab: {
    flex: 1,
    textAlign: 'center',
    padding: '15px 0',
    color: '#8B95A1',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'color 0.2s ease-out, transform 0.2s ease-out',
  },
};

export default App;
=======
  }
};

export default App;
>>>>>>> upstream/develop
