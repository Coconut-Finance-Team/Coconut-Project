// src/components/SubscriptionApply.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SubscriptionApply() {
  const location = useLocation();
  const navigate = useNavigate();
  const { company } = location.state || {};

  if (!company) {
    return <div style={styles.errorMessage}>잘못된 접근입니다.</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.titleLeft}>공모주 신청</h2>
      <div style={styles.infoContainer}>
        <div style={styles.infoRow}>
          <span style={styles.label}>청약종목명</span>
          <span>{company.companyName}</span>
          <span style={styles.label}>청약종목번호</span>
          <span>20241280102</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>청약구분</span>
          <span>{company.category}</span>
          <span style={styles.label}>경쟁률</span>
          <span>7.89 : 1</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>일반공모물량</span>
          <span>540,000</span>
          <span style={styles.label}>청약기간</span>
          <span>{company.applicationPeriod}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>균등배정물량</span>
          <span>270,000</span>
          <span style={styles.label}>일반 청약 참여 건수</span>
          <span>38,271</span>
        </div>
      </div>

      <div style={styles.agreementContainer}>
        <h3 style={styles.subTitle}>설명서 교부 및 동의</h3>
        <div style={styles.agreementQuestionContainer}>
          <p style={styles.agreementQuestion}>투자설명서를 확인하셨습니까?</p>
          <label>
            <input type="radio" name="agreement" value="yes" /> 예
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input type="radio" name="agreement" value="no" onClick={() => alert('"아니오" 선택 시, 청약신청에 제한이 있을 수 있습니다')} /> 아니오
          </label>
        </div>

        {/* Agreement Rows with aligned buttons */}
        <div style={styles.detailAgreementRow}>
          <p style={styles.detailAgreementText}>전자문서에 의하여 투자설명서를 교부 받는 것에 동의합니다.</p>
          <div style={styles.buttonAndCheckboxContainer}>
            <button style={styles.downloadButton}>투자설명서 다운로드</button>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" /> 확인 및 동의
            </label>
          </div>
        </div>

        <div style={styles.detailAgreementRow}>
          <p style={styles.detailAgreementText}>투자설명서를 내 PC에 다운로드 받겠습니다.</p>
          <div style={styles.buttonAndCheckboxContainer}>
            <button style={styles.downloadButton}>투자설명서 다운로드</button>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" /> 확인 및 동의
            </label>
          </div>
        </div>

        <div style={styles.detailAgreementRow}>
          <p style={styles.detailAgreementText}>전자문서에 의한 투자설명서 교부가 완료되었습니다.</p>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" /> 확인 및 동의
          </label>
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>이전</button>
        <button style={styles.nextButton}>다음</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: '"Noto Sans KR", Arial, sans-serif',
  },
  titleLeft: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333D4B',
    marginBottom: '20px',
    textAlign: 'left',
  },
  infoContainer: {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    marginBottom: '20px',
  },
  infoRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
    marginBottom: '10px',
  },
  label: {
    fontWeight: 'bold',
    color: '#333D4B',
  },
  subTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333D4B',
    marginBottom: '10px',
  },
  agreementContainer: {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    marginBottom: '20px',
  },
  agreementQuestionContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#f1f1f1',
    borderRadius: '8px',
  },
  agreementQuestion: {
    fontWeight: '600',
    marginRight: '20px',
  },
  detailAgreementRow: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
    marginBottom: '10px',
  },
  detailAgreementText: {
    marginBottom: '10px',
  },
  buttonAndCheckboxContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  downloadButton: {
    padding: '6px 12px',
    backgroundColor: '#f1f1f1',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    marginRight: '20px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
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
  },
  nextButton: {
    padding: '10px 20px',
    backgroundColor: '#007AFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  errorMessage: {
    textAlign: 'center',
    color: 'red',
    fontSize: '18px',
  },
};

export default SubscriptionApply;
