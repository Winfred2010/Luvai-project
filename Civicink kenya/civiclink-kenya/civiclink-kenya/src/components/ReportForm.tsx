import React, { useState, useEffect } from 'react';
import { ReportCategory, UserProfile, Location } from '../types';
import { 
  Camera, 
  MapPin, 
  Send, 
  CornerDownRight, 
  AlertTriangle, 
  Image as ImageIcon, 
  X, 
  FileVideo,
  CheckCircle2
} from 'lucide-react';

interface ReportFormProps {
  userProfile: UserProfile;
  preFilledDraft: { title: string; category: ReportCategory; description: string } | null;
  onSelectCoordinateMode: (active: boolean) => void;
  selectedCoordinates: { lat: number; lng: number; address: string } | null;
  onSubmitReport: (reportData: {
    title: string;
    category: ReportCategory;
    description: string;
    photoUrl?: string;
    videoUrl?: string;
    location: Location;
  }) => void;
  onCancel: () => void;
}

// Preset assets for demo modeling
const PRESET_DEMO_PHOTOS = [
  {
    name: '💧 Burst Water Main',
    url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: '🛣️ Pothole / Road Damage',
    url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: '🏥 Damaged Building',
    url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=60'
  }
];

export default function ReportForm({
  userProfile,
  preFilledDraft,
  onSelectCoordinateMode,
  selectedCoordinates,
  onSubmitReport,
  onCancel
}: ReportFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory>('water');
  const [description, setDescription] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(-1.2921);
  const [lng, setLng] = useState(36.8219);
  const [photoUrl, setPhotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [isPinpointing, setIsPinpointing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Pre-fill fields if a draft is supplied by the AI Assistant
  useEffect(() => {
    if (preFilledDraft) {
      setTitle(preFilledDraft.title);
      setCategory(preFilledDraft.category);
      setDescription(preFilledDraft.description);
      // Give a small notification or scroll cue
    }
  }, [preFilledDraft]);

  // Update form fields when map coordinates are pinpointed
  useEffect(() => {
    if (selectedCoordinates) {
      setLat(selectedCoordinates.lat);
      setLng(selectedCoordinates.lng);
      setAddress(selectedCoordinates.address);
      // Extract county
      if (selectedCoordinates.address.includes('Mombasa')) setCounty('Mombasa');
      else if (selectedCoordinates.address.includes('Kisumu')) setCounty('Kisumu');
      else if (selectedCoordinates.address.includes('Nakuru')) setCounty('Nakuru');
      else if (selectedCoordinates.address.includes('Eldoret')) setCounty('Eldoret');
      else if (selectedCoordinates.address.includes('Makueni')) setCounty('Makueni');
      else if (selectedCoordinates.address.includes('Machakos')) setCounty('Machakos');
      else if (selectedCoordinates.address.includes('Kitui')) setCounty('Kitui');
      else setCounty('Nairobi');

      // Stop map coordinate pinpoint mode
      onSelectCoordinateMode(false);
      setIsPinpointing(false);
    }
  }, [selectedCoordinates]);

  const togglePinpointMode = () => {
    const nextState = !isPinpointing;
    setIsPinpointing(nextState);
    onSelectCoordinateMode(nextState);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !address) {
      alert("Please fill in the title, description, and address coordinates.");
      return;
    }

    onSubmitReport({
      title,
      category,
      description,
      photoUrl: photoUrl || undefined,
      videoUrl: videoUrl || undefined,
      location: {
        lat,
        lng,
        county,
        address
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-1.5">
            <AlertTriangle className="w-5 h-5 text-emerald-600 animate-pulse" />
            Report Community Challenge
          </h3>
          <p className="text-xs text-slate-500">File broken mains, grid failure, roads, and services.</p>
        </div>
        <button 
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 text-xs py-1.5 px-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
        
        {/* Category Choice */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase">Challenge Category</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { id: 'water', label: '💧 Water/Sewer' },
              { id: 'electricity', label: '⚡ Electricity' },
              { id: 'roads', label: '🛣️ Roads/Pothole' },
              { id: 'infrastructure', label: '🏥 Infrastructure' },
              { id: 'other', label: '📋 Other Public' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id as ReportCategory)}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold border text-left transition-all cursor-pointer ${
                  category === cat.id
                    ? 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase">Challenge Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Broken Water Pipe near Sarit Center Roundabout"
            className="w-full bg-slate-50 border border-slate-250 text-xs rounded-xl p-3 outline-none focus:bg-white focus:border-brand-green transition-all"
            required
          />
        </div>

        {/* Detailed Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase">Problem Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide precise details: Is it flooding the road? Are households missing service? What is the neighborhood safety risk?"
            rows={3}
            className="w-full bg-slate-50 border border-slate-250 text-xs rounded-xl p-3 outline-none focus:bg-white focus:border-brand-green transition-all"
            required
          />
        </div>

        {/* Coordinates and Geo pinpointing */}
        <div className="space-y-2 border-t border-slate-100 pt-3">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-slate-500 uppercase">GPS Location & Address</label>
            <button
              type="button"
              onClick={togglePinpointMode}
              className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                isPinpointing 
                  ? 'bg-emerald-600 text-white animate-pulse' 
                  : 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {isPinpointing ? '🚨 Pinpointing Active... Click Map' : '🎯 Pinpoint Location on Live Map'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Latitude</span>
              <input 
                type="number" 
                step="any"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none text-slate-700"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Longitude</span>
              <input 
                type="number" 
                step="any"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">County Jurisdiction</span>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none"
              >
                <option value="Nairobi">Nairobi County</option>
                <option value="Mombasa">Mombasa County</option>
                <option value="Kisumu">Kisumu County</option>
                <option value="Nakuru">Nakuru County</option>
                <option value="Eldoret">Eldoret County</option>
                <option value="Makueni">Makueni County</option>
                <option value="Machakos">Machakos County</option>
                <option value="Kitui">Kitui County</option>
              </select>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Specific Street Address</span>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Ring Road Westlands, near roundabout"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Media Attachments */}
        <div className="space-y-2 border-t border-slate-100 pt-3">
          <label className="block text-xs font-bold text-slate-500 uppercase">Attach Challenge Photo (JPEG/PNG)</label>
          
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
              dragActive 
                ? 'border-emerald-600 bg-emerald-50' 
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-6 h-6 text-slate-400" />
            <div className="text-xs text-slate-500 font-medium">
              Drag and drop your challenge photo, or{' '}
              <label className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer">
                browse files
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden" 
                />
              </label>
            </div>
            <p className="text-[9px] text-slate-400">Supports JPEG, PNG up to 5MB</p>
          </div>

          {/* Preset Demo Selection */}
          <div className="space-y-1 mt-1">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Sandbox Testing preset photos:</span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {PRESET_DEMO_PHOTOS.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPhotoUrl(photo.url)}
                  className="bg-white border border-slate-200 hover:border-emerald-600 text-[10px] font-semibold text-slate-600 hover:text-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-3xs cursor-pointer shrink-0 transition-all"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  {photo.name}
                </button>
              ))}
            </div>
          </div>

          {photoUrl && (
            <div className="relative mt-2 p-1 border border-slate-200 rounded-lg inline-block bg-slate-50">
              <img src={photoUrl} alt="Report attachment" className="h-14 w-auto rounded object-cover" />
              <button 
                type="button"
                onClick={() => setPhotoUrl('')}
                className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Actions buttons */}
        <div className="pt-3 border-t border-slate-150 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-slate-250 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-brand-green hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            File Report
          </button>
        </div>

      </form>
    </div>
  );
}
