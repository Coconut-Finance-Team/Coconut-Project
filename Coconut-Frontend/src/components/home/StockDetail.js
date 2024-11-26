import React, { useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
`;

const TimeframeContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
`;

const TimeButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${props => props.active ? '#1890ff' : '#d9d9d9'};
  background: ${props => props.active ? '#1890ff' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#666666'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    border-color: #1890ff;
    color: ${props => props.active ? '#ffffff' : '#1890ff'};
  }
`;

const CustomTooltipContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white;
`;

const TooltipRow = styled.div`
  margin: 4px 0;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const StockChart = ({ stockId }) => {
  const [timeframe, setTimeframe] = useState('1min');
  const [chartData, setChartData] = useState([]);
  const wsRef = useRef(null);
  const [basePrice, setBasePrice] = useState(null);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/stock/${stockId}/charts/${timeframe}`
        );
        const data = await response.json();

        const formattedData = data.map(item => ({
          time: new Date(item.time).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          price: item.currentPrice,
          open: item.openPrice,
          high: item.highPrice,
          low: item.lowPrice,
          volume: item.contingentVol,
          accVolume: item.accumulatedVol,
          amount: item.accumulatedAmount
        }));

        if (formattedData.length > 0) {
          setBasePrice(formattedData[0].price);
        }

        setChartData(formattedData);
      } catch (error) {
        console.error('Historical data fetch error:', error);
      }
    };

    fetchHistoricalData();

    // WebSocket 연결
    wsRef.current = new WebSocket(`ws://localhost:8080/ws/stock/${stockId}`);

    wsRef.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    wsRef.current.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        
        const formattedTime = newData.time.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
        
        setChartData(prevData => {
          const newPoint = {
            time: formattedTime,
            price: newData.currentPrice,
            open: newData.openPrice,
            high: newData.highPrice,
            low: newData.lowPrice,
            volume: newData.contingentVol,
            accVolume: newData.accumulatedVol,
            amount: newData.accumulatedAmount
          };

          const updatedData = [...prevData, newPoint].slice(-100);
          return updatedData;
        });
      } catch (error) {
        console.error('WebSocket data processing error:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [stockId, timeframe]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const priceChange = basePrice ? ((data.price - basePrice) / basePrice) * 100 : 0;
      
      return (
        <CustomTooltipContainer>
          <TooltipRow>
            <span>시간</span>
            <span>{data.time}</span>
          </TooltipRow>
          <TooltipRow>
            <span>현재가</span>
            <span>{data.price.toLocaleString()}원</span>
          </TooltipRow>
          <TooltipRow>
            <span>등락률</span>
            <span className={priceChange >= 0 ? 'text-red-500' : 'text-blue-500'}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </TooltipRow>
          <TooltipRow>
            <span>거래량</span>
            <span>{data.volume.toLocaleString()}</span>
          </TooltipRow>
        </CustomTooltipContainer>
      );
    }
    return null;
  };

  return (
    <div>
      <TimeframeContainer>
        <TimeButton
          active={timeframe === '1min'}
          onClick={() => setTimeframe('1min')}
        >
          1분
        </TimeButton>
        <TimeButton
          active={timeframe === '10min'}
          onClick={() => setTimeframe('10min')}
        >
          10분
        </TimeButton>
      </TimeframeContainer>

      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              opacity={0.3}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: '#666' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              domain={['auto', 'auto']}
              tick={{ fontSize: 12, fill: '#666' }}
              axisLine={false}
              tickLine={false}
              width={60}
              padding={{ top: 30, bottom: 30 }}
            />
            <YAxis
              yAxisId="volume"
              orientation="left"
              domain={[0, 'auto']}
              hide={true}
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
              yAxisId="price"
              type="monotone"
              dataKey="price"
              stroke="#ff4747"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill="#e3f2fd"
              opacity={0.5}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 거래 정보 표시 */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {chartData.length > 0 && (
          <>
            <div className="border rounded p-3">
              <div className="text-sm text-gray-500">거래대금</div>
              <div className="text-lg font-semibold">
                {(chartData[chartData.length - 1].amount / 1000000).toFixed(0)}백만
              </div>
            </div>
            <div className="border rounded p-3">
              <div className="text-sm text-gray-500">누적거래량</div>
              <div className="text-lg font-semibold">
                {chartData[chartData.length - 1].accVolume.toLocaleString()}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 가격 정보 표시 */}
      {chartData.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500">시가</div>
            <div className="text-lg font-semibold">
              {chartData[chartData.length - 1].open.toLocaleString()}
            </div>
          </div>
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500">고가</div>
            <div className="text-lg font-semibold text-red-500">
              {chartData[chartData.length - 1].high.toLocaleString()}
            </div>
          </div>
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500">저가</div>
            <div className="text-lg font-semibold text-blue-500">
              {chartData[chartData.length - 1].low.toLocaleString()}
            </div>
          </div>
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500">현재가</div>
            <div className="text-lg font-semibold">
              {chartData[chartData.length - 1].price.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;