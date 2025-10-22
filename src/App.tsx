import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameHub from './pages/GameHub';
import GameDetail from './pages/GameDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GameHub />} />
          <Route path="/game/:gameId" element={<GameDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
