import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Homeboard from './components/Homeboard';
import Account from './components/Account';
import Subscription from './components/subscription/Subscription';
import SubscriptionApply from './components/subscription/SubscriptionApply';
import SubscriptionConfirm from './components/subscription/SubscriptionConfirm';
import SubscriptionComplete from './components/subscription/SubscriptionComplete';
import SubscriptionInquiry from './components/subscription/SubscriptionInquiry';

function App() {
  return (
    <div style={styles.appContainer}>
      <Header />
      <main style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Homeboard />} />
          <Route path="/account/*" element={<Account />} />
          <Route path="/subscription" element={<Navigate to="/subscription/table" replace />} />
          <Route path="/subscription/*" element={<Subscription />} />
          <Route path="/subscription/apply/:id" element={<SubscriptionApply />} />
          <Route path="/subscription/apply/confirm" element={<SubscriptionConfirm />} />
          <Route path="/subscription/apply/complete" element={<SubscriptionComplete />} />
          <Route path="/subscription/inquiry" element={<SubscriptionInquiry />} />
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
  }
};

export default App;