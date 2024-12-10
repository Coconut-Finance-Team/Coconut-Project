import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SummaryContainer = styled.div`
  background: #ffffff;
  border-left: 1px solid #eee;
  padding: 24px;
  box-sizing: border-box;
  height: calc(100vh - 64px);
  overflow-y: auto;
  position: sticky;
  top: 64px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e5e8eb;
    border-radius: 3px;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
`;

const Balance = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
`;

const BalanceSection = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
`;

const BalanceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

const BalanceLabel = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const BalanceValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.isPositive ? '#ff4747' : '#4788ff'};
  letter-spacing: -0.5px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
`;

const LoadingItem = styled.div`
  height: 60px;
  background: #f8f9fa;
  border-radius: 12px;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const ErrorMessage = styled.div`
  color: #ff4747;
  padding: 24px;
  text-align: center;
`;

const AssetSummary = () => {
    const [assetData, setAssetData] = useState({
        accountAlias: '',
        accountId: '',
        totalAssets: 0,
        reservedDeposit: 0,
        deposit: 0,
        investedAmount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssetData = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('jwtToken');

                if (!token) {
                    setError('로그인이 필요한 서비스입니다.');
                    return;
                }

                const response = await fetch('http://localhost:8080/api/v1/account/assets', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('jwtToken');
                        navigate('/login');
                        return;
                    }
                    throw new Error('자산 정보를 불러오는데 실패했습니다');
                }

                const data = await response.json();

                // AssetDTO에 맞게 데이터를 설정 (기본값 0을 사용)
                setAssetData({
                    accountAlias: data.accountAlias || '',
                    accountId: data.accountId || '',
                    totalAssets: parseFloat(data.totalAssets) || 0,
                    deposit: parseFloat(data.deposit) || 0,
                    reservedDeposit: parseFloat(data.reservedDeposit) || 0,
                    investedAmount: parseFloat(data.investedAmount) || 0,
                });
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssetData();
    }, [navigate]);

    if (isLoading) {
        return (
            <SummaryContainer>
                <LoadingContainer>
                    <LoadingItem />
                    <LoadingItem />
                    <LoadingItem />
                </LoadingContainer>
            </SummaryContainer>
        );
    }

    if (error) {
        return (
            <SummaryContainer>
                <ErrorMessage>{error}</ErrorMessage>
            </SummaryContainer>
        );
    }

    return (
        <SummaryContainer>
            <Title>내 투자</Title>
            <Balance>{(assetData.totalAssets - assetData.reservedDeposit + assetData.investedAmount).toLocaleString()}원</Balance>

            <BalanceSection>
                <BalanceRow>
                    <BalanceLabel>투자 가능 금액</BalanceLabel>
                    <BalanceValue isPositive={true}>
                        {(assetData.totalAssets - assetData.reservedDeposit - assetData.investedAmount).toLocaleString()}원
                    </BalanceValue>
                </BalanceRow>
                <BalanceRow>
                    <BalanceLabel>투자 중인 금액</BalanceLabel>
                    <BalanceValue isPositive={false}>
                        {assetData.investedAmount.toLocaleString()}원
                    </BalanceValue>
                </BalanceRow>
            </BalanceSection>
        </SummaryContainer>
    );
};

export default AssetSummary;
