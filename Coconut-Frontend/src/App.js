// src/App.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SubscriptionTable from './components/SubscriptionTable';
import SubscriptionApply from './components/SubscriptionApply';
import SubscriptionCalendar from './components/SubscriptionCalendar';
import SubscriptionConfirm from './components/SubscriptionConfirm';
import SubscriptionComplete from './components/SubscriptionComplete'; // 추가

function App() {
  const [selectedTab, setSelectedTab] = useState('table');
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    if (tab === 'table') {
      navigate('/'); // 청약종목안내로 이동
    } else if (tab === 'calendar') {
      navigate('/calendar'); // 청약일정조회로 이동
    }
  };

  // Apply 경로 여부를 확인하고 탭을 조건부로 렌더링
  const isApplyPage = location.pathname.includes('/apply'); // apply와 그 하위 경로 모두 포함

  return (
    <div style={styles.appContainer}>
      <Header />
      <main style={styles.mainContent}>
        {!isApplyPage && (
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
          <Route path="/apply/confirm" element={<SubscriptionConfirm />} />
          <Route path="/apply/complete" element={<SubscriptionComplete />} /> {/* /apply/complete 경로 추가 */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// 기존의 styles 유지
const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
  },
  mainContent: {
    flex: 1,
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
