import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, Check, Scan, AlertTriangle, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
  productsList: Product[];
}

export default function ScannerModal({
  isOpen,
  onClose,
  onBarcodeScanned,
  productsList
}: ScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize camera preview stream
  useEffect(() => {
    async function startCamera() {
      setIsInitializing(true);
      setCameraError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.warn('Camera permission or availability denied:', err);
        setCameraError(
          'Active camera access was blocked by the browser iframe sandbox. This is normal in code workspace previews! Please use the rapid Simulator buttons below to test scanning logs.'
        );
      } finally {
        setIsInitializing(false);
      }
    }

    if (isOpen) {
      startCamera();
    }

    return () => {
      // Cleanup camera streams on close
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const triggerMockScan = (barcodeStr: string) => {
    onBarcodeScanned(barcodeStr);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white border rounded-xl w-full max-w-lg shadow-md overflow-hidden flex flex-col max-h-[90vh] text-xs font-sans">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Camera className="h-4.5 w-4.5 text-indigo-650" />
            <h3 className="font-sans font-semibold text-slate-900 text-sm">Product Barcode & QR Scanner</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 bg-white border rounded-full h-6 w-6 flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Camera Stage Container */}
        <div className="p-5 flex flex-col items-center gap-4 border-b border-slate-100 bg-slate-950 text-white relative">
          
          {/* Active video container */}
          <div className="h-56 w-full max-w-sm rounded-lg overflow-hidden relative bg-slate-900 flex items-center justify-center border border-slate-800">
            {isInitializing ? (
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
                <span className="text-[10px] text-slate-400 font-mono">BOOTING VIEWPORT...</span>
              </div>
            ) : cameraError ? (
              <div className="p-6 text-center space-y-2">
                <AlertTriangle className="h-7 w-7 text-amber-500 mx-auto" />
                <p className="text-[10px] text-slate-400 leading-normal font-sans">{cameraError}</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {/* Glowing Scan Crosshairs Overlay */}
            {!cameraError && !isInitializing && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="h-36 w-64 border-2 border-indigo-550 rounded flex items-center justify-center relative shadow-inner">
                  {/* Glowing Laser */}
                  <div className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-md shadow-rose-500/80 top-1/2 animate-bounce" />
                  <span className="text-[9px] font-mono text-indigo-300 absolute -bottom-6 uppercase tracking-widest text-center w-full">ALIGNED IN CROSSHAIR</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* POS Simulation Control Deck */}
        <div className="p-5 space-y-3.5 bg-slate-50">
          <div className="text-center">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">RAPID BARCODE SIMULATOR</span>
            <p className="text-[9px] text-slate-400 mt-0.5">Click any active stock ID below to trigger mock scanner reads immediately.</p>
          </div>

          <div className="max-h-48 overflow-y-auto border border-slate-205 rounded-lg bg-white p-2.5 divide-y divide-slate-100">
            {productsList.length === 0 ? (
              <p className="text-center text-slate-400 italic py-2 text-[10.5px]">No products in current branch.</p>
            ) : (
              productsList.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => triggerMockScan(p.barcode)}
                  className="w-full text-left py-2 px-2 hover:bg-slate-50 rounded flex items-center justify-between text-[11px] group transition"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-sans font-medium text-slate-800 truncate block group-hover:text-indigo-650">{p.name}</span>
                    <span className="font-mono text-[9px] text-slate-400 block mt-0.5">SKU: {p.sku} | Barcode: {p.barcode}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 group-hover:bg-indigo-50 border border-slate-200 group-hover:border-indigo-150 px-2 py-0.5 rounded">
                    <Scan className="h-3 w-3 text-slate-400 group-hover:text-indigo-600" />
                    <span className="font-mono font-bold text-[10px] text-slate-600 group-hover:text-indigo-700">Scan</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/30">
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-slate-900 hover:bg-slate-950 text-white font-sans font-semibold rounded shadow-xs cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
