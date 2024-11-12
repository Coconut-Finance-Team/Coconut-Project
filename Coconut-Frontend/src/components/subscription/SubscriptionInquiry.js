import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function SubscriptionInquiry() {
  const [startDate, setStartDate] = useState(null); // 조회 시작일
  const [endDate, setEndDate] = useState(null); // 조회 종료일
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  const handleCancelClick = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleModalCloseAndRedirect = () => {
    closeModal();
    window.location.href = '/subscription'; // 공모주 청약 홈으로 리다이렉트
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>나의 청약</h2>

      <select style={styles.dropdown}>
        <option>46309613-01 위탁계좌</option>
      </select>

      <div style={styles.datePickerWrapper}>
        <label style={styles.label}>청약 조회 기간</label>
        <div style={styles.customDatePicker}>
          <span style={styles.icon}></span>
          <DatePicker
            selected={startDate}
            onChange={(update) => {
              setStartDate(update[0]);
              setEndDate(update[1]);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            dateFormat="yyyy.MM.dd"
            placeholderText="기간 선택"
            className="datePickerInput"
            customInput={
              <input
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  backgroundColor: 'transparent',
                  fontSize: '16px',
                  padding: '0',
                }}
                value={
                  startDate && endDate
                    ? `${startDate.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })} - ${endDate.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}`
                    : ''
                }
                readOnly
              />
            }
          />
        </div>
      </div>

      <div style={styles.inquiryBox}>
        <div style={styles.companyInfo}>
          <span style={styles.companyName}>주식회사 에이펙스</span>
          <span style={styles.applicationDate}>신청완료일 2024.10.24</span>
        </div>
        <div style={styles.details}>
          <div style={styles.detailRow}>
            <span>청약수량</span>
            <span>50주 / 400,000원</span>
          </div>
          <div style={styles.detailRow}>
            <span>배정 및 환불일</span>
            <span>2024.10.28</span>
          </div>
        </div>
        <button style={styles.cancelButton} onClick={handleCancelClick}>청약 취소</button>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p style={styles.modalText}>청약취소 완료</p>
            <p style={styles.modalText}>영업일 2~3일 내 환불계좌로 입금예정</p>
            <button style={styles.modalCloseButton} onClick={handleModalCloseAndRedirect}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'center',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333D4B',
    marginBottom: '20px',
  },
  dropdown: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  datePickerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '20px',
    width: '92%',
  },
  label: {
    fontSize: '14px',
    color: '#333D4B',
    marginBottom: '5px',
    fontWeight: '500',
  },
  customDatePicker: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#ffffff',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  icon: {
    width: '16px',
    height: '16px',
    marginRight: '8px',
    display: 'inline-block',
    backgroundColor: 'transparent',
    backgroundImage:
      'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27%23333D4B%27 viewBox=%270 0 24 24%27%3E%3Cpath d=%27M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z%27/%3E%3C/svg%3E")',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  },
  inquiryBox: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  },
  companyInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  companyName: {
    fontWeight: '600',
    fontSize: '16px',
  },
  applicationDate: {
    fontSize: '14px',
    color: '#888',
  },
  details: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginBottom: '5px',
  },
  cancelButton: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: '#4174f6',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '350px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  modalText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '12px',
  },
  modalCloseButton: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007AFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
  },
};

export default SubscriptionInquiry;
