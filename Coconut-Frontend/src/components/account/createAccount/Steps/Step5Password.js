import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FormContainer,
  Title,
  Description,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  ButtonContainer,
  Button,
} from '../styles/CommonStyles';

function Step5Password({ onNext }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validations = {
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const allValidationsPassed = Object.values(validations).every(v => v);
  const passwordsMatch = password === confirmPassword;
  const canProceed = allValidationsPassed && passwordsMatch && confirmPassword.length > 0;

  const handleSubmit = () => {
    if (canProceed) {
      onNext({ password });
    }
  };

  return (
    <FormContainer>
      <Title>계좌 비밀번호 설정</Title>
      <Description>안전한 거래를 위해 계좌 비밀번호를 설정해주세요</Description>

      <FormGroup>
        <Label>비밀번호</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="비밀번호를 입력해주세요"
        />
        <ValidationList>
          <ValidationItem passed={validations.length}>8자 이상</ValidationItem>
          <ValidationItem passed={validations.hasLetter}>영문 포함</ValidationItem>
          <ValidationItem passed={validations.hasNumber}>숫자 포함</ValidationItem>
          <ValidationItem passed={validations.hasSpecial}>특수문자 포함</ValidationItem>
        </ValidationList>
      </FormGroup>

      <FormGroup>
        <Label>비밀번호 확인</Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!passwordsMatch && confirmPassword.length > 0}
          placeholder="비밀번호를 다시 입력해주세요"
        />
        {!passwordsMatch && confirmPassword.length > 0 && (
          <ErrorMessage>비밀번호가 일치하지 않습니다</ErrorMessage>
        )}
      </FormGroup>

      <ButtonContainer>
        <Button 
          primary 
          onClick={handleSubmit}
          disabled={!canProceed}
        >
          다음
        </Button>
      </ButtonContainer>
    </FormContainer>
  );
}

const ValidationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
`;

const ValidationItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props => props.passed ? '#00c073' : '#666'};
  margin-bottom: 8px;

  &:before {
    content: '';
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 8px;
    background-color: ${props => props.passed ? '#00c073' : '#e5e8eb'};
    border-radius: 50%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E");
    background-size: 12px;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

export default Step5Password;