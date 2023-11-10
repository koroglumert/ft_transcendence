import './App.css';
import LoginPage from './pages/login-page/LoginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page404 from './pages/404page/404page';
import MainPage from './pages/MainPage/MainPage';
import GamePage from './pages/gamepage/GamePage';
import ChatApp from './pages/ChatApp/ChatApp';
import SocialPage from './pages/socialpage/SocialPage';
import GroupChat from './pages/GroupChat/GroupChat';
import GroupChats from './pages/ChatApp/GroupChats';
import BioPage from './pages/biopage/BioPage';
import ProfilePage from './pages/ProfilePage/ProfilPage';
import NavbarMenu from './components/Navbar';
import TwoFactorAuth from './pages/2fapage/2fapage';
import PasswordInput from './pages/2fapage/2faTruePage.jsx';
import ImageUpload from './pages/UploadPhoto.jsx';

function App() {
  const isNavbarVisible = window.location.pathname !== '/MainPage' && window.location.pathname !== '/GamePage' && window.location.pathname !== '/chat'
  && window.location.pathname !== '/social' && window.location.pathname !== '/group'

  return (
    <Router>
      {!isNavbarVisible && <NavbarMenu />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/2fapage" element={<TwoFactorAuth />} />
        <Route path="/2faTruePage" element={<PasswordInput />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/GamePage" element={<GamePage />} />
        <Route path="/chat" element={<ChatApp />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/group" element={<GroupChat />} />
        <Route path="/groups" element={<GroupChats />} />
        <Route path="/bio" element={<BioPage />} />
        <Route path="/profile/:name" element={<ProfilePage />} />
        <Route path="*" element={<Page404 />} />
        <Route path="/img" element={<ImageUpload />} />
      </Routes>
    </Router>
  );
}

export default App;