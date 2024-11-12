import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
 @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
 
 * {
   font-family: 'Noto Sans KR', sans-serif;
 }
`;

const ChartContainer = styled.div`
 background: #ffffff;
 border: 1px solid #E5E8EB;
 border-radius: 12px;
 padding: 24px;
 cursor: pointer;
 transition: all 0.2s;
 font-family: 'Noto Sans KR', sans-serif;
 
 &:hover {
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
 }
`;

const MarketName = styled.div`
 font-size: 14px;
 color: #666;
 margin-bottom: 16px;
 font-family: 'Noto Sans KR', sans-serif;
`;

const Price = styled.div`
 font-size: 24px;
 font-weight: 600;
 color: #333;
 margin-bottom: 8px;
 font-family: 'Noto Sans KR', sans-serif;
`;

const Change = styled.div`
 font-size: 14px;
 color: ${props => props.value < 0 ? '#ff4747' : '#00c073'};
 font-family: 'Noto Sans KR', sans-serif;
`;

const IndexChart = ({ name, value, change, changePercent, isKospi }) => {
 const navigate = useNavigate();

 const handleClick = () => {
   navigate('/chart/detail', {
     state: {
       marketData: {
         name,
         value,
         change,
         changePercent,
         isKospi
       }
     }
   });
 };

 return (
   <>
     <GlobalStyle />
     <ChartContainer onClick={handleClick}>
       <MarketName>{name}</MarketName>
       <Price>{value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}</Price>
       <Change value={change}>
         {change > 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
       </Change>
     </ChartContainer>
   </>
 );
};

export default IndexChart;