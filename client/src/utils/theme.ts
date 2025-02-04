import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    plab: {
      blue: '#0E6EFD',      // 플랩풋볼 메인 파란색
      gray: '#F8F9FA',      // 배경색
      text: '#212529',      // 기본 텍스트 색상
      border: '#DEE2E6',    // 테두리 색상
      lightGray: '#E9ECEF', // 밝은 회색
      darkGray: '#6C757D',  // 어두운 회색
    }
  },
  fonts: {
    body: "'Noto Sans KR', sans-serif",
    heading: "'Noto Sans KR', sans-serif",
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'plab.blue',
          color: 'white',
          _hover: {
            bg: '#0B5ED7'
          }
        },
        outline: {
          borderColor: 'plab.blue',
          color: 'plab.blue',
          _hover: {
            bg: 'plab.gray'
          }
        }
      }
    },
    Card: {
      baseStyle: {
        p: '4',
        borderRadius: 'lg',
        bg: 'white',
        boxShadow: 'sm',
        border: '1px solid',
        borderColor: 'plab.border'
      }
    }
  },
  styles: {
    global: {
      body: {
        bg: 'plab.gray',
        color: 'plab.text'
      }
    }
  }
});

export default theme; 