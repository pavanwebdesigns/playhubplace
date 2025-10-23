import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameHub from './pages/GameHub';
import GameDetail from './pages/GameDetail';
import ToolsPage from './pages/ToolsPage';
import BlogComingSoon from './pages/BlogComingSoon'; // <-- 1. IMPORT IT

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<GameHub />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/blog" element={<BlogComingSoon />} /> {/* <-- 2. ADD THE ROUTE */}
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;