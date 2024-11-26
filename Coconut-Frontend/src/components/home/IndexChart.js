import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
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
  const [lastUpdate, setLastUpdate] = useState(null);
  const firstValueRef = useRef(null);

  useEffect(() => {
    let ws = null;
  
    const connectWebSocket = () => {
      ws = new WebSocket('ws://ops.koreainvestment.com:21000');
      
      ws.onopen = () => {
        console.log('WebSocket Connected');
      };
  
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const marketDataArray = isKospi ? data.kospi : data.kosdaq;
          
          if (marketDataArray && marketDataArray.length > 0) {
            const parsedData = marketDataArray.map(item => {
              const parsed = JSON.parse(item);
              return {
                time: parsed.marketTime.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3'),
                value: parseFloat(parsed.currentIndex)
              };
            });

            parsedData.sort((a, b) => a.time.localeCompare(b.time));

            // 최근 30개 데이터만 유지
            const recentData = parsedData.slice(-30);
            setChartData(recentData);

            if (parsedData.length > 0) {
              const currentValue = parsedData[parsedData.length - 1].value;

              if (firstValueRef.current === null) {
                firstValueRef.current = currentValue;
              }

              const change = currentValue - firstValueRef.current;
              const changePercent = (change / firstValueRef.current) * 100;

              setMarketData({
                value: currentValue,
                change,
                changePercent
              });

              setLastUpdate(currentValue);
            }
          }
        } catch (error) {
          console.error('Error processing WebSocket data:', error);
        }
      };
  
      ws.onclose = (event) => {
        console.log('WebSocket Disconnected:', event.code, event.reason);
        setTimeout(connectWebSocket, 3000);
      };
  
      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
    };
  
    connectWebSocket();
  
    return () => {
      if (ws) {
        ws.close();
      }
      firstValueRef.current = null;
    };
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
              stroke="#ff4747"
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