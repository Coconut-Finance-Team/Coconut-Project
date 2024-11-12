import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import RightsModal from './modal/RightModal';
import PasswordModal from './modal/PwChangeModal';
import TerminationModal from './modal/TerminationModal';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const Container = styled.div`
  padding: 40px 0;
  background: #ffffff;
`;

// Transaction.js와 동일한 헤더 스타일
const Title = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 32px;
`;

const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

const InfoSection = styled.div`
  margin-bottom: 32px;
  border-bottom: 1px solid #E5E8EB;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #E5E8EB;
  font-size: 15px;
  color: #333;

  &:last-child {
    border-bottom: none;
  }
`;

const ManageSection = styled.div``;

const ManageRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  border-bottom: 1px solid #E5E8EB;

  &:last-child {
    border-bottom: none;
  }
`;

const Arrow = styled.div`
  font-size: 18px;
  color: #666;
`;

function AccountManage() {
  const [isRightModalOpen, setIsRightModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAccountTerminationModalOpen, setIsAccountTerminationModalOpen] = useState(false);

  const openRightModal = () => {
    setIsRightModalOpen(true);
  };

  const closeRightModal = () => {
    setIsRightModalOpen(false);
  };

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const openAccountTerminationModal = () => {
    setIsAccountTerminationModalOpen(true);
  };

  const closeAccountTerminationModal = () => {
    setIsAccountTerminationModalOpen(false);
  };

  const handleAccountTermination = () => {
    console.log("Account termination confirmed.");
    closeAccountTerminationModal();
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>계좌 관리</Title>

        <SectionTitle>내 계좌 정보</SectionTitle>
        <InfoSection>
          <InfoRow>
            <div>계좌번호</div>
            <div>110-1234-1234</div>
          </InfoRow>
          <InfoRow>
            <div>개설일</div>
            <div>YYYY년 M월 DD일</div>
          </InfoRow>
          <InfoRow>
            <div>금리</div>
            <div>2.5%</div>
          </InfoRow>
        </InfoSection>

        <SectionTitle>내 계좌 관리</SectionTitle>
        <ManageSection>
          <ManageRow onClick={openRightModal}>
            <div>내 권리</div>
            <Arrow>{'>'}</Arrow>
          </ManageRow>
          {isRightModalOpen && <RightsModal onClose={closeRightModal} />}

          <ManageRow onClick={openPasswordModal}>
            <div>계좌 비밀번호 변경</div>
            <Arrow>{'>'}</Arrow>
          </ManageRow>
          {isPasswordModalOpen && <PasswordModal onClose={closePasswordModal} />}

          <ManageRow onClick={openAccountTerminationModal}>
            <div>계좌 해지</div>
            <Arrow>{'>'}</Arrow>
          </ManageRow>
          {isAccountTerminationModalOpen && (
            <TerminationModal 
              onClose={closeAccountTerminationModal}
              onTerminate={handleAccountTermination}
            />
          )}
        </ManageSection>
      </Container>
    </>
  );
}

export default AccountManage;