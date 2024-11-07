import React from 'react';
import styled from 'styled-components';
import IndexChart from './home/IndexChart';
import RealTimeChart from './home/RealTimeChart';

const Container = styled.div`
  padding: 40px;
  max-width: 1300px;
  margin: 0 auto;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;  // 섹션 간 간격 통일
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;  // 제목과 컨텐츠 사이 간격 통일
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const MarketCards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const indices = [
  {
    name: "코스피",
    value: 2571.86,
    change: -5.02,
    changePercent: -0.10,
  },
  {
    name: "코스닥",
    value: 746.31,
    change: -5.50,
    changePercent: -0.70,
  },
];

function Homeboard() {
  return (
    <Container>
      <Wrapper>
        <Section>
          <Title>시장 동향</Title>
          <MarketCards>
            {indices.map((index, i) => (
              <IndexChart key={i} {...index} />
            ))}
          </MarketCards>
        </Section>

        <Section>
          <RealTimeChart />
        </Section>
      </Wrapper>
    </Container>
  );
}

export default Homeboard;