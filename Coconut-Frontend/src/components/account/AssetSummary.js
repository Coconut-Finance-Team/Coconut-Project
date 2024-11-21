import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import skImage from '../../assets/sk.png';
import samsungImage from '../../assets/samsung.png';
import naverImage from '../../assets/naver.png';

const SummaryContainer = styled.div`
  background: #ffffff;
  border-left: 1px solid #eee;
  padding: 24px;
  box-sizing: border-box;
  height: calc(100vh - 64px);
  overflow-y: auto;
  position: sticky;
  top: 64px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e5e8eb;
    border-radius: 3px;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Balance = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const BalanceChange = styled.div`
  font-size: 14px;
  color: ${props => (props.value < 0 ? '#4788ff' : '#ff4747')};
  margin-bottom: 24px;
`;

const StockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StockItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: white;
  cursor: pointer;

  &:hover {
    background: #f8f9fa;
  }
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StockLogo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

const StockDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const StockName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const StockShares = styled.div`
  font-size: 13px;
  color: #666;
`;

const StockValues = styled.div`
  text-align: right;
`;

const StockPrice = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const PriceChange = styled.div`
  font-size: 13px;
  color: ${props => (props.isPositive ? '#ff4747' : '#4788ff')};
`;

function AssetSummary({ onStockClick }) {
  const navigate = useNavigate();
  const stocks = [
    {
      id: 'skhynix',
      name: 'SK하이닉스',
      logo: skImage,
      shares: '1주',
      value: 3140,
      change: -1525,
      changePercent: 32.6
    },
    {
      id: 'samsung',
      name: '삼성전자',
      logo: samsungImage,
      shares: '2주',
      value: 72000,
      change: 1200,
      changePercent: 1.64
    },
    {
      id: 'naver',
      name: '네이버',
      logo: naverImage,
      shares: '1주',
      value: 702,
      change: 189,
      changePercent: 36.8
    }
  ];

  return (
    <SummaryContainer>
      <Title>내 투자</Title>
      <Balance>3,842원</Balance>
      <BalanceChange value={-85}>-85원 (-2.1%)</BalanceChange>
      <StockList>
        {stocks.map(stock => (
          <StockItem key={stock.id} onClick={() => navigate(`/stock/${stock.id}`)}>
            <StockInfo>
              <StockLogo src={stock.logo} alt={stock.name} />
              <StockDetails>
                <StockName>{stock.name}</StockName>
                <StockShares>{stock.shares}</StockShares>
              </StockDetails>
            </StockInfo>
            <StockValues>
              <StockPrice>{stock.value.toLocaleString()}원</StockPrice>
              <PriceChange isPositive={stock.change > 0}>
                {stock.change > 0 ? '+' : ''}
                {stock.change.toLocaleString()}원 ({stock.change > 0 ? '+' : ''}{stock.changePercent}%)
              </PriceChange>
            </StockValues>
          </StockItem>
        ))}
      </StockList>
    </SummaryContainer>
  );
}

export default AssetSummary;
