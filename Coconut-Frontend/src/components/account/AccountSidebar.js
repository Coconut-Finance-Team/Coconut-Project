import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.nav`
  background: #ffffff;
  border: 1px solid #E5E8EB;
  border-radius: 12px;
  padding: 16px;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.active ? '#F8F9FA' : 'none'};
  border: none;
  color: ${props => props.active ? '#333' : '#666'};
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  margin: 4px 0;

  &:hover {
    background: #F8F9FA;
  }

  ${props => props.active && `
    font-weight: 600;
  `}
`;

function AccountSidebar({ activePage, onMenuClick }) {
  const menuItems = [
    { id: 'assets', label: '자산' },
    { id: 'transactions', label: '거래내역' },
    { id: 'orders', label: '주문내역' },
    { id: 'sales', label: '판매수익' },
    { id: 'dividends', label: '배당내역' },
    { id: 'interest', label: '이자내역' },
    { id: 'management', label: '계좌관리' },
  ];

  return (
    <SidebarContainer>
      {menuItems.map(item => (
        <MenuItem 
          key={item.id}
          active={activePage === item.id}
          onClick={() => onMenuClick(item.id)}
        >
          {item.label}
        </MenuItem>
      ))}
    </SidebarContainer>
  );
}

export default AccountSidebar;