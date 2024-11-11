import React, { useState } from 'react';
import styled from 'styled-components';
import AccountSidebar from './account/AccountSidebar';
import AssetLog from './account/AssetLog';
import AssetSummary from './account/AssetSummary';
import TransactionLog from './account/TransactionLog';
import OrderLog from './account/OrderLog';
import Sales from './account/Sales';
import AccountManage from './account/AccountManage'; // AccountManage 컴포넌트 추가

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const MainLayout = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  position: relative;
  margin: 0 auto;
  max-width: 1720px;
  gap: 24px;
`;

const SidebarContainer = styled.div`
  width: 240px;
  position: sticky;
  top: 24px;
  height: fit-content;
`;

const ContentContainer = styled.main`
  flex: 0 1 960px;
  min-width: 0;
`;

const SummaryContainer = styled.div`
  width: 320px;
  position: sticky;
  top: 24px;
  height: fit-content;
`;

const Account = () => {
  const [activePage, setActivePage] = useState('assets');

  const renderContent = () => {
    switch (activePage) {
      case 'assets':
        return <AssetLog />;
      case 'transactions':
        return <TransactionLog />;
      case 'orders':
        return <OrderLog />;
      case 'sales':
        return <Sales />;
      case 'management': // 계좌관리 페이지 추가
        return <AccountManage />;
      default:
        return <AssetLog />;
    }
  };

  return (
    <PageContainer>
      <MainLayout>
        <SidebarContainer>
          <AccountSidebar 
            activePage={activePage} 
            onMenuClick={setActivePage}
          />
        </SidebarContainer>
        
        <ContentContainer>
          {renderContent()}
        </ContentContainer>
        
        <SummaryContainer>
          <AssetSummary />
        </SummaryContainer>
      </MainLayout>
    </PageContainer>
  );
};

export default Account;