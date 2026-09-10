import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/productSlice';
import { addInventory } from '../store/inventorySlice';
import { X, Search } from 'lucide-react';

function AddProductModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { items: products, isLoading } = useSelector((state) => state.products);
  const { isLoading: isAdding } = useSelector((state) => state.inventory);

  useEffect(() => {
    if (isOpen && products.length === 0) {
      dispatch(getProducts());
    }
  }, [isOpen, dispatch, products.length]);

  if (!isOpen) return null;

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddProduct = (productId) => {
    dispatch(addInventory({ productId })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        onClose();
        setSearchTerm('');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-pastel-card-alt overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-pastel-card-alt flex justify-between items-center bg-pastel-bg/30">
          <h2 className="text-2xl font-bold text-slate-800">Add to Inventory</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-pastel-pink transition-colors p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-pastel-card-alt">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by brand or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-pastel-bg border border-pastel-card-alt focus:border-pastel-blue focus:ring-2 focus:ring-pastel-blue-light text-slate-800 transition-colors outline-none"
            />
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No products found.</div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="p-4 rounded-xl hover:bg-pastel-bg border border-transparent hover:border-pastel-card-alt transition-colors cursor-pointer group flex justify-between items-center"
                  onClick={() => handleAddProduct(product._id)}
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{product.brand}</div>
                    <div className="font-medium text-slate-800">{product.name}</div>
                    <div className="text-sm text-slate-500 mt-1 capitalize">{product.category} • {product.volumeMl}ml</div>
                  </div>
                  <button 
                    className="opacity-0 group-hover:opacity-100 px-4 py-1.5 bg-pastel-mint text-slate-800 text-sm font-medium rounded-lg hover:bg-pastel-mint-light transition-all disabled:opacity-50"
                    disabled={isAdding}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AddProductModal;
