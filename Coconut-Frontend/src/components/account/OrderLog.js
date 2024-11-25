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
  padding: 25px 50px 0 5px;
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
  margin-bottom: 24px;
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
  cursor: pointer;
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

function OrderLog() {
  const [activeTab, setActiveTab] = useState('전체');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
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

        // 2. 주문내역 가져오기
        console.log('Fetching orders for account:', primaryAccountId);
        const response = await axios.get(`${API_BASE_URL}/account/orders`, {
          headers,
          params: {
            accountId: primaryAccountId,
            type: activeTab !== '전체' ? activeTab : undefined
          }
        });

        console.log('Orders response:', response.data);
        setOrders(response.data || []);

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
  }, [activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case '구매불가': return '#ff4747';
      case '매수가능': return '#4788ff';
      case '주문완료': return '#00c073';
      default: return '#666';
    }
  };

  const formatNumber = (num) => {
    return num?.toLocaleString('ko-KR') || '0';
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>주문내역</Title>

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
        
        <TabsContainer>
          <TabList>
            <Tab active={activeTab === '전체'} onClick={() => setActiveTab('전체')}>전체</Tab>
            <Tab active={activeTab === '주간주문'} onClick={() => setActiveTab('주간주문')}>주간주문</Tab>
          </TabList>
        </TabsContainer>
        
        <PeriodSelector>
          확인할 주문 2024년 1월
        </PeriodSelector>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            로딩중...
          </div>
        ) : (
          <OrderList>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                주문내역이 없습니다.
              </div>
            ) : (
              orders.map((order, index) => (
                <OrderCard key={index} onClick={() => {
                  setSelectedOrder(order);
                  setOrderDetail(order);  // 상세 정보가 별도 API가 아닌 경우
                }}>
                  <OrderInfo>
                    <StockName>{order.date}</StockName>
                    <OrderStatus color={getStatusColor(order.status)}>{order.status}</OrderStatus>
                  </OrderInfo>
                  <OrderDetail>
                    <span>{order.name}</span>
                    <span>{order.quantity}주</span>
                  </OrderDetail>
                </OrderCard>
              ))
            )}
          </OrderList>
        )}

        {selectedOrder && orderDetail && (
          <>
            <Overlay onClick={() => setSelectedOrder(null)} />
            <Modal>
              <DetailRow>
                <DetailLabel>종목명</DetailLabel>
                <DetailValue>{orderDetail.stock_name}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문유형</DetailLabel>
                <DetailValue>{orderDetail.type === 'purchase' ? '매수' : '매도'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문상태</DetailLabel>
                <DetailValue>{orderDetail.order_status}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주당 가격</DetailLabel>
                <DetailValue>{formatNumber(orderDetail.price_per_one)}원</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>총 금액</DetailLabel>
                <DetailValue>{formatNumber(orderDetail.total_price)}원</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문 방식</DetailLabel>
                <DetailValue>{orderDetail.order_type}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문 시간</DetailLabel>
                <DetailValue>{formatDateTime(orderDetail.order_time)}</DetailValue>
              </DetailRow>
              {orderDetail.filled_time && (
                <DetailRow>
                  <DetailLabel>체결 시간</DetailLabel>
                  <DetailValue>{formatDateTime(orderDetail.filled_time)}</DetailValue>
                </DetailRow>
              )}
            </Modal>
          </>
        )}
      </Container>
    </>
  );
}

export default OrderLog;