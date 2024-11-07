import React from 'react';
import { useNavigate } from 'react-router-dom';

function SubscriptionComplete() {
  const navigate = useNavigate();

  const handleConfirmClick = () => {
    navigate('/'); // 확인 버튼 클릭 시 메인 페이지로 이동
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>청약신청이 완료되었습니다!</h2>
      <hr style={styles.titleDivider} />

      {/* 청약 확인 테이블 */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <tbody>
            <tr style={styles.oddRow}>
              <th style={styles.tableHeader}>청약계좌</th>
              <td style={styles.tableData}>46309613-01 위탁계좌</td>
            </tr>
            <tr style={styles.evenRow}>
              <th style={styles.tableHeader}>종목</th>
              <td style={styles.tableData}>주식회사 에이펙스</td>
            </tr>
            <tr style={styles.oddRow}>
              <th style={styles.tableHeader}>청약수량</th>
              <td style={styles.tableData}>50주</td>
            </tr>
            <tr style={styles.evenRow}>
              <th style={styles.tableHeader}>청약증거금</th>
              <td style={styles.tableData}>400,000원</td>
            </tr>
            <tr style={styles.oddRow}>
              <th style={styles.tableHeader}>청약수수료</th>
              <td style={styles.tableData}>2,000원</td>
            </tr>
            <tr style={styles.evenRow}>
              <th style={styles.tableHeader}>증거금 초과출금 서비스</th>
              <td style={styles.tableData}>미신청</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 추가 정보 테이블 */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <tbody>
            <tr style={styles.oddRow}>
              <th style={styles.tableHeader}>환불일</th>
              <td style={styles.tableData}>2024.10.28</td>
            </tr>
            <tr style={styles.evenRow}>
              <th style={styles.tableHeader}>환불금 이체계좌</th>
              <td style={styles.tableData}>한국투자증권 46309613-01</td>
            </tr>
            <tr style={styles.oddRow}>
              <th style={styles.tableHeader}>청약주식 입고계좌</th>
              <td style={styles.tableData}>46309613-01 위탁계좌</td>
            </tr>
            <tr style={styles.evenRow}>
              <th style={styles.tableHeader}>상장일</th>
              <td style={styles.tableData}>2024.11.01</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 확인 버튼 */}
      <div style={styles.buttonContainer}>
        <button style={styles.confirmButton} onClick={handleConfirmClick}>확인</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333D4B',
    marginBottom: '20px',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  titleDivider: {
    margin: '10px 0',
    border: 'none',
    borderTop: '1px solid #ccc',
  },
  tableContainer: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    fontFamily: '"Noto Sans KR", sans-serif',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
  },
  tableHeader: {
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
    padding: '16px',
    borderBottom: '1px solid #e0e0e0',
    borderRight: '1px solid #e0e0e0',
    textAlign: 'center',
    color: '#333D4B',
    width: '35%', // 헤더 너비 고정
  },
  tableData: {
    padding: '16px',
    borderBottom: '1px solid #e0e0e0',
    textAlign: 'center',
    color: '#555555',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  confirmButton: {
    padding: '10px 30px',
    backgroundColor: '#007AFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: '"Noto Sans KR", sans-serif',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  },
};

export default SubscriptionComplete;