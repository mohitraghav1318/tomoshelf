import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyShelf from './pages/MyShelf';
import Browse from './pages/Browse';
import Settings from './pages/Settings';
import BackendWakeup from './components/BackendWakeup';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Documentation from './pages/Documentation';
import APIGuide from './pages/APIGuide';

function App() {
  return (
    <BrowserRouter>
      <BackendWakeup>
        <div className="flex flex-col min-h-screen bg-black">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/shelf" element={<MyShelf />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/api-guide" element={<APIGuide />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BackendWakeup>
    </BrowserRouter>
  );
}

export default App;