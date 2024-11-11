import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import styled, { createGlobalStyle } from 'styled-components';

const generateChartData = (basePrice, days, isKospi) => {
  const data = [];
  let currentPrice = basePrice;
  
  // 데이터 포인트 개수 계산
  const pointsPerDay = 72; // 5분 간격으로 6시간 동안의 데이터
  const totalPoints = days * pointsPerDay;
  
  for (let i = 0; i < totalPoints; i++) {
    // 시간 계산
    const date = new Date();
    date.setDate(date.getDate() - days + Math.floor(i / pointsPerDay));
    date.setHours(9 + Math.floor((i % pointsPerDay) / 12));
    date.setMinutes((i % 12) * 5);

    // 랜덤한 가격 변동 (-0.2% ~ +0.2%)
    const change = (Math.random() - 0.5) * (isKospi ? 0.004 : 0.006);
    currentPrice = currentPrice * (1 + change);

    // 시간 포맷팅
    let timeLabel;
    if (days === 1) {
      timeLabel = date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } else if (days <= 7) {
      timeLabel = date.toLocaleDateString('ko-KR', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } else {
      timeLabel = date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric'
      });
    }

    data.push({
      time: timeLabel,
      price: Math.round(currentPrice * 100) / 100
    });
  }
  
  return data;
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
  
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  background: #f8f9fa;
`;

const ChartCard = styled.div`
  background: #f8f9fa;
  border-radius: 0;
  padding: 24px 0px;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 32px;
`;

const MarketIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: #f2f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;

const MarketInfo = styled.div`
  flex: 1;
`;

const MarketName = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CurrentPrice = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
`;

const PriceChange = styled.span`
  font-size: 15px;
  color: ${props => props.value < 0 ? '#ff4747' : '#00c073'};
  font-weight: 500;
`;

const TimeframeContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  padding: 0 8px;
`;

const TimeButton = styled.button`
  padding: 7px 12px;
  border-radius: 8px;
  border: none;
  background: ${props => props.active ? '#f2f4f6' : 'transparent'};
  color: ${props => props.active ? '#000000' : '#8b95a1'};
  font-size: 13px;
  font-weight: ${props => props.active ? '700' : '400'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#f2f4f6' : '#f8f9fa'};
  }
`;

const ChartContainer = styled.div`
  height: 360px;
  margin: 20px 0;
  padding: 20px;
  background: #ffffff;  // 흰색 배경
  position: relative;

  // 격자 배경
  background-image: 
    linear-gradient(90deg, rgba(240, 240, 240, 0.5) 1px, transparent 1px),
    linear-gradient(rgba(240, 240, 240, 0.5) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const CustomTooltip = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  
  .time {
    font-size: 12px;
    color: #ffffff80;
    margin-bottom: 4px;
  }
  
  .price {
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
  }
`;

function ChartDetail() {
  const location = useLocation();
  const marketData = location.state?.marketData || {
    name: "코스피",
    value: 2561.15,
    change: -3.48,
    changePercent: -0.1,
    isKospi: true
  };

  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState(() => 
    generateChartData(
      marketData.value,
      timeframe === '1D' ? 1 : 
      timeframe === '1W' ? 7 : 
      timeframe === '1M' ? 30 : 
      timeframe === '5Y' ? 1825 : 365,
      marketData.isKospi
    )
  );

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    const days = newTimeframe === '1D' ? 1 : 
                newTimeframe === '1W' ? 7 : 
                newTimeframe === '1M' ? 30 : 
                newTimeframe === '5Y' ? 1825 : 365;
    setChartData(generateChartData(marketData.value, days, marketData.isKospi));
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <ChartCard>
          <Header>
            <MarketIcon>
              {marketData.name === "코스피" ? "KS" : "KQ"}
            </MarketIcon>
            <MarketInfo>
              <MarketName>{marketData.name}</MarketName>
              <PriceInfo>
                <CurrentPrice>
                  {marketData.value.toLocaleString()}
                </CurrentPrice>
                <PriceChange value={marketData.change}>
                  {marketData.change > 0 ? '+' : ''}
                  {marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
                </PriceChange>
              </PriceInfo>
            </MarketInfo>
          </Header>

          <TimeframeContainer>
            <TimeButton 
              active={timeframe === '1D'} 
              onClick={() => handleTimeframeChange('1D')}
            >
              1일
            </TimeButton>
            <TimeButton 
              active={timeframe === '1W'} 
              onClick={() => handleTimeframeChange('1W')}
            >
              1주
            </TimeButton>
            <TimeButton 
              active={timeframe === '1M'} 
              onClick={() => handleTimeframeChange('1M')}
            >
              1개월
            </TimeButton>
            <TimeButton 
              active={timeframe === '1Y'} 
              onClick={() => handleTimeframeChange('1Y')}
            >
              1년
            </TimeButton>
            <TimeButton 
              active={timeframe === '5Y'} 
              onClick={() => handleTimeframeChange('5Y')}
            >
              5년
            </TimeButton>
          </TimeframeContainer>

          <ChartContainer>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart 
      data={chartData}
      margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
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
        content={({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return (
              <CustomTooltip>
                <div className="time">{label}</div>
                <div className="price">
                  {payload[0].value.toLocaleString()}
                </div>
              </CustomTooltip>
            );
          }
          return null;
        }}
      />
      <Line
        type="monotone"
        dataKey="price"
        stroke={marketData.change >= 0 ? '#00c073' : '#ff4747'}
        dot={false}
        strokeWidth={1.5}
        isAnimationActive={true}
        animationDuration={500}
        connectNulls={true}
      />
    </LineChart>
  </ResponsiveContainer>
</ChartContainer>
        </ChartCard>
      </Container>
    </>
  );
}

export default ChartDetail;