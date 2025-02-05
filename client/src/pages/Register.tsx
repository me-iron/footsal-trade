import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  Container,
  Heading,
  FormErrorMessage,
  PinInput,
  PinInputField,
  HStack,
} from '@chakra-ui/react';

function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phoneNumber: '',
    password: ''
  });

  const validateForm = () => {
    const newErrors = {
      name: '',
      phoneNumber: '',
      password: ''
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
      isValid = false;
    }

    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = '올바른 휴대전화번호 형식이 아닙니다 (예: 010-1234-5678)';
      isValid = false;
    }

    if (formData.password.length !== 6 || !/^\d+$/.test(formData.password)) {
      newErrors.password = '비밀번호는 6자리 숫자여야 합니다';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '회원가입 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      
      // 로컬 스토리지에 토큰 저장
      localStorage.setItem('token', data.token);
      
      toast({
        title: '회원가입이 완료되었습니다.',
        status: 'success',
        duration: 3000,
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    }
    if (value.length > 8) {
      value = value.slice(0, 8) + '-' + value.slice(8);
    }
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    setFormData(prev => ({ ...prev, phoneNumber: value }));
  };

  return (
    <Container maxW="container.sm" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg" textAlign="center">회원가입</Heading>
        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>이름</FormLabel>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="이름을 입력하세요"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormLabel>휴대전화번호</FormLabel>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="010-0000-0000"
              />
              <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel>비밀번호 (6자리 숫자)</FormLabel>
              <HStack justify="center">
                <PinInput
                  type="number"
                  value={formData.password}
                  onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                >
                  {[...Array(6)].map((_, i) => (
                    <PinInputField key={i} />
                  ))}
                </PinInput>
              </HStack>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="100%"
              isLoading={isLoading}
              loadingText="처리중..."
            >
              가입하기
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default Register; 