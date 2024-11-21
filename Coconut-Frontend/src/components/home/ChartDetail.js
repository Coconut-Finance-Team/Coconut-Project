import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import styled, { createGlobalStyle } from 'styled-components';
import koreaFlag from '../../assets/korea.png';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
`;

const Header = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
`;

const MarketName = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  
  img {
    width: 24px;
    height: 16px;
    margin-top: 4px;
  }
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const CurrentPrice = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #333;
`;

const Change = styled.div`
  font-size: 16px;
  color: ${props => (props.value < 0 ? '#4788ff' : '#ff4747')};
`;

const TimeframeButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
`;

const TimeButton = styled.button`
  padding: 8px 16px;
  border: none;
  background: ${props => (props.active ? '#f1f3f5' : 'transparent')};
  color: ${props => (props.active ? '#333' : '#999')};
  font-size: 14px;
  font-weight: ${props => (props.active ? '600' : '400')};
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background: #f1f3f5;
  }
`;

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  background: #ffffff;
`;

const CustomTooltipContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TooltipLabel = styled.div`
  color: #999;
  font-size: 12px;
  margin-bottom: 4px;
`;

const TooltipValue = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
`;

const PriceIndicator = styled.div`
  position: absolute;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  transform: translateY(-50%);
  pointer-events: none;
`;

const generateChartData = (basePrice, days, isKospi) => {
  const data = [];
  let currentPrice = basePrice;
  const now = new Date();
  
  // 기간별 데이터 포인트 및 변동성 설정
  const getTimeConfig = () => {
    if (days === 1) {
      return { 
        pointsPerDay: 72,  // 5분 간격
        volatility: 0.0002,
        interval: 1000 * 60 * 5
      };
    } else if (days <= 7) {
      return { 
        pointsPerDay: 24,  // 1시간 간격
        volatility: 0.001,
        interval: 1000 * 60 * 60
      };
    } else if (days <= 30) {
      return { 
        pointsPerDay: 4,   // 6시간 간격
        volatility: 0.002,
        interval: 1000 * 60 * 60 * 6
      };
    } else if (days <= 365) {
      return { 
        pointsPerDay: 1,   // 1일 간격
        volatility: 0.003,
        interval: 1000 * 60 * 60 * 24
      };
    } else {
      return { 
        pointsPerDay: 1/7, // 1주 간격
        volatility: 0.004,
        interval: 1000 * 60 * 60 * 24 * 7
      };
    }
  };

  const { pointsPerDay, volatility, interval } = getTimeConfig();
  const totalPoints = Math.floor(days * pointsPerDay);
  
  // 전체적인 추세 설정 (상승/하락)
  const trend = Math.random() * 2 - 1; // -1에서 1 사이의 값
  
  // 시간대별 추세 생성 (더 자연스러운 움직임을 위해)
  const trendPoints = Array.from({ length: Math.ceil(totalPoints / 10) }, () => 
    Math.random() * 2 - 1 + trend
  );
  
  for (let i = 0; i < totalPoints; i++) {
    const date = new Date(now - ((totalPoints - i) * interval));
    
    // 현재 구간의 추세 반영
    const trendIndex = Math.floor(i / 10);
    const currentTrend = trendPoints[trendIndex] || trend;
    
    // 변동성에 추세 반영
    const trendComponent = currentTrend * volatility * 0.5;
    const randomComponent = (Math.random() - 0.5) * volatility;
    currentPrice = currentPrice * (1 + trendComponent + randomComponent);

    // 시간 포맷팅
    let timeLabel;
    if (days === 1) {
      timeLabel = date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } else if (days <= 7) {
      timeLabel = `${date.toLocaleDateString('ko-KR', {
        weekday: 'short'
      })} ${date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })}`;
    } else {
      timeLabel = date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric'
      });
    }

    data.push({
      time: timeLabel,
      value: Math.round(currentPrice * 100) / 100
    });
  }

  return data;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipContainer>
        <TooltipLabel>{label}</TooltipLabel>
        <TooltipValue>
          {payload[0].value.toLocaleString('ko-KR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </TooltipValue>
      </CustomTooltipContainer>
    );
  }
  return null;
};

function ChartDetail() {
  const location = useLocation();
  const [hoveredPrice, setHoveredPrice] = useState(null);
  const [hoveredY, setHoveredY] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('1일');

  const marketData = location?.state?.marketData || {
    name: '코스피',
    value: 2501.33,
    change: -30.33,
    changePercent: -1.1,
    isKospi: true
  };

  useEffect(() => {
    // 초기 데이터 설정
    const initialData = generateChartData(
      marketData.value,
      timeframe === '1일' ? 1 :
      timeframe === '1주일' ? 7 :
      timeframe === '1개월' ? 30 :
      timeframe === '5년' ? 1825 : 365,
      marketData.isKospi
    );
    setChartData(initialData);

    // 1일 차트일 때만 실시간 업데이트
    if (timeframe === '1일') {
      const interval = setInterval(() => {
        setChartData(prevData => {
          const newData = [...prevData];
          const lastValue = newData[newData.length - 1].value;
          const now = new Date();
          
          // 새로운 데이터 포인트 추가
          const volatility = 0.0002;
          const newValue = lastValue * (1 + (Math.random() - 0.5) * volatility);
          
          newData.push({
            time: now.toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }),
            value: Math.round(newValue * 100) / 100
          });
          
          // 72개 포인트 유지
          if (newData.length > 72) {
            newData.shift();
          }
          
          return newData;
        });
      }, 5000); // 5초마다 업데이트

      return () => clearInterval(interval);
    }
  }, [timeframe, marketData.value, marketData.isKospi]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    const days = newTimeframe === '1일' ? 1 :
                newTimeframe === '1주일' ? 7 :
                newTimeframe === '1개월' ? 30 :
                newTimeframe === '5년' ? 1825 : 365;
    const newData = generateChartData(marketData.value, days, marketData.isKospi);
    setChartData(newData);
  };

  const handleMouseMove = (props) => {
    if (props && props.activePayload) {
      setHoveredPrice(props.activePayload[0].value);
      setHoveredY(props.chartY);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPrice(null);
    setHoveredY(null);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <div>
            <MarketName>
              {marketData.name}
              <img src={koreaFlag} alt="Korea Flag" />
            </MarketName>
            <PriceInfo>
              <CurrentPrice>
                {marketData.value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
              </CurrentPrice>
              <Change value={marketData.change}>
                {marketData.change > 0 ? '+' : ''}{marketData.change.toFixed(2)}
                ({marketData.changePercent.toFixed(2)}%)
              </Change>
            </PriceInfo>
          </div>
        </Header>

        <TimeframeButtons>
          {['1일', '1주일', '1개월', '1년', '5년'].map((period) => (
            <TimeButton
              key={period}
              active={timeframe === period}
              onClick={() => handleTimeframeChange(period)}
            >
              {period}
            </TimeButton>
          ))}
        </TimeframeButtons>

        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(240, 240, 240, 0.8)" 
                vertical={true}
                horizontalPoints={[]}
                verticalPoints={[]}
                opacity={0.5}
              />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: '#8B95A1' }}
                interval={Math.floor(chartData.length / 6)}
                axisLine={false}
                tickLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 12, fill: '#8B95A1' }}
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={60}
                padding={{ top: 30, bottom: 30 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: '#666',
                  strokeDasharray: '5 5',
                  strokeWidth: 1
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ff4747"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
          {hoveredPrice && hoveredY && (
            <PriceIndicator style={{ top: hoveredY }}>
              {hoveredPrice.toLocaleString('ko-KR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </PriceIndicator>
          )}
        </ChartContainer>
      </Container>
    </>
  );
}

export default ChartDetail;