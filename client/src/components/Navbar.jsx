import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../store/authSlice';
import { Droplets, LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-pastel-card-alt sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Droplets className="h-6 w-6 text-pastel-mint group-hover:text-pastel-blue transition-colors drop-shadow-sm" />
            <span className="text-xl font-bold text-slate-800 transition-colors">SkinCycle</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center text-slate-600 hover:text-pastel-blue transition-colors">
              <LayoutDashboard className="h-5 w-5 mr-1.5" />
              <span className="font-medium">Inventory</span>
            </Link>
            <Link to="/routine" className="flex items-center text-slate-600 hover:text-pastel-blue transition-colors">
              <PlusCircle className="h-5 w-5 mr-1.5" />
              <span className="font-medium">Routines</span>
            </Link>
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            
            <div className="flex items-center">
              <span className="text-slate-600 mr-4 text-sm hidden md:block">
                Hello, {user?.name || 'User'}
              </span>
              <button 
                onClick={onLogout}
                className="flex items-center text-pastel-pink hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-pastel-pink-light"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
