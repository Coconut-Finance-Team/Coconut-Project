import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const Container = styled.div`
  padding: 40px 40px 0 5px;
  background: #ffffff;
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 32px;
`;

const AvailableAmount = styled.div`
  font-size: 15px;
  color: #333;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #E5E8EB;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const FilterButton = styled.button`
  height: 34px;
  padding: 0 16px;
  border-radius: 17px;
  font-size: 14px;
  background: ${props => props.active ? '#F8F9FA' : '#ffffff'};
  border: 1px solid ${props => props.active ? '#E5E8EB' : '#E5E8EB'};
  color: ${props => props.active ? '#333' : '#666'};
  cursor: pointer;

  &:hover {
    background: #F8F9FA;
  }
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
`;

const TransactionItem = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #E5E8EB;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TransactionInfo = styled.div``;

const TransactionDate = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
`;

const TransactionTitle = styled.div`
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
`;

const TransactionDetail = styled.div`
  font-size: 13px;
  color: #666;
`;

const TransactionAmount = styled.div`
  text-align: right;
`;

const Amount = styled.div`
  font-size: 15px;
  color: ${props => props.isPositive ? '#4792ff' : '#666'};
  margin-bottom: 4px;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: 90%;
  max-width: 400px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: #666;
`;

const DetailValue = styled.span`
  color: #333;
  font-weight: 500;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
`;

const TransactionLog = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeFilter, setActiveFilter] = useState('전체');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('jwtToken');
        console.log('Token exists:', !!token);
        
        if (!token) {
          setError('로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // 1. 사용자 정보 가져오기
        console.log('Fetching user info...');
        const userResponse = await axios.get(`${API_BASE_URL}/users/me`, { headers });
        console.log('User info response:', userResponse.data);
        
        setUser(userResponse.data);
        const primaryAccountId = userResponse.data.primaryAccountId;
        console.log('Primary Account ID from user:', primaryAccountId);

        if (!primaryAccountId) {
          setError('주계좌 정보를 찾을 수 없습니다.');
          setLoading(false);
          return;
        }

        // 2. 거래내역 가져오기
        console.log('Fetching transactions for account:', primaryAccountId);
        let endpoint = `${API_BASE_URL}/account/transactions/all`;
        
        const response = await axios.get(endpoint, {
          headers,
          params: {
            accountId: primaryAccountId,
            type: activeFilter !== '전체' ? activeFilter : undefined
          }
        });

        console.log('Transactions response:', response.data);
        setTransactions(response.data || []);

      } catch (error) {
        console.error('API 호출 중 에러 발생:', error);
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            params: error.config?.params
          }
        });

        if (error.response?.status === 401) {
          setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
          localStorage.removeItem('jwtToken');
        } else {
          setError(
            error.response?.data?.message ||
            '정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeFilter]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailData({
      type: transaction.type,
      name: transaction.name,
      amount: transaction.amount,
      quantity: transaction.quantity,
      time: transaction.date,
      status: transaction.status
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr;
  };

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return '0원';
    return amount.toLocaleString() + '원';
  };

  const renderDetailContent = () => {
    if (!detailData) return null;

    if (detailData.type === '거래') {
      return (
        <>
          <DetailRow>
            <DetailLabel>거래 종류</DetailLabel>
            <DetailValue>{detailData.type}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>종목명</DetailLabel>
            <DetailValue>{detailData.name}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>상태</DetailLabel>
            <DetailValue>{detailData.status}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>거래 금액</DetailLabel>
            <DetailValue>{formatAmount(detailData.amount)}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>거래 수량</DetailLabel>
            <DetailValue>{detailData.quantity}주</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>거래 날짜</DetailLabel>
            <DetailValue>{formatDate(detailData.time)}</DetailValue>
          </DetailRow>
        </>
      );
    }

    return (
      <>
        <DetailRow>
          <DetailLabel>거래 종류</DetailLabel>
          <DetailValue>{detailData.type}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>금액</DetailLabel>
          <DetailValue>{formatAmount(detailData.amount)}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>상태</DetailLabel>
          <DetailValue>{detailData.status}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>거래 날짜</DetailLabel>
          <DetailValue>{formatDate(detailData.time)}</DetailValue>
        </DetailRow>
      </>
    );
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>거래내역</Title>

        {error && (
          <div style={{ 
            color: '#dc3545', 
            padding: '16px', 
            marginBottom: '16px', 
            background: '#ffebee', 
            borderRadius: '8px',
            border: '1px solid #dc3545' 
          }}>
            {error}
          </div>
        )}

        <FilterContainer>
          <FilterButton 
            active={activeFilter === '전체'}
            onClick={() => handleFilterClick('전체')}
          >전체</FilterButton>
          <FilterButton 
            active={activeFilter === '거래'}
            onClick={() => handleFilterClick('거래')}
          >거래</FilterButton>
          <FilterButton 
            active={activeFilter === '입출금'}
            onClick={() => handleFilterClick('입출금')}
          >입출금</FilterButton>
        </FilterContainer>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            로딩중...
          </div>
        ) : (
          <TransactionList>
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                거래내역이 없습니다.
              </div>
            ) : (
              transactions.map((transaction, index) => (
                <TransactionItem 
                  key={index}
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <TransactionInfo>
                    <TransactionDate>{formatDate(transaction.date)}</TransactionDate>
                    <TransactionTitle>{transaction.name}</TransactionTitle>
                    <TransactionDetail>{transaction.status}</TransactionDetail>
                  </TransactionInfo>
                  <TransactionAmount>
                    <Amount isPositive={transaction.amount > 0}>
                      {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                    </Amount>
                  </TransactionAmount>
                </TransactionItem>
              ))
            )}
          </TransactionList>
        )}

        {selectedTransaction && (
          <>
            <Overlay onClick={() => setSelectedTransaction(null)} />
            <Modal>
              <CloseButton onClick={() => setSelectedTransaction(null)}>×</CloseButton>
              {renderDetailContent()}
            </Modal>
          </>
        )}
      </Container>
    </>
  );
};

export default TransactionLog;