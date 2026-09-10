import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/productSlice';
import { addInventory } from '../store/inventorySlice';
import { Search, Droplets, FlaskConical, Sun, Sparkles, ShowerHead, Check, Plus } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All', icon: Sparkles },
  { key: 'cleanser', label: 'Cleansers', icon: ShowerHead },
  { key: 'serum', label: 'Serums', icon: FlaskConical },
  { key: 'moisturizer', label: 'Moisturizers', icon: Droplets },
  { key: 'sunscreen', label: 'Sunscreens', icon: Sun },
];

function ProductCatalog() {
  const dispatch = useDispatch();
  const { items: products, isLoading } = useSelector((state) => state.products);
  const { items: inventoryItems } = useSelector((state) => state.inventory);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [recentlyAdded, setRecentlyAdded] = useState(new Set());

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Products already in inventory
  const ownedProductIds = useMemo(() => {
    return new Set(inventoryItems.map((item) => item.productId?._id || item.productId));
  }, [inventoryItems]);

  const filteredProducts = useMemo(() => {
    return (products || []).filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.activeIngredients?.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  const handleAddToInventory = (productId) => {
    dispatch(addInventory({ productId })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setRecentlyAdded((prev) => new Set(prev).add(productId));
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <FlaskConical className="h-10 w-10 mx-auto text-pastel-blue animate-float mb-3" />
          <p className="text-slate-500 font-medium">Loading products…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Product Catalog</h1>
        <p className="text-slate-500 mt-1">Browse skincare products and add them to your inventory.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, brand, or ingredient…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-pastel-card-alt focus:border-pastel-blue focus:ring-2 focus:ring-pastel-blue-light text-slate-800 transition-colors outline-none shadow-sm"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                isActive
                  ? 'bg-pastel-blue text-slate-800 border-pastel-blue shadow-sm'
                  : 'bg-white text-slate-600 border-pastel-card-alt hover:bg-pastel-bg hover:border-pastel-blue-light'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">
        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </p>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-pastel-card-alt rounded-xl p-10 text-center shadow-sm">
          <Search className="h-12 w-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-700">No products found</h3>
          <p className="text-slate-500 mt-1">Try a different search term or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isOwned = ownedProductIds.has(product._id) || recentlyAdded.has(product._id);

            return (
              <div
                key={product._id}
                className="bg-white border border-pastel-card-alt rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 group relative overflow-hidden"
              >
                {/* Category badge */}
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-pastel-blue bg-pastel-blue-light px-2.5 py-1 rounded-full mb-3 capitalize">
                  {product.category}
                </span>

                {/* Brand & Name */}
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {product.brand}
                </p>
                <h3 className="text-lg font-bold text-slate-800 mt-0.5 mb-3 leading-snug">
                  {product.name}
                </h3>

                {/* Volume */}
                <p className="text-sm text-slate-500 mb-3">{product.volumeMl}ml</p>

                {/* Active Ingredients */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {product.activeIngredients?.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="text-xs bg-pastel-mint-light text-slate-700 px-2 py-0.5 rounded-full border border-pastel-mint"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>

                {/* Add / Owned button */}
                {isOwned ? (
                  <button
                    disabled
                    className="w-full flex items-center justify-center py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-medium text-sm border border-emerald-200 cursor-default"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    In Inventory
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToInventory(product._id)}
                    className="w-full flex items-center justify-center py-2.5 rounded-lg bg-pastel-mint hover:bg-emerald-300 text-slate-800 font-medium text-sm border border-pastel-mint transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Inventory
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductCatalog;
