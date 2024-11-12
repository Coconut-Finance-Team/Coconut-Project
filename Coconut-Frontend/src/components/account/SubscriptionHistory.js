import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Container = styled.div`
  padding: 40px 0;
  background: #ffffff;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 32px;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 12px;
`;

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CustomDatePicker = styled(DatePicker)`
  padding: 8px 12px;
  border: 1px solid #E5E8EB;
  border-radius: 8px;
  font-size: 14px;
  width: 120px;
`;

const SubscriptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SubscriptionCard = styled.div`
  background: #ffffff;
  border: 1px solid #E5E8EB;
  border-radius: 12px;
  padding: 24px;
`;

const CompanyInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CompanyName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const Status = styled.div`
  font-size: 14px;
  color: ${props => {
    switch (props.status) {
      case '청약완료': return '#00C073';
      case '배정확정': return '#4174F6';
      case '환불완료': return '#666666';
      default: return '#333333';
    }
  }};
  font-weight: 500;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 14px;
  color: #666;
  
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

function SubscriptionHistory() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // 샘플 데이터
  const subscriptions = [
    {
      id: 1,
      companyName: '주식회사 에이펙스',
      status: '청약완료',
      date: '2024.10.24',
      quantity: '50주',
      amount: '400,000원',
      refundDate: '2024.10.28',
      listingDate: '2024.11.01'
    },
    {
      id: 2,
      companyName: '(주)쓰리빌리언',
      status: '배정확정',
      date: '2024.11.05',
      quantity: '30주',
      amount: '300,000원',
      refundDate: '2024.11.08',
      listingDate: '2024.11.14'
    }
  ];

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (!startDate || !endDate) return true;
    const subDate = new Date(sub.date.replace(/\./g, '-'));
    return subDate >= startDate && subDate <= endDate;
  });

  return (
    <Container>
      <Title>청약내역</Title>
      
      <DatePickerWrapper>
        <DateRangeContainer>
          <CustomDatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy.MM.dd"
            placeholderText="시작일"
          />
          <span>~</span>
          <CustomDatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy.MM.dd"
            placeholderText="종료일"
          />
        </DateRangeContainer>
      </DatePickerWrapper>

      <SubscriptionList>
        {filteredSubscriptions.map(subscription => (
          <SubscriptionCard key={subscription.id}>
            <CompanyInfo>
              <CompanyName>{subscription.companyName}</CompanyName>
              <Status status={subscription.status}>{subscription.status}</Status>
            </CompanyInfo>
            <DetailRow>
              <span>청약일자</span>
              <span>{subscription.date}</span>
            </DetailRow>
            <DetailRow>
              <span>청약수량</span>
              <span>{subscription.quantity}</span>
            </DetailRow>
            <DetailRow>
              <span>청약금액</span>
              <span>{subscription.amount}</span>
            </DetailRow>
            <DetailRow>
              <span>환불일자</span>
              <span>{subscription.refundDate}</span>
            </DetailRow>
            <DetailRow>
              <span>상장일자</span>
              <span>{subscription.listingDate}</span>
            </DetailRow>
          </SubscriptionCard>
        ))}
      </SubscriptionList>
    </Container>
  );
}

export default SubscriptionHistory;