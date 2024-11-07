// src/components/SubscriptionTable.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SubscriptionTable() {
  const sampleData = Array.from({ length: 45 }, (_, index) => ({
    id: index + 1,
    category: index % 2 === 0 ? '코스닥시장' : '유가증권시장',
    companyName: `(주)회사 ${index + 1}`,
    underwriter: '한국투자증권',
    applicationPeriod: '2024.01.07 - 2024.01.08',
    refundDate: '2024.01.12',
    maxLimit: '42,000주',
    issuingCompany: '발행회사',
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 15;
  const totalPages = Math.ceil(sampleData.length / itemsPerPage);

  const filteredData = sampleData.filter((item) =>
    item.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleApply = (company) => {
    navigate('/apply', { state: { company } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.filterContainer}>
        <select style={styles.select}>
          <option>기업명</option>
          <option>대표주관회사</option>
        </select>
        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <svg
            style={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>분류</th>
              <th style={styles.th}>기업명</th>
              <th style={styles.th}>대표주관회사</th>
              <th style={styles.th}>청약기간</th>
              <th style={styles.th}>환불일</th>
              <th style={styles.th}>최고청약한도</th>
              <th style={styles.th}>확정발행가</th>
              <th style={styles.th}>신청</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>{item.category}</td>
                <td style={styles.td}>{item.companyName}</td>
                <td style={styles.td}>{item.underwriter}</td>
                <td style={styles.td}>{item.applicationPeriod}</td>
                <td style={styles.td}>{item.refundDate}</td>
                <td style={styles.td}>{item.maxLimit}</td>
                <td style={styles.td}>{item.issuingCompany}</td>
                <td style={styles.td}>
                  <button
                    style={styles.applyButton}
                    onClick={() => handleApply(item)}
                  >
                    신청하기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.paginationContainer}>
        <div style={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              style={{
                ...styles.pageButton,
                ...(currentPage === index + 1 ? styles.activePageButton : {}),
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    fontFamily: '"Roboto", "Noto Sans KR", Arial, sans-serif',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    width: '100%',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #DADADA',
    fontSize: '14px',
    color: '#2B2D33',
    backgroundColor: '#FAFAFA',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: '"Noto Sans KR", Arial, sans-serif',
    fontWeight: '500',
    width: '150px',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '300px',
  },
  searchInput: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #DADADA',
    fontSize: '14px',
    backgroundColor: '#FAFAFA',
    color: '#2B2D33',
    outline: 'none',
    fontFamily: '"Noto Sans KR", Arial, sans-serif',
    fontWeight: '500',
  },
  searchIcon: {
    padding: '8px',
    cursor: 'pointer',
  },
  tableWrapper: {
    borderRadius: '12px',
    overflowX: 'auto',
    border: '1px solid #E5E8EB',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
  },
  th: {
    padding: '16px 12px',
    backgroundColor: '#F9FAFB',
    color: '#333D4B',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    borderBottom: '1px solid #E5E8EB',
  },
  td: {
    padding: '16px 12px',
    fontSize: '14px',
    color: '#333D4B',
    fontWeight: '500',
    textAlign: 'center',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  pagination: {
    display: 'flex',
    gap: '4px',
    fontSize: '14px',
    fontFamily: '"Noto Sans KR", Arial, sans-serif',
    fontWeight: '500',
  },
  pageButton: {
    padding: '8px 12px',
    border: '1px solid #DADADA',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#4A4A4A',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activePageButton: {
    backgroundColor: '#2B2D33',
    color: '#ffffff',
    border: '1px solid #2B2D33',
  },
  applyButton: {
    padding: '8px 16px',
    backgroundColor: '#2B2D33',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Roboto", "Noto Sans KR", Arial, sans-serif',
  },
};

export default SubscriptionTable;
