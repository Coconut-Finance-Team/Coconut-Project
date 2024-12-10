import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  gap: 24px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 16px;
  font-family: 'Noto Sans KR', sans-serif;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 8px;
    gap: 12px;
  }
`;

export const StockInfoContainer = styled.div`
  flex: 3;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 24px;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 4px;
`;

export const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const StockLogo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
`;

export const StockTitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StockTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #222222;
  margin: 0;
`;

export const StockCode = styled.span`
  font-size: 15px;
  color: #888888;
`;

export const PriceArea = styled.div`
  margin-top: -4px;
`;

export const CurrentPrice = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.$change > 0 ? '#E22D2D' : props.$change < 0 ? '#1E5EFF' : '#222222'};
  text-align: right;
`;

export const PriceChange = styled.div`
  font-size: 15px;
  color: ${props => props.$value > 0 ? '#E22D2D' : props.$value < 0 ? '#1E5EFF' : '#222222'};
  text-align: right;
  margin-top: 4px;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 2px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
`;

export const TabButton = styled.button`
  padding: 12px 24px;
  border: none;
  background: none;
  font-size: 15px;
  font-weight: ${props => props.active === 'true' ? '600' : '400'};
  color: ${props => props.active === 'true' ? '#222222' : '#888888'};
  border-bottom: 2px solid ${props => props.active === 'true' ? '#222222' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: #222222;
  }
`;

export const TimeframeButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  padding: 0 4px;
`;

export const TimeButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.$active ? '#1E5EFF' : '#E0E0E0'};
  background: ${props => props.$active ? '#F5F8FF' : '#ffffff'};
  color: ${props => props.$active ? '#1E5EFF' : '#666666'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '500'};
  transition: all 0.15s;

  &:hover {
    background: ${props => props.$active ? '#F5F8FF' : '#F8F8F8'};
  }
`;

export const OrderBoxContainer = styled.div`
  flex: 1;
  min-width: 320px;
  max-width: 400px;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-self: flex-start;
  position: sticky;
  top: 20px;
`;


export const OrderTypeContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  padding: 4px;
  background: #F5F5F5;
  border-radius: 10px;
`;

export const OrderTypeButton = styled.button`
  flex: 1;
  height: 44px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  background: ${props => props.$active ?
          (props.$buy ? '#ffffff' : '#ffffff') :
          'transparent'};
  color: ${props => props.$active ?
          (props.$buy ? '#E22D2D' : '#1E5EFF') :
          '#666666'};
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#ffffff' : '#EEEEEE'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputLabel = styled.div`
  font-size: 14px;
  color: #666666;
`;

export const PriceInput = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  background: #f8f8f8;
  border-radius: 8px;
  padding: 0 16px;
  box-sizing: border-box;

  input {
    flex: 1;
    border: none;
    background: none;
    font-size: 15px;
    font-weight: 500;
    text-align: right;
    color: #222222;
    
    &:focus {
      outline: none;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type=number] {
      -moz-appearance: textfield;
    }
  }

  span {
    margin-left: 8px;
    color: #666666;
  }
`;

export const QuantityButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const QuantityButton = styled.button`
  flex: 1;
  height: 36px;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  background: #ffffff;
  color: #1E5EFF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #F5F8FF;
    border-color: #1E5EFF;
  }

  &:disabled {
    color: #999999;
    background: #F5F5F5;
    border-color: #E0E0E0;
    cursor: not-allowed;
  }
`;

export const OrderSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    
    span:first-child {
      color: #666666;
    }
    
    span:last-child {
      color: #222222;
      font-weight: 500;
    }
  }
`;

export const OrderButton = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 8px;
  background: ${props => props.$disabled ? '#E0E0E0' :
          (props.$buy ? '#E22D2D' : '#1E5EFF')};
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$disabled ? '#E0E0E0' :
            (props.$buy ? '#D42020' : '#1751E3')};
  }
`;


export default {};