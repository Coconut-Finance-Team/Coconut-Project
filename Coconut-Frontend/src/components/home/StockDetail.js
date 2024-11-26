import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StockChart from './StockChart';
import skLogo from '../../assets/sk.png';
import samsungLogo from '../../assets/samsung.png';
import naverLogo from '../../assets/naver.png';
import * as S from './StockDetailStyles';

const mockAskPrices = [
  { price: 84300, quantity: 2358 },
  { price: 84200, quantity: 1567 },
  { price: 84100, quantity: 3242 },
  { price: 84000, quantity: 4521 },
  { price: 83900, quantity: 2876 },
];

const mockBidPrices = [
  { price: 83800, quantity: 3654 },
  { price: 83700, quantity: 2987 },
  { price: 83600, quantity: 1876 },
  { price: 83500, quantity: 2543 },
  { price: 83400, quantity: 1932 },
];

const mockTradeData = [
  { price: 84000, quantity: 121, change: 1.98, volume: 1873750, time: '13:37:12' },
  { price: 83900, quantity: 235, change: 1.86, volume: 1873629, time: '13:37:08' },
  { price: 83900, quantity: 95, change: 1.86, volume: 1873394, time: '13:37:05' },
  { price: 84000, quantity: 178, change: 1.98, volume: 1873299, time: '13:37:01' },
  { price: 83800, quantity: 324, change: 1.74, volume: 1873121, time: '13:36:58' },
];

const stocksData = {
  '000660': { 
    name: 'SK하이닉스', 
    price: 3140, 
    logo: skLogo, 
    code: '000660',
    market: 'KOSPI'
  },
  '005930': { 
    name: '삼성전자', 
    price: 72000, 
    logo: samsungLogo, 
    code: '005930',
    market: 'KOSPI'
  },
  '035420': { 
    name: '네이버', 
    price: 702, 
    logo: naverLogo, 
    code: '035420',
    market: 'KOSPI'
  },
};

function StockDetail() {
  const { stockId } = useParams();
  const [orderType, setOrderType] = useState('buy');
  const [priceType, setPriceType] = useState('limit');
  const [orderPrice, setOrderPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [account, setAccount] = useState({
    balance: 10000000,
    stocks: {},
  });

  const stock = stocksData[stockId];

  // stock이 있을 때만 초기 가격 설정
  useEffect(() => {
    if (stock) {
      setOrderPrice(stock.price);
    }
  }, [stock]);

  if (!stockId) {
    return (
      <S.Container>
        <S.ErrorMessage>잘못된 접근입니다.</S.ErrorMessage>
      </S.Container>
    );
  }

  if (!stock) {
    return (
      <S.Container>
        <S.ErrorMessage>존재하지 않는 종목입니다.</S.ErrorMessage>
      </S.Container>
    );
  }

  const currentStock = account.stocks[stock.code] || { quantity: 0, averagePrice: 0 };

  const getMaxQuantity = () => {
    return orderType === 'buy'
      ? Math.floor(account.balance / orderPrice)
      : currentStock.quantity;
  };

  const handleQuantityChange = (value) => {
    const maxQty = getMaxQuantity();
    const newQty = Math.max(0, Math.min(value, maxQty));
    setQuantity(newQty);
  };

  const handlePercentage = (percent) => {
    const maxQty = getMaxQuantity();
    const newQty = Math.floor(maxQty * (percent / 100));
    setQuantity(newQty);
  };

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

    setQuantity(0);
  };

  return (
    <S.Container>
      <S.StockInfoContainer>
        <S.Header>
          <S.StockLogo src={stock.logo} alt={stock.name} />
          <S.StockInfo>
            <S.StockTitle>{stock.name}</S.StockTitle>
            <S.StockCode>{stock.code}</S.StockCode>
          </S.StockInfo>
        </S.Header>
        <S.StockPrice>{stock.price.toLocaleString()}원</S.StockPrice>
        <S.Tags>
          <S.Tag>차트</S.Tag>
          <S.Tag>호가</S.Tag>
          <S.Tag>종목정보</S.Tag>
        </S.Tags>

        <S.ChartContainer>
          <StockChart stockId={stock.code} />
        </S.ChartContainer>

        <S.TableContainer>
          <S.TableHeader>
            <div>호가 정보</div>
          </S.TableHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <S.DataTable style={{ width: '48%' }}>
              <thead>
                <tr>
                  <S.Th>매도호가</S.Th>
                  <S.Th align="right">잔량</S.Th>
                </tr>
              </thead>
              <tbody>
                {mockAskPrices.map((item, i) => (
                  <tr key={i}>
                    <S.Td
                      color={orderPrice === item.price ? '#FF4D4D' : undefined}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setOrderPrice(item.price)}
                    >
                      {item.price.toLocaleString()}원
                    </S.Td>
                    <S.Td align="right">{item.quantity.toLocaleString()}</S.Td>
                  </tr>
                ))}
              </tbody>
            </S.DataTable>
            <S.DataTable style={{ width: '48%' }}>
              <thead>
                <tr>
                  <S.Th>매수호가</S.Th>
                  <S.Th align="right">잔량</S.Th>
                </tr>
              </thead>
              <tbody>
                {mockBidPrices.map((item, i) => (
                  <tr key={i}>
                    <S.Td
                      color={orderPrice === item.price ? '#FF4D4D' : undefined}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setOrderPrice(item.price)}
                    >
                      {item.price.toLocaleString()}원
                    </S.Td>
                    <S.Td align="right">{item.quantity.toLocaleString()}</S.Td>
                  </tr>
                ))}
              </tbody>
            </S.DataTable>
          </div>
        </S.TableContainer>

        <S.TableContainer>
          <S.TableHeader>
            <div>일별 · 실시간 시세</div>
            <div>실시간</div>
          </S.TableHeader>
          <S.DataTable>
            <thead>
              <tr>
                <S.Th>체결가</S.Th>
                <S.Th align="right">체결량(주)</S.Th>
                <S.Th align="right">등락률</S.Th>
                <S.Th align="right">거래량(주)</S.Th>
                <S.Th align="right">시간</S.Th>
              </tr>
            </thead>
            <tbody>
              {mockTradeData.map((trade, i) => (
                <tr key={i}>
                  <S.Td>{trade.price.toLocaleString()}원</S.Td>
                  <S.Td align="right">{trade.quantity}</S.Td>
                  <S.Td align="right" color={trade.change >= 0 ? '#FF4D4D' : '#4D4DFF'}>
                    {trade.change >= 0 ? '+' : ''}
                    {trade.change}%
                  </S.Td>
                  <S.Td align="right">{trade.volume.toLocaleString()}</S.Td>
                  <S.Td align="right">{trade.time}</S.Td>
                </tr>
              ))}
            </tbody>
          </S.DataTable>
        </S.TableContainer>
      </S.StockInfoContainer>

      <S.OrderBoxContainer>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0' }}>주문하기</h3>

        <S.OrderTypeContainer>
          <S.OrderTypeButton
            active={orderType === 'buy'}
            onClick={() => {
              setOrderType('buy');
              setQuantity(0);
            }}
          >
            구매
          </S.OrderTypeButton>
          <S.OrderTypeButton
            active={orderType === 'sell'}
            onClick={() => {
              setOrderType('sell');
              setQuantity(0);
            }}
          >
            판매
          </S.OrderTypeButton>
        </S.OrderTypeContainer>

        <S.PriceTypeContainer>
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
        </S.PriceTypeContainer>

        <S.PriceInput>
          <input type="text" value={orderPrice.toLocaleString()} readOnly />
          <span>원</span>
        </S.PriceInput>

        <S.QuantityContainer>
          <span>수량</span>
          <S.QuantityInputContainer>
            <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>
            <input
              type="number"
              value={quantity}
              min="0"
              step="1"
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
            />
            <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
          </S.QuantityInputContainer>
        </S.QuantityContainer>

        <S.PercentageContainer>
          <S.PercentButton onClick={() => handlePercentage(10)}>10%</S.PercentButton>
          <S.PercentButton onClick={() => handlePercentage(25)}>25%</S.PercentButton>
          <S.PercentButton onClick={() => handlePercentage(50)}>50%</S.PercentButton>
          <S.PercentButton onClick={() => handlePercentage(100)}>최대</S.PercentButton>
        </S.PercentageContainer>

        <S.InfoList>
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
        </S.InfoList>

        <S.OrderButton onClick={handleOrder} buy={orderType === 'buy'}>
          {orderType === 'buy' ? '구매하기' : '판매하기'}
        </S.OrderButton>
      </S.OrderBoxContainer>
    </S.Container>
  );
}

export default StockDetail;
