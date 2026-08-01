import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRoutines, createRoutine, resetRoutines } from '../store/routineSlice';
import { AlertTriangle, Plus, Sun, Moon } from 'lucide-react';
import axios from 'axios';

function RoutineBuilder() {
  const dispatch = useDispatch();
  const { routines, isLoading } = useSelector((state) => state.routines);
  const [products, setProducts] = useState([]);
  
  const [isBuilding, setIsBuilding] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineTime, setNewRoutineTime] = useState('PM');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [liveConflicts, setLiveConflicts] = useState([]);
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);

  useEffect(() => {
    dispatch(getRoutines());
    
    axios.get('/api/products')
      .then(res => setProducts(res.data.data))
      .catch(err => console.error(err));
      
    return () => dispatch(resetRoutines());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProducts.length < 2) {
      setLiveConflicts([]);
      return;
    }
  }, [selectedProducts]);

  const handleAddProduct = (product) => {
    if (!selectedProducts.find(p => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p._id !== productId));
  };

  const handleSaveRoutine = () => {
    if (!newRoutineName || selectedProducts.length === 0) return;
    
    dispatch(createRoutine({
      name: newRoutineName,
      timeOfDay: newRoutineTime,
      steps: selectedProducts.map((p, index) => ({
        productId: p._id,
        order: index + 1
      }))
    })).then(() => {
      setIsBuilding(false);
      setNewRoutineName('');
      setSelectedProducts([]);
    });
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Your Routines</h1>
        {!isBuilding && (
          <button 
            onClick={() => setIsBuilding(true)}
            className="bg-pastel-blue hover:bg-pastel-blue-light text-slate-800 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors border border-pastel-blue"
          >
            + Create Routine
          </button>
        )}
      </div>

      {isBuilding && (
        <div className="bg-white border border-pastel-card-alt rounded-xl p-6 mb-8 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Routine Builder</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Routine Name</label>
              <input 
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-pastel-bg border border-pastel-card-alt focus:border-pastel-blue focus:ring-2 focus:ring-pastel-blue-light text-slate-800 outline-none transition-colors"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                placeholder="e.g. Evening Recovery"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time of Day</label>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setNewRoutineTime('AM')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors ${newRoutineTime === 'AM' ? 'bg-pastel-peach text-orange-600 border border-orange-200 shadow-sm' : 'bg-pastel-bg border border-pastel-card-alt text-slate-500 hover:bg-white'}`}
                >
                  <Sun className="h-4 w-4 mr-2" /> AM
                </button>
                <button 
                  onClick={() => setNewRoutineTime('PM')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors ${newRoutineTime === 'PM' ? 'bg-pastel-blue-light text-blue-700 border border-blue-200 shadow-sm' : 'bg-pastel-bg border border-pastel-card-alt text-slate-500 hover:bg-white'}`}
                >
                  <Moon className="h-4 w-4 mr-2" /> PM
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Library */}
            <div className="bg-pastel-bg rounded-xl p-4 border border-pastel-card-alt">
              <h3 className="font-semibold text-slate-700 mb-4">Product Library</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {products.map(product => (
                  <div key={product._id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-pastel-card-alt shadow-sm">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase">{product.brand}</p>
                      <p className="text-sm font-bold text-slate-800">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.activeIngredients.join(', ')}</p>
                    </div>
                    <button 
                      onClick={() => handleAddProduct(product)}
                      className="text-pastel-mint hover:text-emerald-500 p-1 bg-pastel-mint-light/50 rounded-full transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Steps */}
            <div>
              <h3 className="font-semibold text-slate-700 mb-4">Routine Steps</h3>
              {selectedProducts.length === 0 ? (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-pastel-card-alt bg-pastel-bg/50 rounded-xl text-slate-500 text-sm">
                  Add products to build your routine
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProducts.map((product, index) => (
                    <div key={product._id} className="flex items-center bg-white p-3 rounded-lg border border-pastel-card-alt shadow-sm relative group">
                      <div className="bg-pastel-bg text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 font-bold border border-pastel-card-alt">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{product.name}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveProduct(product._id)}
                        className="text-pastel-pink hover:text-red-500 text-xs px-2 opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button 
              onClick={() => setIsBuilding(false)}
              className="px-6 py-2 text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveRoutine}
              className="bg-pastel-mint hover:bg-emerald-300 text-slate-800 px-6 py-2 rounded-lg font-medium shadow-sm transition-colors border border-pastel-mint"
              disabled={selectedProducts.length === 0}
            >
              Save Routine
            </button>
          </div>
        </div>
      )}

      {/* Saved Routines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routines.map(routine => (
          <div key={routine._id} className="bg-white border border-pastel-card-alt rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                  {routine.name}
                  {routine.timeOfDay === 'AM' ? 
                    <Sun className="h-5 w-5 text-orange-400 ml-2 drop-shadow-sm" /> : 
                    <Moon className="h-5 w-5 text-blue-500 ml-2 drop-shadow-sm" />
                  }
                </h3>
              </div>
            </div>

            {routine.conflicts && routine.conflicts.length > 0 && (
              <div className="mb-6 bg-pastel-pink-light/50 border border-pastel-pink rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-red-700 font-bold mb-2">Ingredient Conflicts Detected</h4>
                    {routine.conflicts.map((conflict, i) => (
                      <div key={i} className="mb-3 last:mb-0 text-sm">
                        <p className="text-slate-800 font-bold">{conflict.ingredientA} + {conflict.ingredientB}</p>
                        <p className="text-slate-600 mt-1">{conflict.reason}</p>
                        <p className="text-emerald-700 mt-1 flex items-center">
                          <span className="font-bold mr-1">Fix:</span> {conflict.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-pastel-card-alt">
              {routine.steps.sort((a,b) => a.order - b.order).map((step, index) => (
                <div key={step._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-pastel-mint-light text-slate-700 font-bold shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {index + 1}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-pastel-card-alt bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 font-bold uppercase">{step.productId?.brand}</p>
                    </div>
                    <p className="text-slate-800 font-bold mt-1">{step.productId?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoutineBuilder;
