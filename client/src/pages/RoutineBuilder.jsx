import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRoutines, createRoutine, resetRoutines } from '../store/routineSlice';
import { AlertTriangle, Plus, Sun, Moon } from 'lucide-react';
import axios from 'axios'; // We'll just fetch products directly for this demo

function RoutineBuilder() {
  const dispatch = useDispatch();
  const { routines, isLoading } = useSelector((state) => state.routines);
  const [products, setProducts] = useState([]);
  
  // Builder state
  const [isBuilding, setIsBuilding] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineTime, setNewRoutineTime] = useState('PM');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [liveConflicts, setLiveConflicts] = useState([]);
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);

  useEffect(() => {
    dispatch(getRoutines());
    
    // Fetch all products for the builder
    axios.get('/api/products')
      .then(res => setProducts(res.data.data))
      .catch(err => console.error(err));
      
    return () => dispatch(resetRoutines());
  }, [dispatch]);

  // When selected products change, simulate instant conflict check
  useEffect(() => {
    if (selectedProducts.length < 2) {
      setLiveConflicts([]);
      return;
    }
    
    // Simulate real-time backend check
    const checkConflicts = async () => {
      setIsCheckingConflicts(true);
      try {
        // In a real app, we'd have a specific endpoint for this, 
        // but for now we'll just let the create/update endpoint do it.
        // For the sake of the live demo, we'll pretend we're calculating it on the fly.
        // Actually, let's just make a mock check here for the UI, and the real one happens on save.
        // Or we could hit a dedicated /api/routines/check endpoint.
      } catch (error) {
        console.error(error);
      }
      setIsCheckingConflicts(false);
    };
    
    checkConflicts();
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
        <h1 className="text-3xl font-bold text-white">Your Routines</h1>
        {!isBuilding && (
          <button 
            onClick={() => setIsBuilding(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-colors"
          >
            + Create Routine
          </button>
        )}
      </div>

      {isBuilding && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Routine Builder</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Routine Name</label>
              <input 
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 focus:border-blue-400 text-white"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                placeholder="e.g. Evening Recovery"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Time of Day</label>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setNewRoutineTime('AM')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors ${newRoutineTime === 'AM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-slate-900 border border-slate-700 text-slate-400'}`}
                >
                  <Sun className="h-4 w-4 mr-2" /> AM
                </button>
                <button 
                  onClick={() => setNewRoutineTime('PM')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors ${newRoutineTime === 'PM' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50' : 'bg-slate-900 border border-slate-700 text-slate-400'}`}
                >
                  <Moon className="h-4 w-4 mr-2" /> PM
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Library */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
              <h3 className="font-semibold text-slate-300 mb-4">Product Library</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {products.map(product => (
                  <div key={product._id} className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div>
                      <p className="text-xs text-blue-400 font-semibold">{product.brand}</p>
                      <p className="text-sm font-medium text-slate-200">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.activeIngredients.join(', ')}</p>
                    </div>
                    <button 
                      onClick={() => handleAddProduct(product)}
                      className="text-emerald-400 hover:text-emerald-300 p-1"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Steps */}
            <div>
              <h3 className="font-semibold text-slate-300 mb-4">Routine Steps</h3>
              {selectedProducts.length === 0 ? (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-xl text-slate-500 text-sm">
                  Add products to build your routine
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProducts.map((product, index) => (
                    <div key={product._id} className="flex items-center bg-slate-800 p-3 rounded-lg border border-slate-600 relative group">
                      <div className="bg-slate-900 text-slate-400 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">{product.name}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveProduct(product._id)}
                        className="text-red-400 hover:text-red-300 text-xs px-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
              className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveRoutine}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-colors"
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
          <div key={routine._id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center">
                  {routine.name}
                  {routine.timeOfDay === 'AM' ? 
                    <Sun className="h-5 w-5 text-amber-400 ml-2" /> : 
                    <Moon className="h-5 w-5 text-indigo-400 ml-2" />
                  }
                </h3>
              </div>
            </div>

            {routine.conflicts && routine.conflicts.length > 0 && (
              <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-red-400 font-semibold mb-2">Ingredient Conflicts Detected</h4>
                    {routine.conflicts.map((conflict, i) => (
                      <div key={i} className="mb-3 last:mb-0 text-sm">
                        <p className="text-slate-200 font-medium">{conflict.ingredientA} + {conflict.ingredientB}</p>
                        <p className="text-slate-400 mt-1">{conflict.reason}</p>
                        <p className="text-emerald-400 mt-1 flex items-center">
                          <span className="font-medium mr-1">Fix:</span> {conflict.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
              {routine.steps.sort((a,b) => a.order - b.order).map((step, index) => (
                <div key={step._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    {index + 1}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-slate-700 bg-slate-800 shadow">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-blue-400 font-semibold">{step.productId?.brand}</p>
                    </div>
                    <p className="text-slate-200 font-medium mt-1">{step.productId?.name}</p>
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
