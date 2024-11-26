import React, { useEffect, useRef, useState } from 'react';
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
import * as S from './StockChartStyles';

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

const TIMEFRAMES = [
  { key: '1min', label: '1분', minutes: 1 },
  { key: '10min', label: '10분', minutes: 10 }
];

const StockChart = ({ stockId }) => {
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[0]);
  const [data, setData] = useState([]);
  const [currentCandle, setCurrentCandle] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const containerRef = useRef(null);
  const wsRef = useRef(null);

  const handleResize = () => {
    if (containerRef.current && chartRef.current && chartInstance.current) {
      const container = containerRef.current;
      chartRef.current.width = container.clientWidth;
      chartRef.current.height = container.clientHeight;
      chartInstance.current.resize();
    }
  };

  const connectWebSocket = () => {
    if (!stockId) return;
    
    const ws = new WebSocket(`ws://localhost:8080/ws/stock/${stockId}`);
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
    };
    
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(prevData => {
        const updatedData = [...prevData];
        // Update or add new candle data
        const lastCandle = updatedData[updatedData.length - 1];
        if (lastCandle && isSameTimeframe(lastCandle.timestamp, newData.timestamp)) {
          // Update existing candle
          lastCandle.high = Math.max(lastCandle.high, newData.currentPrice);
          lastCandle.low = Math.min(lastCandle.low, newData.currentPrice);
          lastCandle.close = newData.currentPrice;
          lastCandle.volume += newData.contingentVol;
        } else {
          // Add new candle
          updatedData.push({
            time: new Date(newData.timestamp).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            open: newData.currentPrice,
            high: newData.currentPrice,
            low: newData.currentPrice,
            close: newData.currentPrice,
            volume: newData.contingentVol,
            timestamp: newData.timestamp
          });
        }
        return updatedData;
      });
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setTimeout(connectWebSocket, 3000);
    };
    
    wsRef.current = ws;
  };

  const isSameTimeframe = (timestamp1, timestamp2) => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    const timeDiff = Math.abs(date1 - date2);
    return timeDiff < timeframe.minutes * 60000;
  };

  // MySQL 데이터를 분봉 데이터로 변환
  const processStockData = (stockData) => {
    const groupedData = new Map();

    stockData.forEach(item => {
      const date = new Date(item.time);
      const minuteKey = Math.floor(date.getTime() / (timeframe.minutes * 60000));

      if (!groupedData.has(minuteKey)) {
        groupedData.set(minuteKey, {
          time: date.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          open: item.openPrice,
          high: item.highPrice,
          low: item.lowPrice,
          close: item.currentPrice,
          volume: item.contingentVol,
          timestamp: date.getTime()
        });
      } else {
        const current = groupedData.get(minuteKey);
        current.high = Math.max(current.high, item.highPrice);
        current.low = Math.min(current.low, item.lowPrice);
        current.close = item.currentPrice;
        current.volume += item.contingentVol;
      }
    });

    return Array.from(groupedData.values())
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  // MySQL 데이터 로드
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/stock/${stockId}/charts/${timeframe.key}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const stockData = await response.json();
        
        const processedData = processStockData(stockData);
        setData(processedData);

        if (processedData.length > 0) {
          setCurrentCandle(processedData[processedData.length - 1]);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    if (stockId) {
      fetchStockData();
    }
  }, [stockId, timeframe]);

  // WebSocket 연결
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [stockId, timeframe]);

  // 이동평균선 계산
  const calculateMA = (data, period) => {
    return data.map((_, index) => {
      const start = Math.max(0, index - period + 1);
      const values = data.slice(start, index + 1).map(d => d.close);
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    });
  };

  // 차트 생성 및 업데이트
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const recentData = data.slice(-100);
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
  }, [data]);

  return (
    <S.ChartWrapper>
      <S.TimeframeContainer>
        {TIMEFRAMES.map((tf) => (
          <S.TimeButton
            key={tf.key}
            active={timeframe.key === tf.key}
            onClick={() => setTimeframe(tf)}
          >
            {tf.label}
          </S.TimeButton>
        ))}
      </S.TimeframeContainer>
      <S.CanvasContainer ref={containerRef}>
        <canvas 
          ref={chartRef}
          style={{ 
            width: '100%', 
            height: '100%'
          }}
        />
      </S.CanvasContainer>
    </S.ChartWrapper>
  );
};

export default StockChart;