import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Image,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  PinInput,
  PinInputField
} from '@chakra-ui/react';
import { Product, TryRequest, TryRequestStatusKR } from '../types';
import Chat from '../components/Chat';

interface AuthFormData {
  phoneNumber: string;
  password: string;
}

interface TryRequestFormData {
  requestType: 'TRY' | 'BUY';
  phoneNumber: string;
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [tryRequests, setTryRequests] = useState<TryRequest[]>([]);
  const [currentStep, setCurrentStep] = useState<'auth' | 'request'>('auth');
  const [authData, setAuthData] = useState<AuthFormData>({ phoneNumber: '', password: '' });
  const [requestData, setRequestData] = useState<TryRequestFormData>({ requestType: 'TRY', phoneNumber: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // 임시 데이터
  useEffect(() => {
    setProduct({
      id: '1',
      userId: 'user1',
      brand: 'Nike',
      model: 'Tiempo',
      size: 265,
      price: 50000,
      condition: '좋음',
      description: '상태 좋은 풋살화입니다',
      images: ['/uploads/test.jpg'],
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
      location: '플랩 스타디움 가산',
      matchDatetime: '2024-02-08T09:00:00',
      plabUrl: 'https://plabfootball.com/match/123'
    });

    // 임시 시착 신청 데이터
    setTryRequests([
      {
        id: '1',
        productId: '1',
        userId: 'user2',
        requestType: 'TRY',
        status: 'APPROVED',
        phoneNumber: '010-1234-5678',
        createdAt: new Date().toISOString()
      }
    ]);
  }, [id]);

  const handleAuth = async () => {
    try {
      // TODO: API 연동 - 로그인 시도
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData)
      });

      if (loginResponse.ok) {
        // 로그인 성공
        setCurrentStep('request');
        setRequestData(prev => ({ ...prev, phoneNumber: authData.phoneNumber }));
      } else if (loginResponse.status === 401) {
        // 미가입 사용자 - 회원가입 진행
        const registerResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authData)
        });

        if (registerResponse.ok) {
          setCurrentStep('request');
          setRequestData(prev => ({ ...prev, phoneNumber: authData.phoneNumber }));
        } else {
          throw new Error('회원가입 실패');
        }
      }
    } catch (error) {
      toast({
        title: '인증 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleTryRequest = async () => {
    try {
      // TODO: API 연동
      toast({
        title: '시착 신청이 완료되었습니다.',
        status: 'success',
        duration: 3000,
      });
      onClose();
      setCurrentStep('auth'); // 모달 초기화
    } catch (error) {
      toast({
        title: '시착 신청 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleModalClose = () => {
    onClose();
    setCurrentStep('auth'); // 모달 초기화
  };

  if (!product) return null;

  const approvedRequest = tryRequests.find(request => request.status === 'APPROVED');

  return (
    <Container maxW="container.xl">
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
        {/* 왼쪽: 상품 정보 */}
        <VStack align="stretch" spacing={8}>
          <Image
            src={product.images[0]}
            alt={`${product.brand} ${product.model}`}
            borderRadius="lg"
            width="100%"
            height="auto"
          />

          <Box>
            <HStack justify="space-between" mb={4}>
              <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                {product.size}mm
              </Badge>
              <Text color="plab.darkGray">
                등록일: {new Date(product.createdAt).toLocaleDateString()}
              </Text>
            </HStack>

            <Text fontSize="2xl" fontWeight="bold">
              {product.brand} {product.model}
            </Text>
            <Text fontSize="xl" fontWeight="bold" mt={2}>
              {product.price.toLocaleString()}원
            </Text>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>상태</Text>
            <Text>{product.condition}</Text>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>상품 설명</Text>
            <Text>{product.description}</Text>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>시착 가능 매치</Text>
            <HStack>
              <Text>{product.location}</Text>
              <Text>•</Text>
              <Text>{new Date(product.matchDatetime!).toLocaleString()}</Text>
            </HStack>
            <Button
              as="a"
              href={product.plabUrl}
              target="_blank"
              variant="outline"
              size="sm"
              mt={2}
            >
              매치 정보 보기
            </Button>
          </Box>

          {!approvedRequest && (
            <Button
              colorScheme="blue"
              size="lg"
              onClick={onOpen}
              isDisabled={product.status !== 'AVAILABLE'}
            >
              시착 신청하기
            </Button>
          )}
        </VStack>

        {/* 오른쪽: 시착 신청 현황 및 채팅 */}
        <Box>
          <Tabs>
            <TabList>
              <Tab>시착 신청 현황</Tab>
              {approvedRequest && <Tab>채팅</Tab>}
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack align="stretch" spacing={4}>
                  {tryRequests.map(request => (
                    <Box
                      key={request.id}
                      p={4}
                      borderWidth={1}
                      borderRadius="lg"
                      borderColor="plab.border"
                    >
                      <HStack justify="space-between" mb={2}>
                        <Text>신청자: {request.phoneNumber}</Text>
                        <Badge colorScheme={request.status === 'APPROVED' ? 'green' : 'gray'}>
                          {TryRequestStatusKR[request.status]}
                        </Badge>
                      </HStack>
                      <Text color="plab.darkGray" fontSize="sm">
                        신청일: {new Date(request.createdAt).toLocaleString()}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </TabPanel>
              {approvedRequest && (
                <TabPanel>
                  <Chat
                    tryRequestId={approvedRequest.id}
                    currentUserId="user1" // TODO: 실제 로그인 사용자 ID
                  />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Box>
      </Grid>

      {/* 시착 신청 모달 */}
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentStep === 'auth' ? '휴대전화 인증' : '시착 신청'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {currentStep === 'auth' ? (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>휴대전화번호</FormLabel>
                  <Input
                    type="tel"
                    placeholder="010-0000-0000"
                    value={authData.phoneNumber}
                    onChange={(e) => setAuthData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>비밀번호 (6자리)</FormLabel>
                  <HStack>
                    <PinInput
                      type="number"
                      value={authData.password}
                      onChange={(value) => setAuthData(prev => ({ ...prev, password: value }))}
                    >
                      {[...Array(6)].map((_, i) => (
                        <PinInputField key={i} />
                      ))}
                    </PinInput>
                  </HStack>
                </FormControl>
                <Button colorScheme="blue" width="100%" onClick={handleAuth}>
                  다음
                </Button>
              </VStack>
            ) : (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>신청 유형</FormLabel>
                  <Select
                    value={requestData.requestType}
                    onChange={(e) => setRequestData(prev => ({ ...prev, requestType: e.target.value as 'TRY' | 'BUY' }))}
                  >
                    <option value="TRY">시착만 하기</option>
                    <option value="BUY">시착 후 구매 예정</option>
                  </Select>
                </FormControl>
                <Text>연락처: {requestData.phoneNumber}</Text>
                <Button colorScheme="blue" width="100%" onClick={handleTryRequest}>
                  신청하기
                </Button>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default ProductDetail; 