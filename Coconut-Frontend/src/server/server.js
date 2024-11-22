const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const app = express();

app.use(cors());

// 당일 누적 데이터 저장
let marketHistory = {
    kospi: [],
    kosdaq: []
};

// 현재 데이터 저장
let currentMarketData = {
    kospi: null,
    kosdaq: null
};

// 한국투자증권 웹소켓 연결 설정
const connectWebSocket = (approval_key) => {
    const ws = new WebSocket('ws://ops.koreainvestment.com:21000');
    
    ws.on('open', function() {
        console.log('Connected to Korea Investment WebSocket');
        
        // 코스피 실시간 구독
        const kospiSubscribe = {
            header: {
                approval_key: approval_key,
                custtype: "P",
                tr_type: "1",
                "content-type": "utf-8"
            },
            body: {
                input: {
                    tr_id: "H0UPCNT0",
                    tr_key: "0001"
                }
            }
        };
        
        // 코스닥 실시간 구독
        const kosdaqSubscribe = {
            header: {
                approval_key: approval_key,
                custtype: "P",
                tr_type: "1",
                "content-type": "utf-8"
            },
            body: {
                input: {
                    tr_id: "H0UPCNT0",
                    tr_key: "1001"
                }
            }
        };

        ws.send(JSON.stringify(kospiSubscribe));
        ws.send(JSON.stringify(kosdaqSubscribe));
    });

    ws.on('message', function(data) {
        const message = data.toString();
        const [encrypted, trId, dataCount, ...values] = message.split('|');

        if (trId === 'H0UPCNT0') {
            const [bstp_cls_code, bsop_hour, prpr_nmix, ...rest] = values[0].split('^');
            
            // 데이터를 저장할 객체
            const newData = {
                marketTime: bsop_hour,
                currentIndex: parseFloat(prpr_nmix),
                timestamp: Date.now()
            };

            // 코스피
            if (bstp_cls_code === '0001') {
                currentMarketData.kospi = {
                    marketCode: "0001",
                    ...newData
                };

                // 이미 같은 시간의 데이터가 있는지 확인
                const existingIndex = marketHistory.kospi.findIndex(
                    item => item.marketTime === bsop_hour
                );

                if (existingIndex === -1) {
                    // 새로운 시간의 데이터면 추가
                    marketHistory.kospi.push(newData);
                } else {
                    // 기존 데이터 업데이트
                    marketHistory.kospi[existingIndex] = newData;
                }

                console.log('KOSPI updated:', currentMarketData.kospi);
            }
            // 코스닥
            else if (bstp_cls_code === '1001') {
                currentMarketData.kosdaq = {
                    marketCode: "1001",
                    ...newData
                };

                // 이미 같은 시간의 데이터가 있는지 확인
                const existingIndex = marketHistory.kosdaq.findIndex(
                    item => item.marketTime === bsop_hour
                );

                if (existingIndex === -1) {
                    // 새로운 시간의 데이터면 추가
                    marketHistory.kosdaq.push(newData);
                } else {
                    // 기존 데이터 업데이트
                    marketHistory.kosdaq[existingIndex] = newData;
                }

                console.log('KOSDAQ updated:', currentMarketData.kosdaq);
            }
        }
    });

    ws.on('error', function(error) {
        console.error('WebSocket error:', error);
    });

    ws.on('close', function() {
        console.log('WebSocket connection closed. Attempting to reconnect...');
        setTimeout(() => connectWebSocket(approval_key), 5000);
    });
};

// 웹소켓 연결 시작
connectWebSocket('1fb7b897-b10e-4c8e-a4c8-b1524238cc59');

// 실시간 데이터 엔드포인트
app.get('/api/market/realtime', (req, res) => {
    res.json(currentMarketData);
});

// 당일 누적 데이터 엔드포인트
app.get('/api/market/history', (req, res) => {
    res.json(marketHistory);
});

// 매일 자정에 히스토리 초기화
const resetHistory = () => {
    marketHistory = {
        kospi: [],
        kosdaq: []
    };
    console.log('Market history reset at midnight');
};

// 매일 자정에 데이터 초기화 스케줄링
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetHistory();
    }
}, 60000); // 1분마다 체크

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});