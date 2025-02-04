import { useEffect, useState } from 'react';
import { 
  SimpleGrid, 
  Box, 
  Image, 
  Text, 
  Badge, 
  VStack, 
  HStack,
  Heading
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Product } from '../types';

function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // TODO: API 연동
    // 임시 데이터
    setProducts([
      {
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
        matchDatetime: '2024-02-08T09:00:00'
      }
    ]);
  }, []);

  return (
    <Box>
      <Heading size="lg" mb={8}>시착 가능한 풋살화</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {products.map(product => (
          <Box
            key={product.id}
            as={RouterLink}
            to={`/products/${product.id}`}
            bg="white"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="sm"
            transition="transform 0.2s"
            _hover={{ transform: 'translateY(-4px)' }}
          >
            <Image
              src={product.images[0]}
              alt={`${product.brand} ${product.model}`}
              height="200px"
              width="100%"
              objectFit="cover"
            />
            <VStack p={4} align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold">
                  {product.brand} {product.model}
                </Text>
                <Badge colorScheme="blue">{product.size}mm</Badge>
              </HStack>
              <Text color="plab.darkGray">{product.condition}</Text>
              <Text fontWeight="bold">{product.price.toLocaleString()}원</Text>
              <HStack>
                <Text color="plab.darkGray" fontSize="sm">시착 가능 매치:</Text>
                <Text fontSize="sm">{new Date(product.matchDatetime!).toLocaleString()}</Text>
              </HStack>
              <Text color="plab.darkGray" fontSize="sm">{product.location}</Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Home; 