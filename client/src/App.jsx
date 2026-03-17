import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyShelf from './pages/MyShelf';
import BackendWakeup from './components/BackendWakeup';  // ADD

function App() {
  return (
    <BrowserRouter>
      <BackendWakeup>  {/* ADD — wraps everything */}
        <div className="min-h-screen bg-gray-950">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/shelf" element={<MyShelf />} />
          </Routes>
        </div>
      </BackendWakeup>  {/* ADD */}
    </BrowserRouter>
  );
}

export default App;