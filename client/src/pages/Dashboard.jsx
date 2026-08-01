import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInventory, resetInventory } from '../store/inventorySlice';
import { Package, AlertCircle } from 'lucide-react';

function Dashboard() {
  const dispatch = useDispatch();
  const { items, isLoading, isError, message } = useSelector((state) => state.inventory);

  useEffect(() => {
    if (isError) {
      console.error(message);
    }
    dispatch(getInventory());
    return () => {
      dispatch(resetInventory());
    };
  }, [isError, message, dispatch]);

  if (isLoading) {
    return <div className="text-center mt-20 text-slate-400">Loading inventory...</div>;
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Your Inventory</h1>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-colors">
          + Add Product
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-10 text-center">
          <Package className="h-16 w-16 mx-auto text-slate-500 mb-4" />
          <h3 className="text-xl font-medium text-slate-300">No products yet</h3>
          <p className="text-slate-500 mt-2">Add products to start tracking their depletion.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const product = item.productId;
            const percentRemaining = (item.volumeRemainingMl / product.volumeMl) * 100;
            const isLow = percentRemaining < 20;

            return (
              <div key={item._id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1">
                  <div 
                    className={`h-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${percentRemaining}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-start mb-4 mt-2">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">{product.brand}</span>
                    <h3 className="text-xl font-bold text-slate-100">{product.name}</h3>
                  </div>
                  {isLow && <AlertCircle className="text-red-400 h-5 w-5" title="Running low!" />}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-400 mb-1">
                    <span>Remaining</span>
                    <span>{Math.round(item.volumeRemainingMl)} / {product.volumeMl} ml</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${percentRemaining}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm text-slate-400">
                  <p>Est. Depletion: {item.estimatedDepletionDate ? new Date(item.estimatedDepletionDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                
                <button className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium">
                  Log Usage
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
