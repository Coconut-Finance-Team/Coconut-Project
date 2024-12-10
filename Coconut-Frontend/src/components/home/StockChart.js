import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const StockChart = () => {
  const priceChartRef = useRef(null);
  const volumeChartRef = useRef(null);
  const priceChart = useRef(null);
  const volumeChart = useRef(null);
  const candleSeries = useRef(null);
  const volumeSeries = useRef(null);
  const animationRef = useRef(null);
  const currentCandle = useRef(null);
  const isDisposed = useRef(false);

  const generateHistoricalData = () => {
    const data = [];
    const startTime = new Date();
    startTime.setHours(9, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(13, 10, 0, 0);

    let currentPrice = 173000;
    let currentTime = startTime;

    while (currentTime <= endTime) {
      const open = currentPrice;
      const high = open + Math.random() * 100;
      const low = open - Math.random() * 100;
      const close = low + Math.random() * (high - low);

      data.push({
        time: Math.floor(currentTime.getTime() / 1000),
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000) + 500
      });

      currentPrice = close;
      currentTime = new Date(currentTime.getTime() + 60000);
    }

    return data;
  };

  const createChartOptions = (height) => ({
    height,
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
      tickMarkFormatter: (time) => {
        const date = new Date(time * 1000);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      },
    },
    layout: {
      background: { color: '#ffffff' },
      textColor: '#333',
    },
    grid: {
      vertLines: { color: '#f0f3fa' },
      horzLines: { color: '#f0f3fa' },
    },
    rightPriceScale: {
      scaleMargins: {
        top: 0.2,
        bottom: 0.2,
      },
      borderVisible: false,
    },
  });

  const syncCharts = () => {
    if (!priceChart.current || !volumeChart.current) return;

    let timeScaleSync = false;

    const syncHandler = (src, dst) => {
      if (timeScaleSync) return;
      timeScaleSync = true;
      dst.timeScale().setVisibleRange(src.timeScale().getVisibleRange());
      timeScaleSync = false;
    };

    priceChart.current.timeScale().subscribeVisibleTimeRangeChange(() => {
      syncHandler(priceChart.current, volumeChart.current);
    });

    volumeChart.current.timeScale().subscribeVisibleTimeRangeChange(() => {
      syncHandler(volumeChart.current, priceChart.current);
    });
  };

  const initChart = () => {
    if (!priceChartRef.current || !volumeChartRef.current || isDisposed.current) return;

    priceChart.current = createChart(priceChartRef.current, {
      ...createChartOptions(300),
      width: priceChartRef.current.clientWidth,
    });

    volumeChart.current = createChart(volumeChartRef.current, {
      ...createChartOptions(100),
      width: volumeChartRef.current.clientWidth,
    });

    candleSeries.current = priceChart.current.addCandlestickSeries({
      upColor: '#ff4747',
      downColor: '#4788ff',
      borderUpColor: '#ff4747',
      borderDownColor: '#4788ff',
      wickUpColor: '#ff4747',
      wickDownColor: '#4788ff',
      priceFormat: {
        type: 'price',
        precision: 0,
        minMove: 400,
      },
    });

    volumeSeries.current = volumeChart.current.addHistogramSeries({
      color: '#26a69a',
      priceFormat: { type: 'volume' },
    });

    const historicalData = generateHistoricalData();
    candleSeries.current.setData(historicalData);

    const volumeData = historicalData.map(d => ({
      time: d.time,
      value: d.volume,
      color: d.close >= d.open ? 'rgba(255, 71, 71, 0.3)' : 'rgba(71, 136, 255, 0.3)'
    }));

    volumeSeries.current.setData(volumeData);

    syncCharts();

    const startTime = new Date();
    startTime.setHours(13, 11, 0, 0);

    currentCandle.current = {
      time: Math.floor(startTime.getTime() / 1000),
      open: historicalData[historicalData.length - 1].close,
      high: historicalData[historicalData.length - 1].close,
      low: historicalData[historicalData.length - 1].close,
      close: historicalData[historicalData.length - 1].close,
      volume: 0
    };

    if (!isDisposed.current) {
      startAnimation();
    }
  };

  const startAnimation = () => {
    const updateCurrentCandle = () => {
      if (isDisposed.current || !currentCandle.current || !candleSeries.current) return;

      const now = new Date();
      const currentMinuteTimestamp = Math.floor(now.getTime() / 1000 / 60) * 60;

      if (currentCandle.current.time < currentMinuteTimestamp) {
        const newCandle = {
          time: currentMinuteTimestamp,
          open: currentCandle.current.close,
          high: currentCandle.current.close,
          low: currentCandle.current.close,
          close: currentCandle.current.close,
          volume: 0
        };
        currentCandle.current = newCandle;
      }

      const change = (Math.random() - 0.5) * 50;
      const newPrice = currentCandle.current.close + change;

      currentCandle.current.close = newPrice;
      currentCandle.current.high = Math.max(currentCandle.current.high, newPrice);
      currentCandle.current.low = Math.min(currentCandle.current.low, newPrice);
      currentCandle.current.volume += Math.floor(Math.random() * 50);

      if (!isDisposed.current) {
        candleSeries.current.update(currentCandle.current);
        volumeSeries.current.update({
          time: currentCandle.current.time,
          value: currentCandle.current.volume,
          color: currentCandle.current.close >= currentCandle.current.open ?
              'rgba(255, 71, 71, 0.3)' : 'rgba(71, 136, 255, 0.3)'
        });

        animationRef.current = requestAnimationFrame(() => {
          if (!isDisposed.current) {
            setTimeout(updateCurrentCandle, 1000);
          }
        });
      }
    };

    updateCurrentCandle();
  };

  useEffect(() => {
    isDisposed.current = false;
    initChart();

    const handleResize = () => {
      if (isDisposed.current) return;

      if (priceChart.current) {
        priceChart.current.applyOptions({
          width: priceChartRef.current.clientWidth,
        });
      }

      if (volumeChart.current) {
        volumeChart.current.applyOptions({
          width: volumeChartRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed.current = true;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      window.removeEventListener('resize', handleResize);

      if (priceChart.current) {
        priceChart.current.remove();
        priceChart.current = null;
      }

      if (volumeChart.current) {
        volumeChart.current.remove();
        volumeChart.current = null;
      }

      candleSeries.current = null;
      volumeSeries.current = null;
      currentCandle.current = null;
    };
  }, []);

  return (
      <div className="flex flex-col gap-1">
        <div ref={priceChartRef} className="w-full h-[300px]" />
        <div ref={volumeChartRef} className="w-full h-[100px]" />
      </div>
  );
};

export default StockChart;