import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 16px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const StockInfoContainer = styled.div`
  flex: 3;
  background: #ffffff;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 16px;
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

const StockLogo = styled.div`
  width: 48px;
  height: 48px;
  background-color: #e0e0e0;
  border-radius: 50%;
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
  height: 300px;
  background-color: #f9f9f9;
  border: 2px solid #d0d0d0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 18px;
`;

const TableContainer = styled.div`
  margin-top: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 16px;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: ${props => props.align || 'left'};
  padding: 12px 8px;
  color: #8b95a1;
  font-weight: 400;
  font-size: 13px;
`;

const Td = styled.td`
  padding: 12px 8px;
  font-size: 14px;
  color: ${props => props.color || '#333'};
  text-align: ${props => props.align || 'left'};
  border-top: 1px solid #f2f2f2;
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
  background: ${props => props.active ? '#fff' : 'transparent'};
  color: ${props => props.active ? '#333' : '#8B95A1'};
  cursor: pointer;
  box-shadow: ${props => props.active ? '0px 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};
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
  width: 90%;
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

const PercentageContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const PercentButton = styled.button`
  flex: 1;
  height: 48px;
  border: 1px solid #E5E8EB;
  border-radius: 10px;
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #F8F9FA;
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
  background: #FF4D4D;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #FF3B3B;
  }
`;

const mockAskPrices = [
  { price: 63500, quantity: 1250 },
  { price: 63400, quantity: 850 },
  { price: 63300, quantity: 1500 },
  { price: 63200, quantity: 2000 },
  { price: 63100, quantity: 1800 },
];

const mockBidPrices = [
  { price: 63000, quantity: 2100 },
  { price: 62900, quantity: 1600 },
  { price: 62800, quantity: 1400 },
  { price: 62700, quantity: 900 },
  { price: 62600, quantity: 1100 },
];

// 모의 거래 데이터
const mockTradeData = [
  { price: 63200, quantity: 50, change: -1.58, volume: 873750, time: '13:37:12' },
  { price: 63300, quantity: 35, change: -1.42, volume: 873700, time: '13:37:08' },
  { price: 63100, quantity: 80, change: -1.65, volume: 873665, time: '13:37:05' },
  { price: 63400, quantity: 25, change: -1.27, volume: 873585, time: '13:37:01' },
  { price: 63200, quantity: 60, change: -1.58, volume: 873560, time: '13:36:58' },
];

function StockDetail() {
  const location = useLocation();
  const stock = location.state?.stock;
  
  const [orderType, setOrderType] = useState('buy');
  const [priceType, setPriceType] = useState('limit');
  const [orderPrice, setOrderPrice] = useState(stock?.price || 63300);
  const [quantity, setQuantity] = useState(0);
  const [account, setAccount] = useState({
    balance: 10000000, // 1천만원
    stocks: {
      [stock?.code || '064350']: {
        quantity: 100,
        averagePrice: 63000
      }
    }
  });

  // 주문 가능 수량 계산
  const getMaxQuantity = () => {
    if (orderType === 'buy') {
      return Math.floor(account.balance / orderPrice);
    } else {
      return account.stocks[stock?.code || '064350'].quantity;
    }
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (value) => {
    const maxQty = getMaxQuantity();
    const newQty = Math.max(0, Math.min(value, maxQty));
    setQuantity(newQty);
  };

  // 퍼센트 버튼 핸들러
  const handlePercentage = (percent) => {
    const maxQty = getMaxQuantity();
    const newQty = Math.floor(maxQty * (percent / 100));
    setQuantity(newQty);
  };

  // 주문 처리
  const handleOrder = () => {
    if (quantity === 0) {
      alert('주문 수량을 입력해주세요.');
      return;
    }

    const totalAmount = orderPrice * quantity;

    if (orderType === 'buy') {
      if (totalAmount > account.balance) {
        alert('잔액이 부족합니다.');
        return;
      }

      // 구매 처리
      setAccount(prev => {
        const currentStockQty = prev.stocks[stock.code]?.quantity || 0;
        const currentStockAvg = prev.stocks[stock.code]?.averagePrice || 0;
        const newTotalQty = currentStockQty + quantity;
        const newAveragePrice = 
          ((currentStockQty * currentStockAvg) + (quantity * orderPrice)) / newTotalQty;

        return {
          balance: prev.balance - totalAmount,
          stocks: {
            ...prev.stocks,
            [stock.code]: {
              quantity: newTotalQty,
              averagePrice: newAveragePrice
            }
          }
        };
      });

      alert(`${quantity}주 매수 주문이 완료되었습니다.`);
    } else if (orderType === 'sell') {
      if (quantity > account.stocks[stock.code].quantity) {
        alert('보유 수량이 부족합니다.');
        return;
      }

      // 판매 처리
      setAccount(prev => {
        const newQty = prev.stocks[stock.code].quantity - quantity;
        return {
          balance: prev.balance + totalAmount,
          stocks: {
            ...prev.stocks,
            [stock.code]: {
              quantity: newQty,
              averagePrice: newQty === 0 ? 0 : prev.stocks[stock.code].averagePrice
            }
          }
        };
      });

      alert(`${quantity}주 매도 주문이 완료되었습니다.`);
    }

    // 주문 완료 후 초기화
    setQuantity(0);
  };

  return (
    <Container>
      <StockInfoContainer>
        <Header>
          <StockLogo />
          <StockInfo>
            <StockTitle>{stock.name}</StockTitle>
            <StockCode>{stock.code}</StockCode>
          </StockInfo>
        </Header>
        <StockPrice>{stock.price.toLocaleString()}원</StockPrice>
        <Tags>
          <Tag>차트</Tag>
          <Tag>호가</Tag>
          <Tag>종목정보</Tag>
        </Tags>
        
        <ChartContainer>차트</ChartContainer>
        
        {/* 호가 정보 */}
        <TableContainer>
          <TableHeader>
            <div>호가 정보</div>
          </TableHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <DataTable style={{ width: '48%' }}>
              <thead>
                <tr>
                  <Th>매도호가</Th>
                  <Th align="right">잔량</Th>
                </tr>
              </thead>
              <tbody>
                {mockAskPrices.map((item, i) => (
                  <tr key={i}>
                    <Td 
                      color={orderPrice === item.price ? '#FF4D4D' : undefined}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setOrderPrice(item.price)}
                    >
                      {item.price.toLocaleString()}원
                    </Td>
                    <Td align="right">{item.quantity.toLocaleString()}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <DataTable style={{ width: '48%' }}>
              <thead>
                <tr>
                  <Th>매수호가</Th>
                  <Th align="right">잔량</Th>
                </tr>
              </thead>
              <tbody>
                {mockBidPrices.map((item, i) => (
                  <tr key={i}>
                    <Td 
                      color={orderPrice === item.price ? '#FF4D4D' : undefined}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setOrderPrice(item.price)}
                    >
                      {item.price.toLocaleString()}원
                    </Td>
                    <Td align="right">{item.quantity.toLocaleString()}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </div>
        </TableContainer>

        {/* 체결 내역 */}
        <TableContainer>
          <TableHeader>
            <div>일별 · 실시간 시세</div>
            <div>실시간</div>
          </TableHeader>
          <DataTable>
            <thead>
              <tr>
                <Th>체결가</Th>
                <Th align="right">체결량(주)</Th>
                <Th align="right">등락률</Th>
                <Th align="right">거래량(주)</Th>
                <Th align="right">시간</Th>
              </tr>
            </thead>
            <tbody>
              {mockTradeData.map((trade, i) => (
                <tr key={i}>
                  <Td>{trade.price.toLocaleString()}원</Td>
                  <Td align="right">{trade.quantity}</Td>
                  <Td align="right" color={trade.change >= 0 ? '#FF4D4D' : '#4D4DFF'}>
                    {trade.change >= 0 ? '+' : ''}{trade.change}%
                  </Td>
                  <Td align="right">{trade.volume.toLocaleString()}</Td>
                  <Td align="right">{trade.time}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </TableContainer>
      </StockInfoContainer>

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
            구매
          </OrderTypeButton>
          <OrderTypeButton 
            active={orderType === 'sell'} 
            onClick={() => {
              setOrderType('sell');
              setQuantity(0);
            }}
          >
            판매
          </OrderTypeButton>
        </OrderTypeContainer>

        <PriceTypeContainer>
          <button 
            className={priceType === 'limit' ? 'active' : ''} 
            onClick={() => setPriceType('limit')}
          >
            지정가
          </button>
          <button 
            className={priceType === 'market' ? 'active' : ''} 
            onClick={() => setPriceType('market')}
          >
            시장가
          </button>
        </PriceTypeContainer>

        <PriceInput>
          <input 
            type="text" 
            value={orderPrice.toLocaleString()} 
            readOnly 
          />
          <span>원</span>
        </PriceInput>

        <QuantityContainer>
          <span>수량</span>
          <QuantityInputContainer>
            <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
            />
            <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
          </QuantityInputContainer>
        </QuantityContainer>

        <PercentageContainer>
          <PercentButton onClick={() => handlePercentage(10)}>10%</PercentButton>
          <PercentButton onClick={() => handlePercentage(25)}>25%</PercentButton>
          <PercentButton onClick={() => handlePercentage(50)}>50%</PercentButton>
          <PercentButton onClick={() => handlePercentage(100)}>최대</PercentButton>
        </PercentageContainer>

        <InfoList>
          <div>
            <span>내 보유량</span>
            <span>{account.stocks[stock.code]?.quantity || 0}주</span>
          </div>
          <div>
            <span>내 주식 평균가</span>
            <span>
              {account.stocks[stock.code]
                ? account.stocks[stock.code].averagePrice.toLocaleString()
                : 0}원
            </span>
          </div>
          <div>
            <span>{orderType === 'buy' ? '주문 가능 금액' : '보유 수량'}</span>
            <span>
              {orderType === 'buy' 
                ? `${account.balance.toLocaleString()}원`
                : `${account.stocks[stock.code]?.quantity || 0}주`}
            </span>
          </div>
          <div>
            <span>총 주문 금액</span>
            <span>{(orderPrice * quantity).toLocaleString()}원</span>
          </div>
        </InfoList>

        <OrderButton 
          onClick={handleOrder}
          style={{
            background: orderType === 'buy' ? '#FF4D4D' : '#4D4DFF'
          }}
        >
          {orderType === 'buy' ? '구매하기' : '판매하기'}
        </OrderButton>
      </OrderBoxContainer>
    </Container>
  );
}

export default StockDetail;



