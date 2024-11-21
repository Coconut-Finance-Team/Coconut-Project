import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import koreaFlag from '../../assets/korea.png';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

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
  color: ${props => (props.value < 0 ? '#4788ff' : '#ff4747')};
  margin-top: 4px;
`;

const ChartSection = styled.div`
  flex: 1;
  height: 70px;
  position: relative;
`;

const ChartWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const IndexChart = ({ name, value, change, changePercent }) => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateSmoothData = (range = 30, baseValue = value, fluctuation = 0.01) => {
    const data = [];
    for (let i = 0; i < range; i++) {
      baseValue *= 1 + (Math.random() * fluctuation - fluctuation / 2);
      data.push({
        time: i,
        value: Math.round(baseValue * 100) / 100, // 소수점 2자리로 고정
      });
    }
    return data;
  };

  const handleClick = () => {
    navigate('/chart/detail', {
      state: {
        marketData: {
          name,
          value,
          change,
          changePercent,
        },
      },
    });
  };

  const chartData = generateSmoothData();

  return (
    <ChartContainer onClick={handleClick}>
      <InfoSection>
        <MarketHeader>
          <MarketName>
            {name}
            <FlagImage src={koreaFlag} alt="Korea Flag" />
          </MarketName>
        </MarketHeader>
        <Price>{value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}</Price>
        <Change value={change}>
          {change >= 0 ? '+' : ''}
          {change.toFixed(2)} ({changePercent.toFixed(2)}%)
        </Change>
      </InfoSection>

      <ChartSection>
        <ChartWrapper>
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 12, right: 0, bottom: 12, left: 0 }}>
                <YAxis domain={['dataMin', 'dataMax']} hide={true} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={change < 0 ? '#4788ff' : '#ff4747'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartWrapper>
      </ChartSection>
    </ChartContainer>
  );
};

export default IndexChart;
