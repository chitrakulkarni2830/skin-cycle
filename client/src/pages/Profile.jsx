import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateSkinProfile, resetUser } from '../store/userSlice';
import { User, Droplets, Shield, Save, X, Plus, Calendar } from 'lucide-react';

const SKIN_TYPES = ['normal', 'oily', 'dry', 'combination', 'sensitive'];
const COMMON_CONCERNS = [
  'Acne', 'Hyperpigmentation', 'Fine Lines', 'Dark Circles',
  'Dullness', 'Large Pores', 'Redness', 'Uneven Texture',
  'Dehydration', 'Sun Damage'
];

function TagInput({ tags, onChange, suggestions, label, icon: Icon, color }) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const unusedSuggestions = suggestions?.filter((s) => !tags.includes(s)) || [];

  return (
    <div>
      <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
        <Icon className="h-4 w-4 mr-2" />
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center text-sm px-3 py-1 rounded-full font-medium border ${color}`}
          >
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1.5 hover:opacity-70">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter…"
          className="flex-1 px-3 py-2 rounded-lg bg-pastel-bg border border-pastel-card-alt focus:border-pastel-blue focus:ring-2 focus:ring-pastel-blue-light text-slate-800 text-sm outline-none transition-colors"
        />
        <button
          type="button"
          onClick={() => addTag(inputValue)}
          className="px-3 py-2 bg-pastel-bg border border-pastel-card-alt rounded-lg hover:bg-white transition-colors"
        >
          <Plus className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {unusedSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="text-xs px-2.5 py-1 rounded-full bg-white border border-pastel-card-alt text-slate-500 hover:border-pastel-blue hover:text-slate-700 transition-colors"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Profile() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { profile, isLoading, isSuccess } = useSelector((state) => state.user);

  const [skinType, setSkinType] = useState('normal');
  const [concerns, setConcerns] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (user?._id) {
      dispatch(getProfile(user._id));
    }
    return () => dispatch(resetUser());
  }, [dispatch, user]);

  useEffect(() => {
    if (profile?.skinProfile) {
      setSkinType(profile.skinProfile.skinType || 'normal');
      setConcerns(profile.skinProfile.concerns || []);
      setAllergies(profile.skinProfile.allergies || []);
    }
  }, [profile]);

  const handleSave = () => {
    dispatch(
      updateSkinProfile({
        userId: user._id,
        skinProfileData: { skinType, concerns, allergies },
      })
    ).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setSaveMessage('Profile updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    });
  };

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '—';

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <User className="h-10 w-10 mx-auto text-pastel-blue animate-float mb-3" />
          <p className="text-slate-500 font-medium">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in-up max-w-3xl mx-auto">
      {/* Header card */}
      <div className="bg-gradient-to-r from-pastel-pink-light to-pastel-peach rounded-2xl p-8 mb-8 shadow-md border border-pastel-pink/30">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm border-2 border-white shadow-lg flex items-center justify-center">
            <span className="text-3xl font-bold text-pastel-pink">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{user?.name || 'User'}</h1>
            <p className="text-slate-600">{user?.email}</p>
            <div className="flex items-center text-sm text-slate-500 mt-1">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              Member since {memberSince}
            </div>
          </div>
        </div>
      </div>

      {/* Skin Profile Form */}
      <div className="bg-white border border-pastel-card-alt rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Droplets className="h-5 w-5 mr-2 text-pastel-blue" />
          Skin Profile
        </h2>

        <div className="space-y-6">
          {/* Skin Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Skin Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SKIN_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSkinType(type)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium capitalize transition-all border ${
                    skinType === type
                      ? 'bg-pastel-blue text-slate-800 border-pastel-blue shadow-sm scale-[1.02]'
                      : 'bg-pastel-bg text-slate-600 border-pastel-card-alt hover:bg-white hover:border-pastel-blue-light'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Concerns */}
          <TagInput
            tags={concerns}
            onChange={setConcerns}
            suggestions={COMMON_CONCERNS}
            label="Skin Concerns"
            icon={Shield}
            color="bg-pastel-peach text-orange-700 border-orange-200"
          />

          {/* Allergies */}
          <TagInput
            tags={allergies}
            onChange={setAllergies}
            suggestions={[]}
            label="Known Allergies"
            icon={Shield}
            color="bg-red-50 text-red-700 border-red-200"
          />
        </div>

        {/* Save */}
        <div className="mt-8 flex items-center justify-between">
          {saveMessage && (
            <p className="text-sm font-medium text-emerald-600 animate-fade-in-up">{saveMessage}</p>
          )}
          <div className="flex-1" />
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center bg-pastel-mint hover:bg-emerald-300 text-slate-800 px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all hover:-translate-y-0.5 border border-pastel-mint disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
