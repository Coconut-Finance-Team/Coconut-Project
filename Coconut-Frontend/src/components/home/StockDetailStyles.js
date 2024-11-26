import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  gap: 20px;
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
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const OrderBoxContainer = styled.div`
  flex: 1;
  min-width: 320px;
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #333;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.08);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const StockLogo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

export const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StockTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

export const StockCode = styled.span`
  font-size: 14px;
  color: #8b95a1;
`;

export const StockPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 16px 0;
`;

export const Tags = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const Tag = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  background-color: #f2f2f2;
  border-radius: 12px;
  color: #8b95a1;
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 450px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 20px 0;
  padding: 16px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    height: 350px;
    padding: 8px;
  }
`;

export const TableContainer = styled.div`
  margin-top: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 16px;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: ${props => props.align || 'left'};
  padding: 12px 8px;
  color: #8b95a1;
  font-weight: 400;
  font-size: 13px;
`;

export const Td = styled.td`
  padding: 12px 8px;
  font-size: 14px;
  color: ${props => props.color || '#333'};
  text-align: ${props => props.align || 'left'};
  border-top: 1px solid #f2f2f2;
`;

export const OrderTypeContainer = styled.div`
  display: flex;
  background: #F2F4F6;
  border-radius: 14px;
  padding: 4px;
  height: 48px;
`;

export const OrderTypeButton = styled.button`
  flex: 1;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  background: ${props => props.active ? '#fff' : 'transparent'};
  color: ${props => props.active ? '#333' : '#8B95A1'};
  cursor: pointer;
  box-shadow: ${props => props.active ? '0px 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};
  transition: all 0.2s ease;
`;

export const PriceTypeContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;

  button {
    flex: 1;
    height: 48px;
    padding: 0;
    border: none;
    border-radius: 14px;
    background: #F2F4F6;
    font-size: 15px;
    color: #8B95A1;
    cursor: pointer;

    &.active {
      color: #333;
    }
  }
`;

export const PriceInput = styled.div`
  width: 90%;
  height: 48px;
  display: flex;
  align-items: center;
  background: #F2F4F6;
  border-radius: 14px;
  padding: 0 16px;

  input {
    width: 100%;
    border: none;
    background: transparent;
    font-size: 15px;
    text-align: right;
    color: #333;
    
    &:focus {
      outline: none;
    }
  }

  span {
    color: #333;
    margin-left: 4px;
  }
`;

export const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 48px;

  span {
    font-size: 15px;
    color: #333;
    min-width: 40px;
  }
`;

export const QuantityInputContainer = styled.div`
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  background: #F2F4F6;
  border-radius: 14px;
  padding: 0 8px;

  input {
    width: 100%;
    border: none;
    background: transparent;
    font-size: 15px;
    text-align: right;
    color: #333;
    padding: 0 8px;
    
    &:focus {
      outline: none;
    }
  }

  button {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: #8B95A1;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const PercentageContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

export const PercentButton = styled.button`
  flex: 1;
  height: 48px;
  border: 1px solid #E5E8EB;
  border-radius: 10px;
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #F8F9FA;
  }
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #F2F4F6;
  border-bottom: 1px solid #F2F4F6;
  
  div {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
  }
`;

export const OrderButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 14px;
  background: ${props => props.buy ? '#FF4D4D' : '#4D4DFF'};
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${props => props.buy ? '#FF3B3B' : '#3B4DFF'};
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 200px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #ff4d4d;
  font-size: 16px;
  text-align: center;
`;