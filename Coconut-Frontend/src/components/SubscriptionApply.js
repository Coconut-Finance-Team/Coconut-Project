import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SubscriptionApply() {
  const location = useLocation();
  const navigate = useNavigate();
  const { company } = location.state || {};

  const [agreements, setAgreements] = useState({
    download1: false,
    agree1: false,
    download2: false,
    agree2: false,
    agree3: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAnswers, setModalAnswers] = useState({ q1: '', q2: '' });

  if (!company) {
    return <div style={styles.errorMessage}>잘못된 접근입니다.</div>;
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleDownload = (name) => {
    setAgreements((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleNextClick = () => {
    if (
      agreements.download1 &&
      agreements.agree1 &&
      agreements.download2 &&
      agreements.agree2 &&
      agreements.agree3
    ) {
      setIsModalOpen(true); // 모든 동의가 완료되면 모달 열기
    } else {
      alert("모든 다운로드와 동의를 완료해주세요.");
    }
  };

  const handleModalAnswerChange = (e) => {
    const { name, value } = e.target;
    setModalAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    if (modalAnswers.q1 === 'yes' && modalAnswers.q2 === 'yes') {
      setIsModalOpen(false);
      navigate('/apply/confirm'); // 수정된 경로로 이동 (올바른 경로로 변경)
    } else {
      alert("모든 질문에 '예'로 답변해야 합니다.");
    }
  };

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

        {/* 동의 항목 */}
        <div style={styles.detailAgreementRow}>
          <p style={styles.detailAgreementText}>전자문서에 의하여 투자설명서를 교부 받는 것에 동의합니다.</p>
          <div style={styles.buttonAndCheckboxContainer}>
            <button style={styles.downloadButton} onClick={() => handleDownload('download1')}>
              투자설명서 다운로드
            </button>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agree1"
                checked={agreements.agree1}
                onChange={handleCheckboxChange}
              /> 확인 및 동의
            </label>
          </div>
        </div>

        <div style={styles.detailAgreementRow}>
          <p style={styles.detailAgreementText}>투자설명서를 내 PC에 다운로드 받겠습니다.</p>
          <div style={styles.buttonAndCheckboxContainer}>
            <button style={styles.downloadButton} onClick={() => handleDownload('download2')}>
              투자설명서 다운로드
            </button>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agree2"
                checked={agreements.agree2}
                onChange={handleCheckboxChange}
              /> 확인 및 동의
            </label>
          </div>
        </div>

        <div style={styles.detailAgreementRow}>
          <p style={styles.detailAgreementText}>전자문서에 의한 투자설명서 교부가 완료되었습니다.</p>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="agree3"
              checked={agreements.agree3}
              onChange={handleCheckboxChange}
            /> 확인 및 동의
          </label>
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>이전</button>
        <button style={styles.nextButton} onClick={handleNextClick}>다음</button>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>청약 이해 확인</h3>
            {/* 질문 카드 1 */}
            <div style={styles.questionCard}>
              <p style={{ marginBottom: '20px', textAlign: 'justify', lineHeight: '1.8' }}>
                Q1. 이 금융상품은 <span style={styles.highlightText}>예금자보호법에 따라 보호되지 않습니다.</span> 이로 인해 원금손실이 발생할 가능성이 있음을 충분히 이해하셨나요?
              </p>
              <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <label>
                  <input type="radio" name="q1" value="yes" onChange={handleModalAnswerChange} /> 예
                </label>
                <label>
                  <input type="radio" name="q1" value="no" onChange={handleModalAnswerChange} /> 아니오
                </label>
              </div>
              {modalAnswers.q1 === '' && <p style={styles.selectWarning}>※ 선택해 주세요.</p>}
            </div>

            {/* 질문 카드 2 */}
            <div style={styles.questionCard}>
              <p style={{ marginBottom: '20px', textAlign: 'justify', lineHeight: '1.8' }}>
                Q2. 핵심투자설명서를 제공받은 후 <span style={styles.highlightText}>상품의 주요 내용, 위험도, 그리고 최대 손실 가능성</span>에 대해 충분히 이해하셨나요?
              </p>
              <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <label>
                  <input type="radio" name="q2" value="yes" onChange={handleModalAnswerChange} /> 예
                </label>
                <label>
                  <input type="radio" name="q2" value="no" onChange={handleModalAnswerChange} /> 아니오
                </label>
              </div>
              {modalAnswers.q2 === '' && <p style={styles.selectWarning}>※ 선택해 주세요.</p>}
            </div>

            <p style={styles.warningText}>※ 충분히 이해했다고 확인했다가 답변할 경우 추후 소송이나 분쟁에서 불리하게 작용할 수 있으니, 신중하게 답변해 주시기 바랍니다.</p>
            <div style={styles.modalButtonContainer}>
              <button style={styles.backButton} onClick={() => setIsModalOpen(false)}>이전</button>
              <button style={styles.nextButton} onClick={handleCloseModal}>확인</button>
            </div>
          </div>
        </div>
      )}
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
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  nextButton: {
    padding: '10px 20px',
    backgroundColor: '#007AFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  errorMessage: {
    textAlign: 'center',
    color: 'red',
    fontSize: '18px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    width: '600px',
    textAlign: 'left',
    overflow: 'auto',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  questionCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
  highlightText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  radioContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  },
  selectWarning: {
    color: 'red',
    fontSize: '12px',
    marginTop: '10px',
  },
  warningText: {
    color: 'red',
    fontSize: '12px',
    marginBottom: '20px',
  },
  modalButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  backButtonDisabled: {
    padding: '10px 20px',
    backgroundColor: '#ccc',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'not-allowed',
    fontSize: '14px',
    marginRight: '10px',
  },
};

export default SubscriptionApply;
