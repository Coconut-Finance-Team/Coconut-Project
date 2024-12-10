import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip } from 'recharts';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import koreaFlag from '../../assets/korea.png';

const ChartContainer = styled.div`
  background: #ffffff;
  border: 1px solid #E5E8EB;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 40px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 140px;
`;

const MarketHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const MarketName = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FlagImage = styled.img`
  width: 24px;
  height: 16px;
  margin-top: 4px;
`;

const Price = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const Change = styled.div`
  font-size: 14px;
  color: ${props => {
    if (props.value === 0) return '#333';
    return props.value > 0 ? '#ff4747' : '#4788ff';
  }};
  margin-top: 4px;
`;

const ChartSection = styled.div`
  flex: 1;
  height: 70px;
  position: relative;
  overflow: hidden;
`;

const IndexChart = ({ name, isKospi = true }) => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [marketData, setMarketData] = useState({
    value: isKospi ? 2428.16 : 661.33,
    change: isKospi ? -13.69 : -9.61,
    changePercent: isKospi ? -0.5 : -1.4
  });

  // 초기 데이터 생성
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

  useEffect(() => {
    const initialData = generateInitialData();
    setChartData(initialData);

    let lastUpdate = Date.now();
    const intervalId = setInterval(() => {
      const now = Date.now();
      // 10초마다만 업데이트
      if (now - lastUpdate >= 10000) {
        setChartData(prevData => {
          const lastDataPoint = prevData[prevData.length - 1];
          const volatility = isKospi ? 2 : 0.5;
          // 변화량을 더 자연스럽게 조정
          const change = (Math.random() - 0.5) * volatility;
          const newValue = parseFloat((lastDataPoint.value + change).toFixed(2));

          const updatedData = [...prevData];
          updatedData[updatedData.length - 1] = {
            ...lastDataPoint,
            value: newValue
          };

          // 마켓 데이터 업데이트
          const initialValue = prevData[0].value;
          const totalChange = newValue - initialValue;
          const changePercent = (totalChange / initialValue) * 100;

          setMarketData({
            value: newValue,
            change: parseFloat(totalChange.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2))
          });

          return updatedData;
        });
        lastUpdate = now;
      }
    }, 1000); // 1초마다 체크하지만 10초 간격으로만 업데이트

    return () => clearInterval(intervalId);
  }, [isKospi]);

  const handleClick = () => {
    navigate(isKospi ? '/chart/kospi' : '/chart/kosdaq');
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '8px',
            borderRadius: '4px',
            color: 'white',
            fontSize: '12px'
          }}>
            <div style={{ color: '#999' }}>{payload[0].payload.time}</div>
            <div style={{ fontWeight: '600' }}>{payload[0].value.toFixed(2)}</div>
          </div>
      );
    }
    return null;
  };

  return (
      <ChartContainer onClick={handleClick}>
        <InfoSection>
          <MarketHeader>
            <MarketName>
              {name}
              <FlagImage src={koreaFlag} alt="Korea Flag" />
            </MarketName>
          </MarketHeader>
          <Price>
            {marketData.value.toFixed(2)}
          </Price>
          <Change value={marketData.change}>
            {marketData.change > 0 ? '+' : ''}
            {marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
          </Change>
        </InfoSection>

        <ChartSection>
          <ResponsiveContainer width="99%" height="99%" debounce={50}>
            <LineChart data={chartData}>
              <YAxis
                  domain={[
                    dataMin => Math.floor(dataMin - 5),
                    dataMax => Math.ceil(dataMax + 5)
                  ]}
                  hide
              />
              <Tooltip
                  content={<CustomTooltip />}
                  cursor={false}
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
        </ChartSection>
      </ChartContainer>
  );
};

export default IndexChart;