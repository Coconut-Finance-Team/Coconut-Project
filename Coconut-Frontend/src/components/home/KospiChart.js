import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
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
  color: ${props => (props.value > 0 ? '#4788ff' : '#ff4747')};
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

function KospiChart() {
  const [hoveredPrice, setHoveredPrice] = useState(null);
  const [hoveredY, setHoveredY] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [previousValue, setPreviousValue] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [marketData, setMarketData] = useState({
    value: 0,
    change: 0,
    changePercent: 0
  });

  // 초기 데이터 로드
  const fetchDailyData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/market/daily');
      const data = response.data.kospi;
      if (data.length > 0) {
        const formattedData = data.map(item => ({
          time: item.time.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3'),
          value: item.value
        }));
        
        setChartData(formattedData);
        const lastValue = data[data.length - 1].value;
        const firstValue = data[0].value;
        
        setMarketData({
          value: lastValue,
          change: lastValue - firstValue,
          changePercent: ((lastValue - firstValue) / firstValue) * 100
        });
        
        setPreviousValue(lastValue);
        setLastUpdate(lastValue);
      }
    } catch (error) {
      console.error('Error fetching daily data:', error);
    }
  };

  // 실시간 데이터 업데이트
  const fetchRealtimeData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/market/realtime');
      const data = response.data;
      const marketInfo = JSON.parse(data.kospi[0]);
      const currentValue = parseFloat(marketInfo.currentIndex);

      if (previousValue === null) {
        setPreviousValue(currentValue);
      } else {
        const firstValue = chartData[0]?.value || currentValue;
        const change = currentValue - firstValue;
        const changePercent = (change / firstValue) * 100;

        setMarketData({
          value: currentValue,
          change,
          changePercent
        });
      }

      setPreviousValue(currentValue);
      const time = marketInfo.marketTime.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');

      setChartData(prevData => {
        const newData = [...prevData, {
          time,
          value: currentValue,
          color: lastUpdate !== null ? (currentValue > lastUpdate ? '#4788ff' : '#ff4747') : '#ff4747'
        }];

        setLastUpdate(currentValue);
        return newData;
      });

    } catch (error) {
      console.error('Error fetching realtime data:', error);
    }
  };

  useEffect(() => {
    // 초기 데이터 로드
    fetchDailyData();
    
    // 실시간 업데이트 시작
    const interval = setInterval(fetchRealtimeData, 3000);
    
    return () => clearInterval(interval);
  }, []);

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
              코스피
              <img src={koreaFlag} alt="Korea Flag" />
            </MarketName>
            <PriceInfo>
              <CurrentPrice>
                {marketData.value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
              </CurrentPrice>
              <Change value={marketData.change}>
                {marketData.change > 0 ? '+' : ''}
                {marketData.change.toFixed(2)}
                ({marketData.changePercent.toFixed(2)}%)
              </Change>
            </PriceInfo>
          </div>
        </Header>

        <TimeframeButtons>
          <TimeButton active={true}>
            실시간
          </TimeButton>
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
                stroke={marketData.change > 0 ? '#4788ff' : '#ff4747'}
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

export default KospiChart;