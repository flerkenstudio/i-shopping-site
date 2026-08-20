import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
          info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />,
        };

        const borderColors = {
          success: 'border-emerald-500/40 bg-zinc-950/95 text-zinc-100',
          warning: 'border-amber-500/40 bg-zinc-950/95 text-zinc-100',
          error: 'border-rose-500/40 bg-zinc-950/95 text-zinc-100',
          info: 'border-zinc-700 bg-zinc-950/95 text-zinc-100',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3 rounded-xl border shadow-xl flex items-start justify-between gap-3 text-xs transition-all animate-in fade-in slide-in-from-bottom-2 ${borderColors[toast.type]}`}
          >
            <div className="flex items-start space-x-2.5">
              {icons[toast.type]}
              <div>
                <p className="font-semibold text-zinc-100">{toast.title}</p>
                {toast.description && (
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                    {toast.description}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss toast"
              className="text-zinc-500 hover:text-zinc-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
