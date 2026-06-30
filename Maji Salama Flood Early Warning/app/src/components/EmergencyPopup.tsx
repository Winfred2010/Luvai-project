import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function EmergencyPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    const autoDismiss = setTimeout(() => {
      handleDismiss();
    }, 11000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoDismiss);
    };
  }, []);

  const handleDismiss = () => {
    setDismissing(true);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[150] max-w-[380px] w-[calc(100%-48px)] glass-panel border border-[rgba(255,43,43,0.3)] animate-border-glow ${
        dismissing ? 'animate-slide-out-right' : 'animate-slide-in-right'
      }`}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-ms-grey hover:text-white transition-colors"
        aria-label="Dismiss alert"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-ms-red animate-pulse-dot" />
          <span className="font-mono text-label-sm uppercase text-ms-red">
            Flood Alert
          </span>
        </div>

        <h4 className="font-display font-semibold text-heading-sm text-white mb-2">
          Mathare River Rising
        </h4>

        <p className="text-ms-grey text-body-sm mb-3">
          Water level at 3.2m — 45 min to critical threshold. Residents near Section 3A should prepare to evacuate.
        </p>

        <p className="font-mono text-body-xs text-ms-text-muted">
          Updated 3 min ago
        </p>
      </div>
    </div>
  );
}
