import { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  Flex
} from '@chakra-ui/react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface ChatProps {
  tryRequestId: string;
  currentUserId: string;
}

function Chat({ tryRequestId, currentUserId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 임시 데이터
  useEffect(() => {
    setMessages([
      {
        id: '1',
        senderId: 'user1',
        content: '안녕하세요! 시착 승인되었습니다.',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        senderId: 'user2',
        content: '네, 감사합니다! 매치장에서 뵐게요.',
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  // 새 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // TODO: API 연동
    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <Box h="600px" borderWidth={1} borderRadius="lg" bg="white">
      {/* 채팅 메시지 영역 */}
      <VStack h="calc(100% - 60px)" p={4} overflowY="auto" spacing={4} align="stretch">
        {messages.map(message => (
          <Flex
            key={message.id}
            justify={message.senderId === currentUserId ? 'flex-end' : 'flex-start'}
          >
            {message.senderId !== currentUserId && (
              <Avatar size="sm" mr={2} />
            )}
            <Box
              maxW="70%"
              bg={message.senderId === currentUserId ? 'plab.blue' : 'plab.gray'}
              color={message.senderId === currentUserId ? 'white' : 'plab.text'}
              p={3}
              borderRadius="lg"
            >
              <Text>{message.content}</Text>
              <Text fontSize="xs" color={message.senderId === currentUserId ? 'whiteAlpha.700' : 'gray.500'} mt={1}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </Text>
            </Box>
          </Flex>
        ))}
        <div ref={messagesEndRef} />
      </VStack>

      {/* 메시지 입력 영역 */}
      <HStack h="60px" p={2} borderTop="1px" borderColor="plab.border">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button colorScheme="blue" onClick={handleSendMessage}>
          전송
        </Button>
      </HStack>
    </Box>
  );
}

export default Chat; 