import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInventory, resetInventory, removeInventory, getReminders } from '../store/inventorySlice';
import { Package, Trash2, Droplets, AlertTriangle, Clock, Plus, ShoppingCart } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';

function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { items, reminders, isLoading } = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(getInventory());
    dispatch(getReminders());
    return () => dispatch(resetInventory());
  }, [dispatch]);

  const getStatus = (item) => {
    if (item.volumeRemainingMl <= 0) return 'depleted';
    const product = item.productId;
    if (!product) return 'healthy';
    const pct = (item.volumeRemainingMl / product.volumeMl) * 100;
    if (pct <= 20) return 'low';
    return 'healthy';
  };

  const statusConfig = {
    healthy: { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    low: { label: 'Running Low', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    depleted: { label: 'Depleted', color: 'bg-red-100 text-red-700 border-red-200' },
  };

  const stats = {
    total: items.length,
    low: items.filter((i) => getStatus(i) === 'low').length,
    depleted: items.filter((i) => getStatus(i) === 'depleted').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Droplets className="h-10 w-10 mx-auto text-pastel-blue animate-float mb-3" />
          <p className="text-slate-500 font-medium">Loading inventory…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Inventory</h1>
          <p className="text-slate-500 mt-1">Track your skincare products and depletion.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-pastel-mint hover:bg-emerald-300 text-slate-800 px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all hover:-translate-y-0.5 border border-pastel-mint"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-pastel-card-alt rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Products</p>
          <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">Running Low</p>
          <p className="text-3xl font-bold text-amber-600">{stats.low}</p>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-1">Depleted</p>
          <p className="text-3xl font-bold text-red-600">{stats.depleted}</p>
        </div>
      </div>

      {/* Reorder Reminders Banner */}
      {reminders && reminders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <ShoppingCart className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-amber-800">Time to reorder!</p>
            <p className="text-sm text-amber-700 mt-0.5">
              {reminders.map((r) => r.productId?.name).filter(Boolean).join(', ')} — running low and may need a restock soon.
            </p>
          </div>
        </div>
      )}

      {/* Inventory Grid */}
      {items.length === 0 ? (
        <div className="bg-white border border-pastel-card-alt rounded-xl p-10 text-center shadow-sm">
          <Package className="h-16 w-16 mx-auto text-pastel-blue mb-4" />
          <h3 className="text-xl font-medium text-slate-700">No products yet</h3>
          <p className="text-slate-500 mt-2">Add products to start tracking their depletion.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const product = item?.productId;
            if (!product) return null;

            const status = getStatus(item);
            const cfg = statusConfig[status];
            const pct = Math.round((item.volumeRemainingMl / product.volumeMl) * 100);
            const depletionDate = item.estimatedDepletionDate
              ? new Date(item.estimatedDepletionDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '—';

            return (
              <div
                key={item._id}
                className="bg-white border border-pastel-card-alt rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group"
              >
                {/* Status badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <button
                    onClick={() => dispatch(removeInventory(item._id))}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100"
                    title="Remove from inventory"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Product info */}
                <div className="mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {product.brand}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mt-0.5">{product.name}</h3>
                  <p className="text-xs text-slate-500 capitalize mt-1">{product.category} • {product.volumeMl}ml</p>
                </div>

                {/* Volume bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>{item.volumeRemainingMl.toFixed(0)}ml remaining</span>
                    <span className="font-bold">{pct}%</span>
                  </div>
                  <div className="h-2 bg-pastel-bg rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct > 50 ? 'bg-emerald-400' : pct > 20 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>

                {/* Depletion date */}
                <div className="flex items-center text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  <span>Est. depletion: {depletionDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Inventory;
