import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import styled from 'styled-components';
import { useParams, useLocation } from 'react-router-dom';

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
  color: ${props => {
    if (props.value === 0) return '#333';
    return props.value > 0 ? '#ff4747' : '#4788ff';
  }};
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
  width: 100%;
  height: 500px;
  background: #ffffff;
  position: relative;
  overflow-x: scroll;
  overflow-y: hidden;
  
  ::-webkit-scrollbar {
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ChartContent = styled.div`
  min-width: 1500px;
  width: max-content;
  height: 100%;
`;

const CustomTooltipContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  padding: 12px;
  color: white;
`;

const TooltipLabel = styled.div`
  color: #999;
  font-size: 12px;
  margin-bottom: 4px;
`;

const TooltipValue = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

function MarketChart() {
  const location = useLocation();
  const isKospi = location.pathname === '/chart/kospi';
  const [chartData, setChartData] = useState([]);
  const [marketData, setMarketData] = useState({
    value: isKospi ? 2428.16 : 661.33,
    change: isKospi ? -13.69 : -9.61,
    changePercent: isKospi ? -0.5 : -1.4
  });
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    const initialData = generateInitialData();
    setChartData(initialData);
    setIsLoading(false);

    let lastUpdate = Date.now();
    const intervalId = setInterval(() => {
      const now = Date.now();
      // 10초마다만 업데이트
      if (now - lastUpdate >= 10000) {
        setChartData(prevData => {
          const newData = [...prevData];
          const lastValue = newData[newData.length - 1].value;
          const volatility = isKospi ? 2 : 0.5;
          // 변화량을 더 자연스럽게 조정
          const change = (Math.random() - 0.5) * volatility;
          const newValue = parseFloat((lastValue + change).toFixed(2));

          // 마지막 데이터 업데이트
          newData[newData.length - 1] = {
            ...newData[newData.length - 1],
            value: newValue
          };

          // 마켓 데이터 업데이트
          const firstValue = newData[0].value;
          const totalChange = newValue - firstValue;
          const changePercent = (totalChange / firstValue) * 100;

          setMarketData({
            value: newValue,
            change: parseFloat(totalChange.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2))
          });

          return newData;
        });
        lastUpdate = now;
      }
    }, 1000); // 1초마다 체크하지만 10초 간격으로만 업데이트

    return () => clearInterval(intervalId);
  }, [isKospi]);

  const generateInitialData = () => {
    const baseValue = isKospi ? 2450 : 670;
    const volatility = isKospi ? 40 : 20;
    const dataPoints = [];

    // 10초 간격으로 데이터 생성
    for (let hour = 9; hour <= 13; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        const progress = (hour - 9 + minute / 60) / 4;
        let value = baseValue;

        // 하락 추세
        value -= progress * volatility;

        // 11시 이후 반등
        if (hour >= 11) {
          value += (progress - 0.5) * volatility * 0.5;
        }

        // 적은 변동성 추가
        value += (Math.random() - 0.5) * volatility * 0.1;

        dataPoints.push({
          time,
          value: parseFloat(value.toFixed(2))
        });
      }
    }

    return dataPoints;
  };

  const formatXAxis = (tickItem) => {
    return tickItem.split(':')[0] + ':00';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
          <CustomTooltipContainer>
            <TooltipLabel>{payload[0].payload.time}</TooltipLabel>
            <TooltipValue>
              {payload[0].value.toFixed(2)}
            </TooltipValue>
          </CustomTooltipContainer>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <Container>
        <Header>
          <div>
            <MarketName>{isKospi ? '코스피' : '코스닥'}</MarketName>
            <PriceInfo>
              <CurrentPrice>
                {marketData.value.toFixed(2)}
              </CurrentPrice>
              <Change value={marketData.change}>
                {marketData.change > 0 ? '+' : ''}
                {marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
              </Change>
            </PriceInfo>
          </div>
        </Header>

        <TimeframeButtons>
          <TimeButton active={true}>실시간</TimeButton>
        </TimeframeButtons>

        <ChartContainer ref={chartRef}>
          <ChartContent>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
              >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(240, 240, 240, 0.8)"
                    opacity={0.5}
                />
                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12, fill: '#8B95A1' }}
                    interval={11}  // 1시간 간격으로 표시
                    tickFormatter={formatXAxis}
                    axisLine={false}
                    tickLine={false}
                    padding={{ left: 10, right: 10 }}
                />
                <YAxis
                    domain={[
                      dataMin => Math.floor(dataMin - 5),
                      dataMax => Math.ceil(dataMax + 5)
                    ]}
                    tick={{ fontSize: 12, fill: '#8B95A1' }}
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    width={60}
                    padding={{ top: 30, bottom: 30 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ff4747"
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                    connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContent>
        </ChartContainer>
      </Container>
  );
}

export default MarketChart;