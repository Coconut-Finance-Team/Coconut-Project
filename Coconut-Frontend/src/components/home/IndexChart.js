import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import axios from 'axios';
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
  color: ${props => (props.value > 0 ? '#ff4747' : '#4788ff')};
  margin-top: 4px;
`;

const ChartSection = styled.div`
  flex: 1;
  height: 70px;
  position: relative;
`;

const IndexChart = ({ name, isKospi = true }) => {
  const navigate = useNavigate();
  const [marketData, setMarketData] = useState({
    value: 0,
    change: 0,
    changePercent: 0
  });
  const [chartData, setChartData] = useState([]);
  const [previousValue, setPreviousValue] = useState(null);

  const fetchRealtimeData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/market/realtime');
      const data = response.data;
      const marketInfo = JSON.parse(isKospi ? data.kospi[0] : data.kosdaq[0]);
      const currentValue = parseFloat(marketInfo.currentIndex);

      if (previousValue === null) {
        setPreviousValue(currentValue);
        setMarketData({
          value: currentValue,
          change: 0,
          changePercent: 0
        });
      } else {
        const change = currentValue - previousValue;
        const changePercent = (change / previousValue) * 100;

        setMarketData({
          value: currentValue,
          change: change,
          changePercent: changePercent
        });
      }

      setPreviousValue(currentValue);
      
      const time = marketInfo.marketTime.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
      
      setChartData(prevData => {
        const newData = [...prevData, {
          time,
          value: currentValue
        }];

        if (newData.length > 30) {
          return newData.slice(-30);
        }
        return newData;
      });
    } catch (error) {
      console.error('Error fetching realtime data:', error);
    }
  };

  useEffect(() => {
    fetchRealtimeData();
    const interval = setInterval(fetchRealtimeData, 3000);

    return () => clearInterval(interval);
  }, [isKospi]);

  const handleClick = () => {
    navigate(isKospi ? '/chart/kospi' : '/chart/kosdaq');
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
          {marketData.value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
        </Price>
        <Change value={marketData.change}>
          {marketData.change > 0 ? '+' : ''}
          {marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
        </Change>
      </InfoSection>

      <ChartSection>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 12, right: 0, bottom: 12, left: 0 }}>
            <YAxis domain={['auto', 'auto']} hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke={marketData.change > 0 ? '#ff4747' : '#4788ff'}
              strokeWidth={2}
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