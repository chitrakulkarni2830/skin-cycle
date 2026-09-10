import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RoutineBuilder from './pages/RoutineBuilder';
import Inventory from './pages/Inventory';
import ProductCatalog from './pages/ProductCatalog';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-pastel-bg text-slate-800 flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden">
        
        {/* Global Background Animated Blobs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-[30rem] h-[30rem] bg-pastel-blue rounded-full blur-3xl animate-blob opacity-60"></div>
          <div className="absolute top-20 right-10 w-[30rem] h-[30rem] bg-pastel-mint rounded-full blur-3xl animate-blob animation-delay-2000 opacity-60"></div>
          <div className="absolute -bottom-20 left-1/3 w-[30rem] h-[30rem] bg-pastel-pink rounded-full blur-3xl animate-blob animation-delay-4000 opacity-60"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          {user && <Navbar />}
          <main className="flex-1 container mx-auto p-4 max-w-6xl">
            <Routes>
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/inventory" element={user ? <Inventory /> : <Navigate to="/login" />} />
              <Route path="/products" element={user ? <ProductCatalog /> : <Navigate to="/login" />} />
              <Route path="/routine" element={user ? <RoutineBuilder /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

