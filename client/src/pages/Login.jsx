import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, reset } from '../store/authSlice';
import logo from '../assets/logo.png';

function Login() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isRegisterMode) {
      const userData = { name, email, password };
      dispatch(register(userData));
    } else {
      const userData = { email, password };
      dispatch(login(userData));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full overflow-hidden px-4">
      
      {/* Central Wrapper to anchor blobs directly to the card */}
      <div className="relative w-full max-w-md">
        
        {/* Global background blobs are now handled in App.jsx */}

        {/* Login Card */}
        <div className="relative bg-slate-900/60 p-10 rounded-2xl shadow-xl w-full border border-slate-700 backdrop-blur-xl z-10 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6 animate-float">
              <img src={logo} alt="SkinCycle Logo" className="w-28 h-28 object-contain rounded-full drop-shadow-xl border-4 border-slate-700/50 bg-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pastel-pink to-pastel-peach bg-clip-text text-transparent">
            SkinCycle
          </h1>
          <p className="text-slate-300 mt-2">
            {isRegisterMode ? 'Create an account to start' : 'Sign in to manage your routine'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-pastel-bg border border-pastel-card-alt focus:border-pastel-blue focus:ring-2 focus:ring-pastel-blue-light text-slate-800 transition-colors duration-200 outline-none"
                id="name"
                name="name"
                value={name}
                placeholder="Enter your name"
                onChange={onChange}
                required={isRegisterMode}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-pastel-bg border border-pastel-card-alt focus:border-pastel-blue focus:ring-2 focus:ring-pastel-blue-light text-slate-800 transition-colors duration-200 outline-none"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-pastel-bg border border-pastel-card-alt focus:border-pastel-blue focus:ring-2 focus:ring-pastel-blue-light text-slate-800 transition-colors duration-200 outline-none"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-pastel-pink to-pastel-peach text-slate-800 font-semibold rounded-lg shadow-md hover:shadow-[0_8px_20px_rgba(250,210,225,0.4)] focus:outline-none focus:ring-2 focus:ring-pastel-pink focus:ring-opacity-75 transition-all duration-300 transform hover:-translate-y-1"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isRegisterMode ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-300">
          <button
            type="button"
            className="hover:text-pastel-blue transition-colors focus:outline-none"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
          >
            {isRegisterMode
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
