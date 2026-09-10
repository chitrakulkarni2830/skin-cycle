import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInventory, resetInventory, getReminders } from '../store/inventorySlice';
import { getRoutines } from '../store/routineSlice';
import { Link } from 'react-router-dom';
import { Package, FlaskConical, PlusCircle, ArrowRight, AlertTriangle, TrendingDown, User } from 'lucide-react';
import TodaysRoutineWidget from '../components/TodaysRoutineWidget';

function Dashboard() {
  const dispatch = useDispatch();
  const { items, reminders, isLoading } = useSelector((state) => state.inventory);
  const { routines } = useSelector((state) => state.routines);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getInventory());
    dispatch(getRoutines());
    dispatch(getReminders());
    return () => dispatch(resetInventory());
  }, [dispatch]);

  const totalProducts = items.length;
  const lowProducts = items.filter((item) => {
    const product = item?.productId;
    if (!product) return false;
    const pct = (item.volumeRemainingMl / product.volumeMl) * 100;
    return pct > 0 && pct <= 20;
  }).length;
  const depletedProducts = items.filter((i) => i.volumeRemainingMl <= 0).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Package className="h-10 w-10 mx-auto text-pastel-blue animate-float mb-3" />
          <p className="text-slate-500 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in-up">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-slate-500 mt-1">Here's your skincare overview for today.</p>
      </div>

      {/* Today's Routine */}
      <TodaysRoutineWidget routines={routines} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          to="/inventory"
          className="bg-white border border-pastel-card-alt rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="h-5 w-5 text-pastel-blue" />
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-pastel-blue transition-colors" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{totalProducts}</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Total Products</p>
        </Link>

        <Link
          to="/inventory"
          className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="h-5 w-5 text-amber-500" />
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
          </div>
          <p className="text-3xl font-bold text-amber-600">{lowProducts}</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mt-1">Running Low</p>
        </Link>

        <Link
          to="/inventory"
          className="bg-white border border-red-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors" />
          </div>
          <p className="text-3xl font-bold text-red-600">{depletedProducts}</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mt-1">Depleted</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          to="/inventory"
          className="flex items-center p-4 rounded-xl bg-white border border-pastel-card-alt shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-pastel-mint-light flex items-center justify-center mr-4 shrink-0">
            <Package className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800">View Inventory</p>
            <p className="text-xs text-slate-500">Track your product depletion</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/products"
          className="flex items-center p-4 rounded-xl bg-white border border-pastel-card-alt shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-pastel-blue-light flex items-center justify-center mr-4 shrink-0">
            <FlaskConical className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800">Browse Products</p>
            <p className="text-xs text-slate-500">Explore the product catalog</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/routine"
          className="flex items-center p-4 rounded-xl bg-white border border-pastel-card-alt shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-pastel-pink-light flex items-center justify-center mr-4 shrink-0">
            <PlusCircle className="h-5 w-5 text-pink-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800">Build Routine</p>
            <p className="text-xs text-slate-500">Create a new skincare routine</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent Inventory */}
      {items.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Recent Inventory</h2>
            <Link to="/inventory" className="text-sm text-pastel-blue hover:underline font-medium flex items-center">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.slice(0, 4).map((item) => {
              const product = item?.productId;
              if (!product) return null;
              const pct = Math.round((item.volumeRemainingMl / product.volumeMl) * 100);
              return (
                <div
                  key={item._id}
                  className="bg-white border border-pastel-card-alt rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {product.brand}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 mt-0.5 mb-3 leading-snug truncate">
                    {product.name}
                  </h3>
                  <div className="h-1.5 bg-pastel-bg rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct > 50 ? 'bg-emerald-400' : pct > 20 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">{pct}% remaining</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

