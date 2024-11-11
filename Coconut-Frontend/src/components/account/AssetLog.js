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
`;

const AccountNumber = styled.div`
 font-size: 14px;
 color: #666;
 margin-bottom: 24px;
 display: flex;
 align-items: center;
 gap: 8px;
`;

const Balance = styled.div`
 font-size: 32px;
 font-weight: 600;
 color: #333;
 margin-bottom: 8px;
`;

const BalanceChange = styled.div`
 font-size: 14px;
 color: #666;
 margin-bottom: 32px;
`;

const TimePeriod = styled.div`
 display: flex;
 gap: 12px;
 margin-bottom: 40px;
`;

const TimeButton = styled.button`
 padding: 8px 16px;
 border-radius: 20px;
 background: ${props => props.active ? '#F8F9FA' : 'transparent'};
 border: 1px solid ${props => props.active ? '#E5E8EB' : '#E5E8EB'};
 color: ${props => props.active ? '#333' : '#666'};
 font-size: 14px;
 cursor: pointer;
`;

function AssetLog() {
 return (
   <>
     <GlobalStyle />
     <Container>
       <AccountNumber>
         토스증권 138-01-066930
       </AccountNumber>
       
       <Balance>0원</Balance>
       <BalanceChange>지난주보다 0원 (0%)</BalanceChange>

       <TimePeriod>
         <TimeButton active>1주</TimeButton>
         <TimeButton>1달</TimeButton>
         <TimeButton>3달</TimeButton>
         <TimeButton>1년</TimeButton>
       </TimePeriod>

       {/* Add more content as needed */}
     </Container>
   </>
 );
}

export default AssetLog;