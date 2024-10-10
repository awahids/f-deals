import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import Navbar from './components/Navbar';
import Tags from './components/Tags';
import { HelmetProvider } from 'react-helmet-async';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto p-11">
          <Routes>
            <Route path="/articles" element={<ArticleList />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/" element={<ArticleList />} /> 
            <Route path="/tags" element={<Tags />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
