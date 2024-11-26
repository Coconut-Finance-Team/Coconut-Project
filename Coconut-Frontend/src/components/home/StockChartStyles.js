import styled from 'styled-components';

export const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
`;

export const TimeframeContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const TimeButton = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.active ? '#007AFF' : '#E5E5E5'};
  background: ${props => props.active ? '#007AFF' : '#FFFFFF'};
  color: ${props => props.active ? '#FFFFFF' : '#666666'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
  }
`;

export const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 60px);
  min-height: 300px;
`;

export const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 24px;
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid #ff0000;
  border-radius: 4px;
  color: #ff0000;
  font-size: 14px;
  z-index: 10;
`;

export const CurrentInfo = styled.div`
  position: absolute;
  top: 8px;
  left: 16px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 5;

  > div {
    margin: 4px 0;
    color: #333;
  }
`;

export const DebugInfo = styled.div`
  position: absolute;
  bottom: 8px;
  left: 16px;
  background: rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  z-index: 5;

  > div {
    margin: 2px 0;
  }
`;