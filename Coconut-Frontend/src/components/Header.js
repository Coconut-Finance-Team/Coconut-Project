// src/components/Header.js
import React from 'react';
import logoImage from '../assets/logo.png';

function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.navContainer}>
        <div style={styles.logoContainer}>
          <img src={logoImage} alt="코코넛증권 로고" style={styles.logoImage} />
          <span style={styles.logoText}>코코넛증권</span>
        </div>
        <nav>
          <ul style={styles.navList}>
            <li style={styles.navItem}>홈</li>
            <li style={styles.navItem}>공모주</li>
            <li style={styles.navItem}>내 계좌</li>
            <li style={styles.navItem}>청약현황</li>
          </ul>
        </nav>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            style={styles.searchInput}
          />
          <svg
            style={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <button style={styles.loginButton}>로그인</button>
      </div>
    </header>
  );
}

const styles = {
    header: {
      backgroundColor: '#ffffff',
      padding: '10px 20px',
      fontFamily: '"Noto Sans KR", Arial, sans-serif',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    navContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'nowrap',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
    },
    logoImage: {
      width: '30px',
      height: '30px',
      marginRight: '8px',
    },
    logoText: {
      fontSize: '18px',
      fontWeight: '900',
      color: '#333',
      fontFamily: '"Noto Sans KR", Arial, sans-serif',
      whiteSpace: 'nowrap',
    },
    loginButton: {
      backgroundColor: '#007AFF',
      color: '#ffffff',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      fontFamily: '"Noto Sans KR", Arial, sans-serif',
      whiteSpace: 'nowrap',
    },
    navList: {
      display: 'flex',
      gap: '30px',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      flexWrap: 'nowrap',
    },
    navItem: {
      fontSize: '16px', // Increased from 14px to 16px
      color: '#333',
      fontWeight: '500',
      fontFamily: '"Noto Sans KR", Arial, sans-serif',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: '20px',
      padding: '5px 10px',
      marginRight: '20px',
      whiteSpace: 'nowrap',
    },
    searchInput: {
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      fontSize: '14px',
      fontFamily: '"Noto Sans KR", Arial, sans-serif',
      color: '#666',
      padding: '5px',
      width: '200px',
    },
    searchIcon: {
      color: '#999',
      cursor: 'pointer',
    },
  };
  
  export default Header;
  