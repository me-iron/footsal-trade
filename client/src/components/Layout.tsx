import { Box, Container, Flex, Link, Heading } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <Box minH="100vh">
      <Box as="header" bg="white" borderBottom="1px" borderColor="plab.border" py={4}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <Heading size="md" color="plab.blue">풋살화 거래</Heading>
            </Link>
            <Flex gap={4}>
              <Link as={RouterLink} to="/register" color="plab.text">
                회원가입
              </Link>
              <Link as={RouterLink} to="/register-product" color="plab.text">
                판매하기
              </Link>
              <Link as={RouterLink} to="/mypage" color="plab.text">
                마이페이지
              </Link>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
}

export default Layout; 