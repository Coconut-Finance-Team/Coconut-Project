import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import * as S from './StockDetailStyles';

function StockDetail() {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('1min');
  const [isLoading, setIsLoading] = useState(true);
  const [orderType, setOrderType] = useState('buy');
  const [orderPrice, setOrderPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [primaryAccountId, setPrimaryAccountId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const wsRef = useRef(null);
  const chartRef = useRef(null);

  // 사용자 인증 체크
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
      fetchUserData(token);
    }
  }, []);

  // 차트 데이터 가공
  const processChartData = (data) => {
    return data.map(item => {
      const open = parseFloat(item.openPrice);
      const close = parseFloat(item.currentPrice);
      const high = parseFloat(item.highPrice);
      const low = parseFloat(item.lowPrice);

      return {
        time: new Date(item.time).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        open,
        high,
        low,
        close,
        volume: parseFloat(item.contingentVol),
        shadowHigh: high,
        shadowLow: low,
        barLength: Math.abs(open - close),
        color: close >= open ? '#ff4747' : '#4788ff'
      };
    });
  };

  // 과거 데이터 로드
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/stock/${stockId}/charts/${timeframe}`);
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const formattedData = processChartData(data);
          setChartData(formattedData);
          setOrderPrice(formattedData[formattedData.length - 1].close);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [stockId, timeframe]);

  // WebSocket 연결
  useEffect(() => {
    if (isLoading) return;

    const connectWebSocket = () => {
      wsRef.current = new WebSocket(`ws://localhost:8080/ws/stock/${stockId}`);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket Connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          const formattedTime = newData.time.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2');
          
          const processedData = {
            time: formattedTime,
            open: parseFloat(newData.openPrice),
            high: parseFloat(newData.highPrice),
            low: parseFloat(newData.lowPrice),
            close: parseFloat(newData.currentPrice),
            volume: parseFloat(newData.contingentVol),
            shadowHigh: parseFloat(newData.highPrice),
            shadowLow: parseFloat(newData.lowPrice),
            barLength: Math.abs(parseFloat(newData.openPrice) - parseFloat(newData.currentPrice)),
            color: parseFloat(newData.currentPrice) >= parseFloat(newData.openPrice) ? '#ff4747' : '#4788ff'
          };

          setChartData(prevData => {
            const updatedData = [...prevData];
            if (updatedData.length > 0 && updatedData[updatedData.length - 1].time === formattedTime) {
              updatedData[updatedData.length - 1] = processedData;
            } else {
              updatedData.push(processedData);
            }

            // 최대 데이터 포인트 제한
            if (updatedData.length > 100) {
              updatedData.shift();
            }

            return updatedData;
          });

          setOrderPrice(parseFloat(newData.currentPrice));

        } catch (error) {
          console.error('Error processing WebSocket data:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket Disconnected');
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isLoading, stockId]);

  // 사용자 데이터 조회
  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const accountId = response.data.primaryAccountId;
      if (accountId) {
        setPrimaryAccountId(accountId);
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('jwtToken');
      }
    }
  };

  // 주문 처리
  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!primaryAccountId) {
      alert('계좌 정보가 필요합니다.');
      return;
    }

    if (quantity <= 0) {
      alert('주문 수량을 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      const orderDTO = {
        stockCode: stockId,
        orderQuantity: Number(quantity),
        orderPrice: Number(orderPrice),
      };

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
      
      if (response.status === 200) {
        alert(`${quantity}주 ${orderType === 'buy' ? '매수' : '매도'} 주문이 완료되었습니다.`);
        setQuantity(0);
      }
    } catch (error) {
      console.error('주문 처리 실패:', error);
      alert(error.response?.data?.message || '주문 처리 중 오류가 발생했습니다.');
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '12px',
          borderRadius: '4px',
          color: 'white'
        }}>
          <div>{data.time}</div>
          <div>시가: {data.open.toLocaleString()}</div>
          <div>고가: {data.high.toLocaleString()}</div>
          <div>저가: {data.low.toLocaleString()}</div>
          <div>종가: {data.close.toLocaleString()}</div>
          <div>거래량: {data.volume.toLocaleString()}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <S.Container>
      <S.StockInfoContainer>
        <S.Header>
          <S.StockInfo>
            <S.StockTitle>{stockId}</S.StockTitle>
            <S.StockCode>{stockId}</S.StockCode>
          </S.StockInfo>
        </S.Header>

        <S.TimeframeButtons>
          <S.TimeButton 
            active={timeframe === '1min'} 
            onClick={() => setTimeframe('1min')}
          >
            1분
          </S.TimeButton>
          <S.TimeButton 
            active={timeframe === '10min'} 
            onClick={() => setTimeframe('10min')}
          >
            10분
          </S.TimeButton>
        </S.TimeframeButtons>

        <S.ChartContainer ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12, fill: '#8B95A1' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={['auto', 'auto']}
                orientation="right"
                tick={{ fontSize: 12, fill: '#8B95A1' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="shadowHigh"
                fill="transparent"
                isAnimationActive={false}
              />
              <Bar
                dataKey="shadowLow"
                fill="transparent"
                isAnimationActive={false}
              />
              <Bar
                dataKey="barLength"
                fill={(data) => data.color}
                stroke={(data) => data.color}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </S.ChartContainer>
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
            매수
          </S.OrderTypeButton>
          <S.OrderTypeButton
            active={orderType === 'sell'}
            onClick={() => {
              setOrderType('sell');
              setQuantity(0);
            }}
          >
            매도
          </S.OrderTypeButton>
        </S.OrderTypeContainer>

        <S.PriceInput>
          <input
            type="text"
            value={orderPrice.toLocaleString()}
            readOnly
          />
          <span>원</span>
        </S.PriceInput>

        <S.QuantityContainer>
          <span>수량</span>
          <S.QuantityInputContainer>
            <button onClick={() => setQuantity(Math.max(0, quantity - 1))}>-</button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
              min="0"
            />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </S.QuantityInputContainer>
        </S.QuantityContainer>

        <S.InfoList>
          <div>
            <span>총 주문 금액</span>
            <span>{(orderPrice * quantity).toLocaleString()}원</span>
          </div>
        </S.InfoList>

        <S.OrderButton onClick={handleOrder} buy={orderType === 'buy'}>
          {orderType === 'buy' ? '매수하기' : '매도하기'}
        </S.OrderButton>
      </S.OrderBoxContainer>
    </S.Container>
  );
}

export default StockDetail;