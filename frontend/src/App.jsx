import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PostList from './pages/public/PostList';
import BlogDetail from './pages/public/BlogDetail';

function App() {
  return (
    <Router>
      <Navbar />
      <Header />
      <Routes>
        <Route path="/" element={<PostList />} /> 
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;