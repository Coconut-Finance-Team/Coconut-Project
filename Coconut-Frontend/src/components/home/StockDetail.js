import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import StockChart from './StockChart';

// Stock data for development
const mockStockData = {
  '005930': { name: '삼성전자', price: 72000, code: '005930' },
  '000660': { name: 'SK하이닉스', price: 83000, code: '000660' },
  '035420': { name: '네이버', price: 192000, code: '035420' }
};

// Styled Components
const Container = styled.div`
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 16px;
  font-family: 'Noto Sans KR', sans-serif;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 8px;
    gap: 12px;
  }
`;

const StockInfoContainer = styled.div`
  flex: 3;
  background: #ffffff;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const OrderBoxContainer = styled.div`
  flex: 1;
  min-width: 320px;
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #333;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StockTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const StockCode = styled.span`
  font-size: 14px;
  color: #8b95a1;
`;

const StockPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 16px 0;
`;

const Tags = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tag = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  background-color: #f2f2f2;
  border-radius: 12px;
  color: #8b95a1;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 450px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 20px 0;
  padding: 16px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    height: 350px;
    padding: 8px;
  }
`;

const OrderTypeContainer = styled.div`
  display: flex;
  background: #F2F4F6;
  border-radius: 14px;
  padding: 4px;
  height: 48px;
`;

const OrderTypeButton = styled.button`
  flex: 1;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  background: ${(props) => (props.active ? '#fff' : 'transparent')};
  color: ${(props) => (props.active ? '#333' : '#8B95A1')};
  cursor: pointer;
  box-shadow: ${(props) => (props.active ? '0px 1px 3px rgba(0, 0, 0, 0.1)' : 'none')};
  transition: all 0.2s ease;
`;

const PriceTypeContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;

  button {
    flex: 1;
    height: 48px;
    padding: 0;
    border: none;
    border-radius: 14px;
    background: #F2F4F6;
    font-size: 15px;
    color: #8B95A1;
    cursor: pointer;

    &.active {
      color: #333;
    }
  }
`;

const PriceInput = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  background: #F2F4F6;
  border-radius: 14px;
  padding: 0 16px;

  input {
    width: 100%;
    border: none;
    background: transparent;
    font-size: 15px;
    text-align: right;
    color: #333;
    
    &:focus {
      outline: none;
    }
  }

  span {
    color: #333;
    margin-left: 4px;
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 48px;

  span {
    font-size: 15px;
    color: #333;
    min-width: 40px;
  }
`;

const QuantityInputContainer = styled.div`
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  background: #F2F4F6;
  border-radius: 14px;
  padding: 0 8px;

  input {
    width: 100%;
    border: none;
    background: transparent;
    font-size: 15px;
    text-align: right;
    color: #333;
    padding: 0 8px;
    
    &:focus {
      outline: none;
    }
  }

  button {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: #8B95A1;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #F2F4F6;
  border-bottom: 1px solid #F2F4F6;
  
  div {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
  }
`;

const OrderButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 14px;
  background: ${(props) => (props.buy ? '#FF4D4D' : '#4D4DFF')};
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => (props.buy ? '#FF3B3B' : '#3B4DFF')};
  }
`;

const TableContainer = styled.div`
  margin-top: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 16px;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;


function StockDetail() {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState('buy');
  const [orderPrice, setOrderPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [primaryAccountId, setPrimaryAccountId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('jwtToken');
      console.log('저장된 토큰:', token);

      if (!token) {
        console.log('토큰이 없습니다. 로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('받아온 사용자 정보:', response.data);
        const accountId = response.data.primaryAccountId;
        console.log('Primary Account ID:', accountId);
        
        if (accountId) {
          setPrimaryAccountId(accountId);
        } else {
          console.log('계좌 정보가 없습니다.');
          alert('주문을 위해서는 계좌가 필요합니다.');
          navigate('/account');
        }

      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        console.error('에러 상세:', error.response?.data);
        if (error.response?.status === 401) {
          console.log('토큰이 만료되었거나 유효하지 않습니다.');
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleOrder = async () => {
    if (!primaryAccountId) {
      alert('계좌 정보가 필요합니다.');
      return;
    }

    if (quantity <= 0) {
      alert('주문 수량을 입력해주세요.');
      return;
    }

    if (orderPrice <= 0) {
      alert('주문 가격을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      console.log('주문 시작 - Account ID:', primaryAccountId);

      const orderDTO = {
        stockName: stockId,
        stockCode: stockId,
        orderQuantity: Number(quantity),
        orderPrice: Number(orderPrice),
      };

      console.log('주문 데이터:', orderDTO);

      const response = await axios.post(
        `http://localhost:8080/api/v1/${orderType}-order`,
        orderDTO,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('주문 응답:', response.data);
      
      if (response.status === 200) {
        alert(`${quantity}주 ${orderType === 'buy' ? '매수' : '매도'} 주문이 완료되었습니다.`);
        setQuantity(0);
      }
    } catch (error) {
      console.error('주문 처리 실패:', error);
      console.error('에러 상세:', error.response?.data);
      
      if (error.response?.status === 400 && error.response.data.code === 'INSUFFICIENT_FUNDS') {
        alert('잔액이 부족합니다.');
      } else {
        alert(error.response?.data?.message || '주문 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {!primaryAccountId ? (
        <div>계좌 정보를 불러오는 중...</div>
      ) : (
        <OrderBoxContainer>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0' }}>주문하기</h3>

          <OrderTypeContainer>
            <OrderTypeButton
              active={orderType === 'buy'}
              onClick={() => {
                setOrderType('buy');
                setQuantity(0);
              }}
            >
              매수
            </OrderTypeButton>
            <OrderTypeButton
              active={orderType === 'sell'}
              onClick={() => {
                setOrderType('sell');
                setQuantity(0);
              }}
            >
              매도
            </OrderTypeButton>
          </OrderTypeContainer>

          <PriceInput>
            <input
              type="number"
              value={orderPrice}
              onChange={(e) => setOrderPrice(Number(e.target.value))}
              placeholder="주문 가격 입력"
              min="0"
            />
            <span>원</span>
          </PriceInput>

          <QuantityContainer>
            <span>수량</span>
            <QuantityInputContainer>
              <button onClick={() => setQuantity(Math.max(0, quantity - 1))}>-</button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                placeholder="주문 수량 입력"
                min="0"
              />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </QuantityInputContainer>
          </QuantityContainer>

          <InfoList>
            <div>
              <span>총 주문 금액</span>
              <span>{(orderPrice * quantity).toLocaleString()}원</span>
            </div>
          </InfoList>

          <OrderButton
            onClick={handleOrder}
            buy={orderType === 'buy'}
            disabled={loading}
          >
            {loading ? '처리중...' : orderType === 'buy' ? '매수' : '매도'}
          </OrderButton>
        </OrderBoxContainer>
      )}
    </Container>
  );
}

export default StockDetail;