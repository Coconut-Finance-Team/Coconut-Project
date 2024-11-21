import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import StockChart from './StockChart';
import skLogo from '../../assets/sk.png';
import samsungLogo from '../../assets/samsung.png';
import naverLogo from '../../assets/naver.png';

// 가상 차트 데이터 정의
const mockChartData = [
  { time: '1', open: 17400, high: 17800, low: 17300, close: 17750, volume: 356971 },
  { time: '2', open: 17750, high: 18200, low: 17600, close: 18050, volume: 423452 },
  { time: '3', open: 18050, high: 18500, low: 17900, close: 18400, volume: 512345 },
  { time: '4', open: 18400, high: 18600, low: 18000, close: 18100, volume: 602345 },
  { time: '5', open: 18100, high: 18300, low: 17800, close: 17950, volume: 669234 },
];

// 매도 호가 데이터
const mockAskPrices = [
  { price: 84300, quantity: 2358 },
  { price: 84200, quantity: 1567 },
  { price: 84100, quantity: 3242 },
  { price: 84000, quantity: 4521 },
  { price: 83900, quantity: 2876 },
];

// 매수 호가 데이터
const mockBidPrices = [
  { price: 83800, quantity: 3654 },
  { price: 83700, quantity: 2987 },
  { price: 83600, quantity: 1876 },
  { price: 83500, quantity: 2543 },
  { price: 83400, quantity: 1932 },
];

// 체결 내역 데이터
const mockTradeData = [
  { price: 84000, quantity: 121, change: 1.98, volume: 1873750, time: '13:37:12' },
  { price: 83900, quantity: 235, change: 1.86, volume: 1873629, time: '13:37:08' },
  { price: 83900, quantity: 95, change: 1.86, volume: 1873394, time: '13:37:05' },
  { price: 84000, quantity: 178, change: 1.98, volume: 1873299, time: '13:37:01' },
  { price: 83800, quantity: 324, change: 1.74, volume: 1873121, time: '13:36:58' },
];

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

const StockLogo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
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
  text-align: ${(props) => props.align || 'left'};
  padding: 12px 8px;
  color: #8b95a1;
  font-weight: 400;
  font-size: 13px;
`;

const Td = styled.td`
  padding: 12px 8px;
  font-size: 14px;
  color: ${(props) => props.color || '#333'};
  text-align: ${(props) => props.align || 'left'};
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

function StockDetail() {
  const { stockId } = useParams(); // URL에서 stockId를 받아옵니다.

  // 주식 데이터 정의
  const stocksData = {
    skhynix: { name: 'SK하이닉스', price: 3140, logo: skLogo, code: '000660' },
    samsung: { name: '삼성전자', price: 72000, logo: samsungLogo, code: '005930' },
    naver: { name: '네이버', price: 702, logo: naverLogo, code: '035420' },
  };

  const stock = stocksData[stockId];

  const [orderType, setOrderType] = useState('buy');
  const [priceType, setPriceType] = useState('limit');
  const [orderPrice, setOrderPrice] = useState(stock ? stock.price : 0);
  const [quantity, setQuantity] = useState(0);
  const [account, setAccount] = useState({
    balance: 10000000, // 1천만원
    stocks: {
      [stock?.code]: {
        quantity: 100,
        averagePrice: 83000,
      },
    },
  });

  const currentStock = account.stocks[stock?.code] || { quantity: 0, averagePrice: 0 };

  // 주문 가능 수량 계산
  const getMaxQuantity = () => {
    return orderType === 'buy'
        ? Math.floor(account.balance / orderPrice)
        : currentStock.quantity;
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
      setAccount((prev) => {
        const newTotalQty = currentStock.quantity + quantity;
        const newAveragePrice =
            (currentStock.quantity * currentStock.averagePrice + quantity * orderPrice) / newTotalQty;

        return {
          ...prev,
          balance: prev.balance - totalAmount,
          stocks: {
            ...prev.stocks,
            [stock.code]: {
              quantity: newTotalQty,
              averagePrice: newAveragePrice,
            },
          },
        };
      });

      alert(`${quantity}주 매수 주문이 완료되었습니다.`);
    } else if (orderType === 'sell') {
      if (quantity > currentStock.quantity) {
        alert('보유 수량이 부족합니다.');
        return;
      }

      // 판매 처리
      setAccount((prev) => {
        const newQty = currentStock.quantity - quantity;

        return {
          ...prev,
          balance: prev.balance + totalAmount,
          stocks: {
            ...prev.stocks,
            [stock.code]: {
              quantity: newQty,
              averagePrice: newQty === 0 ? 0 : currentStock.averagePrice,
            },
          },
        };
      });

      alert(`${quantity}주 매도 주문이 완료되었습니다.`);
    }

    // 주문 완료 후 초기화
    setQuantity(0);
  };

  return (
      <Container>
        {stock && (
            <>
              <StockInfoContainer>
                <Header>
                  <StockLogo src={stock.logo} alt={stock.name} />
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

                <ChartContainer>
                  <StockChart data={mockChartData} />
                </ChartContainer>

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
                            {trade.change >= 0 ? '+' : ''}
                            {trade.change}%
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
                  <input type="text" value={orderPrice.toLocaleString()} readOnly />
                  <span>원</span>
                </PriceInput>

                <QuantityContainer>
                  <span>수량</span>
                  <QuantityInputContainer>
                    <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>
                    <input
                        type="number"
                        value={quantity}
                        min="0"
                        step="1"
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
                    <span>{currentStock.quantity}주</span>
                  </div>
                  <div>
                    <span>내 주식 평균가</span>
                    <span>{currentStock.averagePrice.toLocaleString()}원</span>
                  </div>
                  <div>
                    <span>{orderType === 'buy' ? '주문 가능 금액' : '보유 수량'}</span>
                    <span>
                  {orderType === 'buy'
                      ? `${account.balance.toLocaleString()}원`
                      : `${currentStock.quantity}주`}
                </span>
                  </div>
                  <div>
                    <span>총 주문 금액</span>
                    <span>{(orderPrice * quantity).toLocaleString()}원</span>
                  </div>
                </InfoList>

                <OrderButton onClick={handleOrder} buy={orderType === 'buy'}>
                  {orderType === 'buy' ? '구매하기' : '판매하기'}
                </OrderButton>
              </OrderBoxContainer>
            </>
        )}
      </Container>
  );
}

export default StockDetail;
