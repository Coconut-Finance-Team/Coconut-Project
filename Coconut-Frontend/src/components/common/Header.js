import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/logo.png';

const HeaderContainer = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #f2f2f2;
  padding: 0 40px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
`;

const LogoImage = styled.img`
  height: 24px;
`;

const LogoText = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const Nav = styled.nav`
  display: flex;
  gap: 28px;
`;

const NavItem = styled(Link)`
  color: ${props => props.isActive ? '#333' : '#8b95a1'};
  text-decoration: none;
  font-size: 15px;
  font-weight: ${props => props.isActive ? '600' : '400'};
  padding: 4px 0;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -17px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.isActive ? '#333' : 'transparent'};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 8px 12px;
  margin-right: 8px;
  color: #8b95a1;
`;

const SearchIcon = styled.span`
  font-size: 16px;
`;

const LoginButton = styled.button`
  background: #4174f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

function Header() {
  const location = useLocation();
  
  return (
    <HeaderContainer>
      <LeftSection>
        <LogoContainer to="/">
          <LogoImage src={logo} alt="코코넛증권 로고" />
          <LogoText>코코넛증권</LogoText>
        </LogoContainer>
        
        <Nav>
          <NavItem 
            to="/" 
            isActive={location.pathname === '/'}
          >
            홈
          </NavItem>
          <NavItem 
            to="/subscription" 
            isActive={location.pathname.includes('subscription')}
          >
            공모주 청약
          </NavItem>
          <NavItem 
            to="/account" 
            isActive={location.pathname.includes('account')}
          >
            내 계좌
          </NavItem>
        </Nav>
      </LeftSection>

      <RightSection>
        <SearchBox>
          <SearchIcon>🔍</SearchIcon>
          종목을 검색하세요
        </SearchBox>
        <LoginButton>로그인</LoginButton>
      </RightSection>
    </HeaderContainer>
  );
}

export default Header;