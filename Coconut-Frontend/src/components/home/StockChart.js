import React, { useEffect, useRef } from 'react';
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

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const StockChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const containerRef = useRef(null);

  const handleResize = () => {
    if (containerRef.current && chartRef.current && chartInstance.current) {
      const container = containerRef.current;
      chartRef.current.width = container.clientWidth;
      chartRef.current.height = container.clientHeight;
      chartInstance.current.resize();
    }
  };

  const calculateMA = (data, period) => {
    return data.map((_, index) => {
      const start = Math.max(0, index - period + 1);
      const values = data.slice(start, index + 1).map(d => d.close);
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    });
  };

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const container = containerRef.current;
    chartRef.current.width = container.clientWidth;
    chartRef.current.height = container.clientHeight;

    const recentData = data.slice(-15);
    const chartData = recentData.map(d => ({
      x: d.time,
      o: d.open,
      h: d.high,
      l: d.low,
      c: d.close
    }));

    // 이동평균선 데이터 계산
    const maOpen = calculateMA(recentData, 5);
    const maClose = calculateMA(recentData, 10);
    const maLow = calculateMA(recentData, 15);
    const maHigh = calculateMA(recentData, 20);

    chartInstance.current = new Chart(ctx, {
      data: {
        labels: recentData.map(d => d.time),
        datasets: [
          {
            type: 'candlestick',
            label: 'Candlestick',
            data: chartData,
            backgroundColors: {
              up: 'rgb(244, 68, 84)',      // 상승 - 빨간색
              down: 'rgb(56, 132, 244)',    // 하락 - 파란색
              unchanged: 'rgb(143, 143, 143)'  // 변동없음 - 회색
            },
            borderColors: {                 // 테두리 색상도 동일하게 설정
              up: 'rgb(244, 68, 84)',      // 상승 - 빨간색
              down: 'rgb(56, 132, 244)',    // 하락 - 파란색
              unchanged: 'rgb(143, 143, 143)'  // 변동없음 - 회색
            },
            borderWidth: 1
          },
          {
            type: 'line',
            label: '시작가 이동평균선',
            data: maOpen,
            borderColor: '#FF3333', // 빨간색
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.1
          },
          {
            type: 'line',
            label: '종가 이동평균선',
            data: maClose,
            borderColor: '#3333FF', // 파란색
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.1
          },
          {
            type: 'line',
            label: '저가 이동평균선',
            data: maLow,
            borderColor: '#FF9500', // 주황색
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.1
          },
          {
            type: 'line',
            label: '고가 이동평균선',
            data: maHigh,
            borderColor: '#21C6B9', // 청록색
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
        layout: {
          padding: {
            left: 10,
            right: 40,
            top: 20,
            bottom: 10
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
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
            type: 'linear',
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
          legend: {
            display: true,
            labels: {
              font: {
                family: 'Noto Sans KR'
              }
            }
          },
          tooltip: {
            position: 'nearest',
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                const point = context.raw;
                if (context.datasetIndex === 0) {
                  return [
                    `시가: ${point.o.toLocaleString()}원`,
                    `고가: ${point.h.toLocaleString()}원`,
                    `저가: ${point.l.toLocaleString()}원`,
                    `종가: ${point.c.toLocaleString()}원`
                  ];
                }
                return `${context.dataset.label}: ${point.toLocaleString()}원`;
              }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: '#eee',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            titleFont: {
              family: 'Noto Sans KR'
            },
            bodyFont: {
              family: 'Noto Sans KR'
            }
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
    <ChartWrapper>
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
