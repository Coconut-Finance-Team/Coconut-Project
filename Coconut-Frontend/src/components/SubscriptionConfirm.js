import React from 'react';
import { useNavigate } from 'react-router-dom';

function SubscriptionConfirm() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handleConfirmClick = () => {
    alert('청약 정보가 최종 확인되었습니다.');
    navigate('/apply/complete'); // 청약 확인 후 청약 완료 페이지로 이동
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: '"Noto Sans KR", sans-serif' }}>
      <h2 style={styles.title}>청약 정보 입력 확인</h2>

      {/* 공모주 종목 정보 */}
      <div style={styles.infoContainer}>
        <h3 style={styles.subTitle}>공모주 종목 정보</h3>
        <hr style={styles.subTitleDivider} />
        <table style={styles.table}>
          <tbody>
            <tr>
              <th style={styles.tableHeader}>청약종목명</th>
              <td style={styles.tableData}>주식회사 대표코리아</td>
              <th style={styles.tableHeader}>청약등록번호</th>
              <td style={styles.tableData}>202410280102</td>
            </tr>
            <tr>
              <th style={styles.tableHeader}>청약구분</th>
              <td style={styles.tableData}>유가증권시장</td>
              <th style={styles.tableHeader}>경쟁률 (일반공모)</th>
              <td style={styles.tableData}>7.89 : 1</td>
            </tr>
            <tr>
              <th style={styles.tableHeader}>일반공모물량</th>
              <td style={styles.tableData}>540,000</td>
              <th style={styles.tableHeader}>경쟁률 (우선배정)</th>
              <td style={styles.tableData}>14.78 : 1</td>
            </tr>
            <tr>
              <th style={styles.tableHeader}>균등배정물량</th>
              <td style={styles.tableData}>270,000</td>
              <th style={styles.tableHeader}>일반 청약 참여 건수</th>
              <td style={styles.tableData}>38,271</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 청약 계좌 선택 */}
      <div style={styles.infoContainer}>
        <h3 style={styles.subTitle}>청약계좌 선택</h3>
        <hr style={styles.subTitleDivider} />
        <table style={styles.table}>
          <tbody>
            <tr>
              <th style={styles.tableHeader}>청약계좌번호</th>
              <td style={styles.tableData}>123-456-789012</td>
              <th style={styles.tableHeader}>계좌 비밀번호</th>
              <td style={styles.tableData}>****</td>
            </tr>
            <tr>
              <th style={styles.tableHeader}>청약가능금액</th>
              <td style={styles.tableData}>10,000,000원</td>
              <th style={styles.tableHeader}>청약증금</th>
              <td style={styles.tableData}>5,000,000원</td>
            </tr>
            <tr>
              <th style={styles.tableHeader}>청약수수료</th>
              <td style={styles.tableData}>1,000원</td>
              <th style={styles.tableHeader}>청약 가능 수량</th>
              <td style={styles.tableData}>100주</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 청약 정보 입력 */}
      <div style={styles.infoContainer}>
        <h3 style={styles.subTitle}>청약정보 입력</h3>
        <hr style={styles.subTitleDivider} />
        <table style={styles.table}>
          <tbody>
            <tr>
              <th style={styles.tableHeader}>청약 수량</th>
              <td style={styles.tableData}>**** 원 (청약경쟁률: 50%)</td>
              <th style={styles.tableHeader}>공모가 (확정발행가)</th>
              <td style={styles.tableData}>340,000원</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 이체 정보 입력 */}
      <div style={styles.infoContainer}>
        <h3 style={styles.subTitle}>이체정보 입력 (미신청 시 청약계좌로 자동 입금 및 입고)</h3>
        <hr style={styles.subTitleDivider} />
        <table style={styles.table}>
          <tbody>
            <tr>
              <th style={styles.tableHeader}>환불금 자동이체</th>
              <td style={styles.tableData}>O</td>
              <th style={styles.tableHeader}>청약주식 사용이체</th>
              <td style={styles.tableData}>O</td>
            </tr>
            <tr>
              <th style={styles.tableHeader}>입금 계좌 번호</th>
              <td style={styles.tableData}>111-222-333444</td>
              <th style={styles.tableHeader}>입고 계좌 번호</th>
              <td style={styles.tableData}>555-666-777888</td>
            </tr>
            <tr>
              <th style={styles.tableHeader}>입금계좌 고객명</th>
              <td style={styles.tableData}>홍길동</td>
              <th style={styles.tableHeader}>입고계좌 고객명</th>
              <td style={styles.tableData}>이영희</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 버튼 영역 */}
      <div style={styles.buttonContainer}>
        <button style={styles.backButton} onClick={handleBackClick}>이전</button>
        <button style={styles.confirmButton} onClick={handleConfirmClick}>확인</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333D4B',
    marginBottom: '20px',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  subTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333D4B',
    marginBottom: '10px',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  subTitleDivider: {
    margin: '10px 0',
    border: 'none',
    borderTop: '1px solid #ccc',
  },
  infoContainer: {
    marginBottom: '30px',
  },
  table: {
    width: '100%',
    tableLayout: 'fixed', // 테이블 너비를 고정하여 모든 셀의 크기를 동일하게 맞춤
    borderCollapse: 'collapse',
    border: '1px solid #e0e0e0',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: '16px', // 모든 셀의 패딩을 동일하게 설정
    border: '1px solid #e0e0e0',
    textAlign: 'center', // 셀 내용을 중앙 정렬
    color: '#333D4B',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  tableData: {
    border: '1px solid #e0e0e0',
    padding: '16px', // 모든 셀의 패딩을 동일하게 설정
    textAlign: 'center', // 셀 내용을 중앙 정렬
    color: '#555555',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#ccc',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  confirmButton: {
    padding: '10px 20px',
    backgroundColor: '#007AFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
};

export default SubscriptionConfirm;
