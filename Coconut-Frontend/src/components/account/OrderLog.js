import React from 'react';
import styled from 'styled-components';

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

const TabsContainer = styled.div`
  margin-bottom: 24px;
  border-bottom: 1px solid #E5E8EB;
`;

const TabList = styled.div`
  display: flex;
  gap: 24px;
`;

const Tab = styled.button`
  padding: 12px 0;
  color: ${props => props.active ? '#333' : '#666'};
  font-size: 15px;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 2px;
    background: ${props => props.active ? '#333' : 'transparent'};
  }
`;

const SubTabList = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 24px;
`;

const SubTab = styled.button`
  color: ${props => props.active ? '#333' : '#666'};
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const PeriodSelector = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #F8F9FA;
  border: 1px solid #E5E8EB;
  border-radius: 8px;
  padding: 8px 12px;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 32px;

  &::after {
    content: '▼';
    font-size: 10px;
  }
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderCard = styled.div`
  background: #F8F9FA;
  border: 1px solid #E5E8EB;
  border-radius: 12px;
  padding: 20px;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const StockName = styled.div`
  color: #333;
  font-size: 16px;
  font-weight: 500;
`;

const OrderStatus = styled.div`
  font-size: 14px;
  color: ${props => props.color || '#666'};
`;

const OrderDetail = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
`;

function OrderLog() {
  const orders = [
    {
      id: 1,
      stockName: "mm.dd",
      status: "구매불가",
      quantity: "1주",
      type: "보유수량",
      color: "#ff4747"
    },
    {
      id: 2,
      stockName: "mm.dd",
      status: "매수가능",
      quantity: "1주",
      type: "보유수량",
      color: "#4788ff"
    },
    {
      id: 3,
      stockName: "mm.dd",
      status: "주문완료",
      quantity: "1주",
      type: "보유수량",
      color: "#00c073"
    }
  ];

  return (
    <Container>
      <Title>주문내역</Title>
      
      <TabsContainer>
        <TabList>
          <Tab active>전체</Tab>
          <Tab>주간주문</Tab>
        </TabList>
        <SubTabList>
          <SubTab active>국내주식</SubTab>
          <SubTab>해외주식</SubTab>
          <SubTab>채권</SubTab>
        </SubTabList>
      </TabsContainer>

      <PeriodSelector>
        확인할 주문 2024년 1월
      </PeriodSelector>

      <OrderList>
        {orders.map(order => (
          <OrderCard key={order.id}>
            <OrderInfo>
              <StockName>{order.stockName}</StockName>
              <OrderStatus color={order.color}>{order.status}</OrderStatus>
            </OrderInfo>
            <OrderDetail>
              <span>{order.type}</span>
              <span>{order.quantity}</span>
            </OrderDetail>
          </OrderCard>
        ))}
      </OrderList>
    </Container>
  );
}

export default OrderLog;