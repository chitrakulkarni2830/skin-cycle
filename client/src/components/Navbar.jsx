import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../store/authSlice';
import { LogOut, LayoutDashboard, Package, FlaskConical, PlusCircle, User } from 'lucide-react';
import logo from '../assets/logo.png';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/products', label: 'Products', icon: FlaskConical },
  { to: '/routine', label: 'Routines', icon: PlusCircle },
];

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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
            <img src={logo} alt="SkinCycle Logo" className="h-10 w-10 object-contain rounded-full drop-shadow-sm group-hover:scale-105 transition-transform bg-white" />
            <span className="text-xl font-bold text-slate-800 transition-colors">SkinCycle</span>
          </Link>
          
          <div className="flex items-center space-x-1 sm:space-x-4">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-pastel-blue-light text-slate-800'
                      : 'text-slate-600 hover:text-pastel-blue hover:bg-pastel-bg'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1.5 hidden sm:block" />
                  <span>{label}</span>
                </Link>
              );
            })}
            
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
            
            <Link
              to="/profile"
              className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all border-2 ${
                location.pathname === '/profile'
                  ? 'bg-pastel-pink text-slate-800 border-pastel-pink'
                  : 'bg-pastel-bg text-slate-600 border-pastel-card-alt hover:border-pastel-pink'
              }`}
              title="Profile"
            >
              {user?.name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
            </Link>

            <button 
              onClick={onLogout}
              className="flex items-center text-pastel-pink hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-pastel-pink-light"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

