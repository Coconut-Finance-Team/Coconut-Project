import React, { useState, useEffect } from 'react';
import * as S from './StockDetailStyles';
import StockChart from './StockChart';
import skLogo from '../../assets/sk.png';
import stockData from './stock_data.json';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StockDetail() {
  const [activeTab, setActiveTab] = useState('chart');
  const [timeframe, setTimeframe] = useState('1min');
  const [orderType, setOrderType] = useState('buy');
  const [orderPrice, setOrderPrice] = useState(172500);
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const priceChange = {
    value: -830,
    percent: -0.48
  };

  // API 인터셉터 설정
  useEffect(() => {
    // 응답 인터셉터 추가
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            // 토큰이 만료되었거나 유효하지 않은 경우
            localStorage.removeItem('jwtToken'); // 토큰 제거
            window.location.href = '/login'; // 로그인 페이지로 리다이렉트
          }
          return Promise.reject(error);
        }
    );
  }, []);

  const handleQuantityPercent = (percent) => {
    const maxQuantity = Math.floor(10000000 / orderPrice);
    setQuantity(Math.floor(maxQuantity * (percent / 100)));
  };

  const handleOrder = async () => {
    if (quantity <= 0) {
      alert('주문 수량을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');

      const orderDTO = {
        stockName: 'SK하이닉스', // 백엔드 DTO에 필요한 필드
        stockCode: '000660',    // stockId 대신 실제 종목코드 사용
        orderQuantity: Number(quantity),
        orderPrice: Number(orderPrice)
      };

      const response = await axios.post(
          `http://localhost:8080/api/v1/${orderType}-order`,
          orderDTO,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true // CORS 설정이 필요한 경우 추가
          }
      );

      if (response.status === 200) {
        alert(`${quantity}주 ${orderType === 'buy' ? '매수' : '매도'} 주문이 완료되었습니다.`);
        navigate('/account/assets');
        setQuantity(0);
      }
    } catch (error) {
      console.error('주문 처리 실패:', error);
      if (error.response?.status === 401) {
        alert('로그인이 필요하거나 세션이 만료되었습니다.');
        window.location.href = '/login';
      } else if (error.response?.data?.code === 'NOT_EXIST_ACCOUNT') {
        alert('연결된 계좌가 없습니다. 계좌를 먼저 등록해주세요.');
      } else {
        alert(error.response?.data?.message || '주문 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <S.Container>
        <S.StockInfoContainer>
          <S.Header>
            <S.StockInfo>
              <S.StockLogo src={skLogo} alt="SK하이닉스" />
              <S.StockTitleArea>
                <S.StockTitle>SK하이닉스</S.StockTitle>
                <S.StockCode>000660</S.StockCode>
              </S.StockTitleArea>
            </S.StockInfo>
            <S.PriceArea>
              <S.CurrentPrice $change={priceChange.value}>
                {orderPrice.toLocaleString()}
              </S.CurrentPrice>
              <S.PriceChange $value={priceChange.value}>
                {priceChange.value > 0 ? '+' : ''}{priceChange.value.toLocaleString()}원
                ({priceChange.value > 0 ? '+' : ''}{priceChange.percent.toFixed(2)}%)
              </S.PriceChange>
            </S.PriceArea>
          </S.Header>

          <S.TimeframeButtons>
            <S.TimeButton
                $active={timeframe === '1min'}
                onClick={() => setTimeframe('1min')}
            >
              1분
            </S.TimeButton>
          </S.TimeframeButtons>

          <StockChart data={stockData} />
        </S.StockInfoContainer>

        <S.OrderBoxContainer>
          <S.OrderTypeContainer>
            <S.OrderTypeButton
                $active={orderType === 'buy'}
                $buy={orderType === 'buy'}
                onClick={() => {
                  setOrderType('buy');
                  setQuantity(0);
                }}
                disabled={isLoading}
            >
              매수
            </S.OrderTypeButton>
            <S.OrderTypeButton
                $active={orderType === 'sell'}
                $buy={false}
                onClick={() => {
                  setOrderType('sell');
                  setQuantity(0);
                }}
                disabled={isLoading}
            >
              매도
            </S.OrderTypeButton>
          </S.OrderTypeContainer>

          <S.InputContainer>
            <S.InputLabel>주문가격</S.InputLabel>
            <S.PriceInput>
              <input
                  type="text"
                  value={orderPrice.toLocaleString()}
                  readOnly
              />
              <span>원</span>
            </S.PriceInput>
          </S.InputContainer>

          <S.InputContainer>
            <S.InputLabel>주문수량</S.InputLabel>
            <S.PriceInput>
              <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  disabled={isLoading}
              />
              <span>주</span>
            </S.PriceInput>
            <S.QuantityButtons>
              <S.QuantityButton
                  onClick={() => handleQuantityPercent(10)}
                  disabled={isLoading}
              >
                10%
              </S.QuantityButton>
              <S.QuantityButton
                  onClick={() => handleQuantityPercent(25)}
                  disabled={isLoading}
              >
                25%
              </S.QuantityButton>
              <S.QuantityButton
                  onClick={() => handleQuantityPercent(50)}
                  disabled={isLoading}
              >
                50%
              </S.QuantityButton>
              <S.QuantityButton
                  onClick={() => handleQuantityPercent(100)}
                  disabled={isLoading}
              >
                최대
              </S.QuantityButton>
            </S.QuantityButtons>
          </S.InputContainer>

          <S.OrderSummary>
            <div>
              <span>주문가능금액</span>
              <span>10,000,000원</span>
            </div>
            <div>
              <span>총 주문금액</span>
              <span>{(orderPrice * quantity).toLocaleString()}원</span>
            </div>
          </S.OrderSummary>

          <S.OrderButton
              onClick={handleOrder}
              $buy={orderType === 'buy'}
              $disabled={quantity <= 0 || isLoading}
          >
            {isLoading ? '주문 처리중...' : orderType === 'buy' ? '매수하기' : '매도하기'}
          </S.OrderButton>
        </S.OrderBoxContainer>
      </S.Container>
  );
}

export default StockDetail;