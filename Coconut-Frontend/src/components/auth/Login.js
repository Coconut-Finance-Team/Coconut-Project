import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://204affe3-b063-4855-a90d-f1a534314a8c.mock.pstmn.io/Login', formData);
      if (response.status === 200) {
        console.log("로그인 성공:", response.data);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        // 사용자 정보 설정
        setUser({
          username: formData.username,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });

        navigate('/'); // 홈 페이지로 이동
      } else {
        console.error("로그인 실패:", response.data.message);
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
    }
  };

  const handleSignupClick = () => {
    navigate('/signin'); // 회원가입 페이지로 이동
  };

  const handleFindIdPasswordClick = () => {
    navigate('/findidpassword'); // ID/비밀번호 찾기 페이지로 이동
  };

  const styles = {
    container: {
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto',
      boxSizing: 'border-box',
      fontFamily: "'Noto Sans KR', Arial, sans-serif",
    },
    formContainer: {
      width: '100%',
      maxWidth: '600px',
      textAlign: 'center',
    },
    infoText: {
      marginBottom: '30px',
      fontSize: '18px',
      color: '#666',
      textAlign: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '30px',
    },
    inputGroup: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      width: '100%',
      justifyContent: 'flex-start',
    },
    inputContainer: {
      flex: 1,
      marginRight: '0px',
    },
    input: {
      width: '80%',
      padding: '15px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '18px',
      height: '50px',
      boxSizing: 'border-box',
      marginBottom: '12px',
    },
    button: {
      width: '140px',
      height: '112px',
      backgroundColor: '#4174f6',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '18px',
      transition: 'backgroundColor 0.3s ease',
      marginTop: '-12px',
      marginLeft: '-30px',
    },
    linkGroup: {
      display: 'flex',
      justifyContent: 'center',
      fontSize: '16px',
      color: '#666',
      width: '100%',
      gap: '20px',
      marginTop: '-8px',
    },
    link: {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <p style={styles.infoText}>모두를 위한 증권 플랫폼, 코코넛 증권</p>
        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <div style={styles.inputContainer}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="아이디"
                style={styles.input}
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호"
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>로그인</button>
          </div>
        </form>
        <div style={styles.linkGroup}>
          <span style={styles.link} onClick={handleSignupClick}>회원가입</span>
          <span style={styles.link} onClick={handleFindIdPasswordClick}>ID/비밀번호 찾기</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
