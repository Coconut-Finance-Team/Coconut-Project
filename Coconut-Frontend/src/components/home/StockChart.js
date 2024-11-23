import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  Tooltip
} from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  CandlestickController,
  CandlestickElement,
  Tooltip
);

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  overflow: hidden;
  padding-right: 5px;
`;

const TimeframeContainer = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px;
`;

const TimeButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: ${props => props.active ? '#f5f5f5' : '#fff'};
  color: ${props => props.active ? '#333' : '#666'};
  font-size: 13px;
  cursor: pointer;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: calc(100% - 44px);
  position: relative;
`;

const TIMEFRAMES = [
  { key: '1min', label: '1분', minutes: 1 },
  { key: '10min', label: '10분', minutes: 10 }
];

const STOCK_CODES = {
  'skhynix': '000660',
  'samsung': '005930',
  'naver': '066570'  // 실제로는 LG전자 데이터
};

const StockChart = ({ stockId }) => {
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[0]);
  const [data, setData] = useState([]);
  const [currentCandle, setCurrentCandle] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const containerRef = useRef(null);
  const wsRef = useRef(null);

  // LocalStorage keys
  const getStorageKey = (stockCode, timeframe) => 
    `stockData_${stockCode}_${timeframe.minutes}`;

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('Loading data from localStorage...');
    const storageKey = getStorageKey(STOCK_CODES[stockId], timeframe);
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // 24시간 이내의 데이터만 유지
      const recentData = parsedData.filter(candle => 
        new Date(candle.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );
      console.log('Loaded data:', recentData);
      setData(recentData);
    }
  }, [stockId, timeframe]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (data.length > 0) {
      console.log('Saving data to localStorage...');
      const storageKey = getStorageKey(STOCK_CODES[stockId], timeframe);
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, stockId, timeframe]);

  const handleResize = () => {
    if (containerRef.current && chartRef.current && chartInstance.current) {
      const container = containerRef.current;
      chartRef.current.width = container.clientWidth;
      chartRef.current.height = container.clientHeight;
      chartInstance.current.resize();
    }
  };

  useEffect(() => {
    console.log(`Connecting to WebSocket for ${stockId}...`);
    if (wsRef.current) {
      console.log('Closing existing connection...');
      wsRef.current.close();
    }

    wsRef.current = new WebSocket(`ws://localhost:8080/ws/stock/${STOCK_CODES[stockId]}`);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected successfully!');
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    wsRef.current.onmessage = (event) => {
      console.log('Received WebSocket data:', event.data);
      try {
        const dataArray = JSON.parse(event.data);
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          console.log('Invalid data received');
          return;
        }

        const latestData = JSON.parse(dataArray[dataArray.length - 1]);
        console.log('Parsed latest data:', latestData);
        
        const now = new Date();
        const timeframeMins = timeframe.minutes;
        const currentMinuteBlock = Math.floor(now.getMinutes() / timeframeMins) * timeframeMins;
        
        const newCandle = {
          time: now.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          open: parseFloat(latestData.openPrice),
          high: parseFloat(latestData.highPrice),
          low: parseFloat(latestData.lowPrice),
          close: parseFloat(latestData.currentPrice),
          timestamp: now.getTime()
        };

        console.log('Created new candle:', newCandle);

        if (!currentCandle || 
            Math.floor(new Date(currentCandle.timestamp).getMinutes() / timeframeMins) !== 
            Math.floor(currentMinuteBlock / timeframeMins)) {
          console.log('Creating new candle');
          if (currentCandle) {
            setData(prevData => {
              const newData = [...prevData.slice(-99), currentCandle];
              console.log('Updated data array:', newData);
              return newData;
            });
          }
          setCurrentCandle(newCandle);
        } else {
          console.log('Updating current candle');
          setCurrentCandle(prev => {
            const updated = {
              ...prev,
              high: Math.max(prev.high, newCandle.close),
              low: Math.min(prev.low, newCandle.close),
              close: newCandle.close
            };
            console.log('Updated current candle:', updated);
            return updated;
          });
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [stockId, timeframe]);

  const calculateMA = (data, period) => {
    return data.map((_, index) => {
      const start = Math.max(0, index - period + 1);
      const values = data.slice(start, index + 1).map(d => d.close);
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    });
  };

  useEffect(() => {
    if (!chartRef.current || !data) return;
    console.log('Updating chart...');

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const allData = currentCandle ? [...data, currentCandle] : data;
    const recentData = allData.slice(-100);
    
    console.log('Chart data:', recentData);
    
    const chartData = recentData.map(d => ({
      x: d.time,
      o: d.open,
      h: d.high,
      l: d.low,
      c: d.close
    }));

    const ma5 = calculateMA(recentData, 5);
    const ma10 = calculateMA(recentData, 10);
    const ma20 = calculateMA(recentData, 20);

    chartInstance.current = new Chart(ctx, {
      data: {
        labels: recentData.map(d => d.time),
        datasets: [
          {
            type: 'candlestick',
            data: chartData,
            backgroundColors: {
              up: 'rgb(244, 68, 84)',
              down: 'rgb(56, 132, 244)',
              unchanged: 'rgb(143, 143, 143)'
            },
            borderColors: {
              up: 'rgb(244, 68, 84)',
              down: 'rgb(56, 132, 244)',
              unchanged: 'rgb(143, 143, 143)'
            },
            borderWidth: 1
          },
          {
            type: 'line',
            data: ma5,
            borderColor: '#FF3333',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.1
          },
          {
            type: 'line',
            data: ma10,
            borderColor: '#3333FF',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.1
          },
          {
            type: 'line',
            data: ma20,
            borderColor: '#21C6B9',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        layout: {
          padding: {
            left: 10,
            right: 40,
            top: 20,
            bottom: 10
          }
        },
        scales: {
          x: {
            type: 'category',
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8,
              font: {
                size: 11,
                family: 'Noto Sans KR'
              },
              color: '#666'
            },
            border: {
              color: '#eee'
            },
            offset: true
          },
          y: {
            position: 'right',
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              callback: value => value.toLocaleString() + '원',
              font: {
                size: 11,
                family: 'Noto Sans KR'
              },
              color: '#666',
              padding: 8,
              count: 7,
              align: 'end'
            },
            border: {
              display: false
            },
            min: Math.min(...recentData.map(d => d.low)) * 0.9995,
            max: Math.max(...recentData.map(d => d.high)) * 1.0005
          }
        },
        plugins: {
          tooltip: {
            enabled: true,
            position: 'nearest',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: '#eee',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            titleFont: {
              family: 'Noto Sans KR',
              size: 12,
              weight: '500'
            },
            bodyFont: {
              family: 'Noto Sans KR',
              size: 12
            },
            callbacks: {
              label: (context) => {
                const point = context.raw;
                if (context.datasetIndex === 0) {
                  return [
                    `시가: ${point.o?.toLocaleString()}원`,
                    `고가: ${point.h?.toLocaleString()}원`,
                    `저가: ${point.l?.toLocaleString()}원`,
                    `종가: ${point.c?.toLocaleString()}원`
                  ];
                }
                return '';
              }
            }
          },
          legend: {
            display: false
          }
        }
      }
    });

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, currentCandle]);

  return (
    <ChartWrapper>
      <TimeframeContainer>
        {TIMEFRAMES.map((tf) => (
          <TimeButton
            key={tf.key}
            active={timeframe.key === tf.key}
            onClick={() => setTimeframe(tf)}
          >
            {tf.label}
          </TimeButton>
        ))}
      </TimeframeContainer>
      <CanvasContainer ref={containerRef}>
        <canvas 
          ref={chartRef}
          style={{ 
            width: '100%', 
            height: '100%'
          }}
        />
      </CanvasContainer>
    </ChartWrapper>
  );
};

export default StockChart;