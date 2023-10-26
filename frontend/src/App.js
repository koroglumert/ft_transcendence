import './App.css';
import LoginPage from './pages/login-page/LoginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page404 from './pages/404page/404page';
import MainPage from './pages/MainPage/MainPage';
import GamePage from './pages/gamepage/GamePage';
import ChatApp from './pages/ChatApp/ChatApp';
import SocialPage from './pages/socialpage/SocialPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/GamePage" element={<GamePage />} />
        <Route path="/chat" element={<ChatApp />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;
