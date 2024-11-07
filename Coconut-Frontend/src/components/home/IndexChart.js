import React from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
  background: #ffffff;
  border: 1px solid #E5E8EB;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MarketName = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
`;

const Price = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Change = styled.div`
  font-size: 14px;
  color: ${props => props.value < 0 ? '#ff4747' : '#00c073'};
`;

const IndexChart = ({ name, value, change, changePercent }) => {
  return (
    <ChartContainer>
      <MarketName>{name}</MarketName>
      <Price>{value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}</Price>
      <Change value={change}>
        {change > 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
      </Change>
    </ChartContainer>
  );
};

export default IndexChart;