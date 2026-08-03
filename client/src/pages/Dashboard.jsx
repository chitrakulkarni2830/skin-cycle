import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInventory, resetInventory, removeInventory } from '../store/inventorySlice';
import { Package, Trash2 } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import { getRoutines } from '../store/routineSlice';

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { items, isLoading, isError, message } = useSelector((state) => state.inventory);
  const { routines } = useSelector((state) => state.routines);

  useEffect(() => {
    if (isError) {
      console.error(message);
    }
    dispatch(getInventory());
    dispatch(getRoutines());
    return () => {
      dispatch(resetInventory());
    };
  }, [isError, message, dispatch]);

  if (isLoading) {
    return <div className="text-center mt-20 text-slate-500">Loading inventory...</div>;
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Your Inventory</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-pastel-mint hover:bg-pastel-mint-light text-slate-800 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors border border-pastel-mint"
        >
          + Add Product
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-pastel-card-alt rounded-xl p-10 text-center shadow-sm">
          <Package className="h-16 w-16 mx-auto text-pastel-blue mb-4" />
          <h3 className="text-xl font-medium text-slate-700">No products yet</h3>
          <p className="text-slate-500 mt-2">Add products to start tracking their depletion.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items?.map((item) => {
            const product = item?.productId;

            return (
              <div key={item._id} className="bg-white border border-pastel-card-alt rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4 mt-2">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{product.brand}</span>
                    <h3 className="text-xl font-bold text-slate-800">{product.name}</h3>
                  </div>
                  <button 
                    onClick={() => dispatch(removeInventory(item._id))}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                    title="Remove from inventory"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default Dashboard;
