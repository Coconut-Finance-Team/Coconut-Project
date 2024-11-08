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
  font-family: 'Noto Sans KR', Arial, sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: nowrap;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  min-width: 500px; /* 최소 너비 설정 */
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  min-width: 150px; /* 최소 너비 설정 */
`;

const LogoImage = styled.img`
  height: 28px;
`;

const LogoText = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #333;
`;

const Nav = styled.nav`
  display: flex;
  gap: 32px;
`;

const NavItem = styled(Link)`
  color: ${props => props.isActive ? '#333' : '#8b95a1'};
  text-decoration: none;
  font-size: 17px;
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
  min-width: 250px; /* 최소 너비 설정 */
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
  width: 330px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 16px;
  color: #666;
  width: 100%;
`;

const SearchIcon = styled.svg`
  width: 18px;
  height: 18px;
  fill: #8b95a1;
  cursor: pointer;
`;

const LoginButton = styled.button`
  background: #4174f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 15px;
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
          <NavItem to="/" isActive={location.pathname === '/'}>
            홈
          </NavItem>
          <NavItem to="/subscription" isActive={location.pathname.includes('subscription')}>
            공모주 청약
          </NavItem>
          <NavItem to="/account" isActive={location.pathname.includes('account')}>
            내 계좌
          </NavItem>
        </Nav>
      </LeftSection>

      <RightSection>
        <SearchBox>
          <SearchInput type="text" placeholder="종목을 검색하세요" />
          <SearchIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
          </SearchIcon>
        </SearchBox>
        <LoginButton>로그인</LoginButton>
      </RightSection>
    </HeaderContainer>
  );
}

export default Header;
