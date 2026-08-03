import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, CheckCircle, Circle } from 'lucide-react';

export default function TodaysRoutineWidget({ routines }) {
  const [checkedSteps, setCheckedSteps] = useState({});

  const timeOfDay = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 5 && hour < 17 ? 'AM' : 'PM';
  }, []);

  const currentRoutine = useMemo(() => {
    if (!routines || routines.length === 0) return null;
    return routines.find(r => r.timeOfDay === timeOfDay);
  }, [routines, timeOfDay]);

  const toggleStep = (stepId) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  if (!currentRoutine) {
    return (
      <div className="bg-white border border-pastel-card-alt rounded-xl p-6 mb-8 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            {timeOfDay === 'AM' ? <Sun className="text-orange-400 mr-2" /> : <Moon className="text-blue-500 mr-2" />}
            {timeOfDay === 'AM' ? 'Good Morning!' : 'Good Evening!'}
          </h2>
          <p className="text-slate-500 mt-1">You don't have an {timeOfDay} routine set up yet.</p>
        </div>
        <Link 
          to="/routine" 
          className="bg-pastel-bg hover:bg-pastel-blue-light text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors border border-pastel-card-alt"
        >
          Create Routine
        </Link>
      </div>
    );
  }

  // Sort steps by order
  const sortedSteps = [...currentRoutine.steps].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-gradient-to-r from-pastel-bg to-white border border-pastel-card-alt rounded-xl p-6 mb-8 shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            {timeOfDay === 'AM' ? <Sun className="h-6 w-6 text-orange-400 mr-2 drop-shadow-sm" /> : <Moon className="h-6 w-6 text-blue-500 mr-2 drop-shadow-sm" />}
            {timeOfDay === 'AM' ? "Good Morning!" : "Good Evening!"}
          </h2>
          <p className="text-slate-600 mt-1">Here is your <span className="font-semibold text-slate-700">{currentRoutine.name}</span> routine for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedSteps.map((step, index) => {
          const isChecked = checkedSteps[step._id];
          return (
            <div 
              key={step._id} 
              onClick={() => toggleStep(step._id)}
              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                isChecked 
                  ? 'bg-pastel-mint-light/30 border-pastel-mint opacity-70 scale-[0.98]' 
                  : 'bg-white border-pastel-card-alt hover:shadow-md hover:-translate-y-1'
              }`}
            >
              <div className="mr-3">
                {isChecked ? (
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold uppercase truncate transition-colors ${isChecked ? 'text-emerald-700' : 'text-slate-500'}`}>
                  Step {index + 1}
                </p>
                <p className={`text-sm font-bold truncate transition-all ${isChecked ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                  {step.productId?.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
