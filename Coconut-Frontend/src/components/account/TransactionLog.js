import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

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

const Title = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
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

const Balance = styled.div`
  font-size: 13px;
  color: #666;
`;

const TransactionQuantity = styled.div`
  font-size: 15px;
  color: #4792ff;
`;

const TransactionLog = () => {
  const transactions = [
    {
      date: '10.28',
      time: '11:05',
      title: '반값입금',
      detail: '이체결과',
      amount: -8500,
      balance: 0,
    },
    {
      date: '10.28',
      time: '11:05',
      title: '반값입금',
      detail: '이체결과',
      amount: 8500,
      balance: 8500,
    },
    {
      date: '10.28',
      time: '11:05',
      title: '반값입금',
      detail: '이체결과',
      amount: -20000,
      balance: 0,
    },
    {
      date: '5.31',
      time: '11:05',
      title: 'CJ 새벽도',
      detail: '농협예약매도',
      quantity: '1주',
    },
    {
      date: '5.31',
      title: 'YG PLUS 1주',
      detail: '반대',
      amount: 5671,
    },
  ];

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>거래내역</Title>
        <AvailableAmount>주문 가능 원화: 6,630원</AvailableAmount>

        <FilterContainer>
          <FilterButton active>전체</FilterButton>
          <FilterButton>거래</FilterButton>
          <FilterButton>환전</FilterButton>
          <FilterButton>입출금</FilterButton>
          <FilterButton>입출고</FilterButton>
        </FilterContainer>

        <TransactionList>
          {transactions.map((transaction, index) => (
            <TransactionItem key={index}>
              <TransactionInfo>
                <TransactionDate>{transaction.date}</TransactionDate>
                <TransactionTitle>{transaction.title}</TransactionTitle>
                <TransactionDetail>{transaction.detail}</TransactionDetail>
              </TransactionInfo>
              <TransactionAmount>
                {transaction.quantity ? (
                  <TransactionQuantity>{transaction.quantity}</TransactionQuantity>
                ) : (
                  <>
                    <Amount isPositive={transaction.amount > 0}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}원
                    </Amount>
                    {transaction.balance !== undefined && (
                      <Balance>{transaction.balance.toLocaleString()}원</Balance>
                    )}
                  </>
                )}
              </TransactionAmount>
            </TransactionItem>
          ))}
        </TransactionList>
      </Container>
    </>
  );
};

export default TransactionLog;