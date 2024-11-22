import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
 padding: 40px;
 max-width: 1200px;
 margin: 0 auto;
`;

const PageTitle = styled.h1`
 font-size: 28px;
 font-weight: 700;
 margin-bottom: 32px;
 color: #333;
`;

const InfoSection = styled.section`
 background: white;
 border-radius: 12px;
 padding: 24px;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
 margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
 font-size: 20px;
 font-weight: 600;
 margin-bottom: 16px;
 color: #333;
`;

const InfoGrid = styled.div`
 display: grid;
 grid-template-columns: repeat(2, 1fr);
 gap: 16px;
`;

const InfoItem = styled.div`
 padding: 16px;
 background: #f9fafb;
 border-radius: 8px;
`;

const InfoLabel = styled.p`
 font-size: 14px;
 color: #666;
 margin-bottom: 4px;
`;

const InfoValue = styled.p`
 font-size: 16px;
 color: #333;
 font-weight: 500;
`;

function MyPage({ user }) {
 const formatDate = (dateString) => {
   if (!dateString) return '로딩중...';
   return new Date(dateString).toLocaleDateString('ko-KR', {
     year: 'numeric',
     month: 'long',
     day: 'numeric'
   });
 };

 return (
   <PageContainer>
     <PageTitle>내 정보</PageTitle>
     
     <InfoSection>
       <SectionTitle>기본 정보</SectionTitle>
       <InfoGrid>
         <InfoItem>
           <InfoLabel>이름</InfoLabel>
           <InfoValue>{user?.username || '로딩중...'}</InfoValue>
         </InfoItem>
         <InfoItem>
           <InfoLabel>이메일</InfoLabel>
           <InfoValue>{user?.email || '로딩중...'}</InfoValue>
         </InfoItem>
         <InfoItem>
           <InfoLabel>전화번호</InfoLabel>
           <InfoValue>{user?.phone || '로딩중...'}</InfoValue>
         </InfoItem>
       </InfoGrid>
     </InfoSection>

     <InfoSection>
       <SectionTitle>투자 정보</SectionTitle>
       <InfoGrid>
         <InfoItem>
           <InfoLabel>직업</InfoLabel>
           <InfoValue>{user?.job || '로딩중...'}</InfoValue>
         </InfoItem>
         <InfoItem>
           <InfoLabel>성별</InfoLabel>
           <InfoValue>{user?.gender || '로딩중...'}</InfoValue>
         </InfoItem>
         <InfoItem>
           <InfoLabel>투자 성향</InfoLabel>
           <InfoValue>{user?.investmentStyle || '로딩중...'}</InfoValue>
         </InfoItem>
         <InfoItem>
           <InfoLabel>대표 계좌번호</InfoLabel>
           <InfoValue>{user?.primaryAccountId || '로딩중...'}</InfoValue>
         </InfoItem>
       </InfoGrid>
     </InfoSection>
   </PageContainer>
 );
}

export default MyPage;