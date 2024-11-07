import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ModalOverlay = styled.div`
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
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalContent = styled.div`
  padding: 40px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
  text-align: center;
`;

const InfoCard = styled.div`
  background: #fff;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Tr = styled.tr`
  &:nth-child(odd) {
    background: #f9fafb;
  }
`;

const Th = styled.th`
  padding: 16px;
  color: #666;
  font-weight: 500;
  text-align: left;
  width: 35%;
`;

const Td = styled.td`
  padding: 16px;
  color: #333;
`;

const Button = styled.button`
  padding: 16px 48px;
  background: #4174f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin: 0 auto;
  display: block;
`;

function SubscriptionComplete() {
  const navigate = useNavigate();

  return (
    <ModalOverlay onClick={() => navigate('/')}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalContent>
          <Title>청약신청이 완료되었습니다!</Title>

          <InfoCard>
            <Table>
              <tbody>
                <Tr>
                  <Th>청약계좌</Th>
                  <Td>46309613-01 위탁계좌</Td>
                </Tr>
                <Tr>
                  <Th>종목</Th>
                  <Td>주식회사 에이펙스</Td>
                </Tr>
                <Tr>
                  <Th>청약수량</Th>
                  <Td>50주</Td>
                </Tr>
                <Tr>
                  <Th>청약증거금</Th>
                  <Td>400,000원</Td>
                </Tr>
                <Tr>
                  <Th>청약수수료</Th>
                  <Td>2,000원</Td>
                </Tr>
              </tbody>
            </Table>
          </InfoCard>

          <InfoCard>
            <Table>
              <tbody>
                <Tr>
                  <Th>환불일</Th>
                  <Td>2024.10.28</Td>
                </Tr>
                <Tr>
                  <Th>환불금 이체계좌</Th>
                  <Td>46309613-01 위탁계좌</Td>
                </Tr>
                <Tr>
                  <Th>상장일</Th>
                  <Td>2024.11.01</Td>
                </Tr>
              </tbody>
            </Table>
          </InfoCard>

          <Button onClick={() => navigate('/')}>확인</Button>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default SubscriptionComplete;