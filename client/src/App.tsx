import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './utils/theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import ProductRegister from './pages/ProductRegister';
import MyPage from './pages/MyPage';
import Register from './pages/Register';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/register-product" element={<ProductRegister />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </Layout>
      </Router>
    </ChakraProvider>
  );
}

export default App;
