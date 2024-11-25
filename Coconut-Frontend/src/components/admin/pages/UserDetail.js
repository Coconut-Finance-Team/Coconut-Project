
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';

const styles = `
  .user-detail-container {
    padding: 24px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 14px;
    margin-bottom: 16px;
    cursor: pointer;
    border: 1px solid #e2e8f0;
    background: white;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .back-button:hover {
    color: #3b82f6;
    border-color: #3b82f6;
    background-color: #f8fafc;
  }

  .back-button svg {
    width: 16px;
    height: 16px;
  }

  .page-title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 24px;
    color: #1e293b;
  }

  .section {
    margin-bottom: 32px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #1e293b;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .info-item {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
  }

  .info-label {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 4px;
  }

  .info-value {
    font-size: 14px;
    color: #1e293b;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    background-color: #dcfce7;
    color: #15803d;
  }

  .status-badge.inactive {
    background-color: #fee2e2;
    color: #dc2626;
  }

  .activity-list {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: white;
  }

  .activity-item {
    display: grid;
    grid-template-columns: 150px 1fr 200px;
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.2s;
  }

  .activity-item:hover {
    background-color: #f8fafc;
  }

  .activity-item:last-child {
    border-bottom: none;
  }

  .activity-time {
    color: #64748b;
    font-size: 14px;
  }

  .activity-description {
    color: #1e293b;
    font-size: 14px;
    font-weight: 500;
  }

  .activity-detail {
    color: #64748b;
    font-size: 14px;
    text-align: right;
  }

  .contract-item {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
  }

  .contract-item.header {
    font-weight: 500;
    color: #64748b;
    background-color: #f8fafc;
  }

  .delete-button {
    display: inline-block;
    padding: 6px 12px;
    color: #dc2626;
    background: none;
    border: 1px solid #dc2626;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .delete-button:hover {
    background-color: #fee2e2;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 90%;
    text-align: center;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #1e293b;
  }

  .modal-button {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    margin-top: 16px;
    transition: background-color 0.2s;
  }

  .modal-button:hover {
    background-color: #2563eb;
  }
`;

const UserDetail = ({ user, onBack }) => {
    const [showModal, setShowModal] = useState(false);

    if (!user) {
        return <div>로딩 중...</div>;
    }

    const handleTradeStop = async () => {
        try {
            await axios.patch(`${API_BASE_URL}/suspend/account/${user.accountInfo.accountId}`);
            setShowModal(true);
        } catch (error) {
            console.error('계정 정지 실패:', error);
            alert('계정 정지에 실패했습니다.');
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="user-detail-container">
                <button className="back-button" onClick={onBack}>
                    <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    목록으로
                </button>
                
                <h1 className="page-title">회원 상세 정보</h1>

                <div className="section">
                    <h2 className="section-title">기본 정보</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-label">이름</div>
                            <div className="info-value">{user.username}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">이메일</div>
                            <div className="info-value">{user.email}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">전화번호</div>
                            <div className="info-value">{user.phone}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">가입일</div>
                            <div className="info-value">{new Date(user.createTime).toLocaleDateString()}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">성별</div>
                            <div className="info-value">{user.gender}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">직업</div>
                            <div className="info-value">{user.job}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">투자 스타일</div>
                            <div className="info-value">{user.investmentStyle}</div>
                        </div>
                        <div className="info-item">
                            <div className="info-label">회원 상태</div>
                            <div className="info-value">
                                <span className={`status-badge ${user.status === 'SUSPENDED' ? 'inactive' : ''}`}>
                                    {user.status === 'ACTIVE' ? '활성' : '정지'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {user.accountInfo && (
                    <div className="section">
                        <h2 className="section-title">계좌 정보</h2>
                        <div className="activity-list">
                            <div className="contract-item header">
                                <div>계좌번호</div>
                                <div>계좌명</div>
                                <div>상태</div>
                                <div>관리</div>
                            </div>
                            <div className="contract-item">
                                <div>{user.accountInfo.accountId}</div>
                                <div>{user.accountInfo.accountName}</div>
                                <div>
                                    <span className={`status-badge ${user.accountInfo.accountStatus === 'CLOSED' ? 'inactive' : ''}`}>
                                        {user.accountInfo.accountStatus === 'OPEN' ? '활성' : '정지'}
                                    </span>
                                </div>
                                <div>
                                    <button className="delete-button" onClick={handleTradeStop}>
                                        거래정지
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {user.userHistory && user.userHistory.length > 0 && (
                    <div className="section">
                        <h2 className="section-title">활동 내역</h2>
                        <div className="activity-list">
                            {user.userHistory.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-time">
                                        {new Date(activity.time).toLocaleString()}
                                    </div>
                                    <div className="activity-description">{activity.title}</div>
                                    <div className="activity-detail">{activity.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-title">
                                {user.username}님의 계좌에 대한 거래정지를 완료하였습니다.
                            </div>
                            <button 
                                className="modal-button"
                                onClick={() => setShowModal(false)}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserDetail;
