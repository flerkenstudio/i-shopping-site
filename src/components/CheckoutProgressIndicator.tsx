import React from 'react';
import { Mail, MapPin, Truck, CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';

interface StepStatus {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  isComplete: boolean;
  targetId: string;
}

interface CheckoutProgressIndicatorProps {
  isContactComplete: boolean;
  isShippingComplete: boolean;
  isDeliveryComplete: boolean;
  isPaymentComplete: boolean;
}

export const CheckoutProgressIndicator: React.FC<CheckoutProgressIndicatorProps> = ({
  isContactComplete,
  isShippingComplete,
  isDeliveryComplete,
  isPaymentComplete,
}) => {
  const steps: StepStatus[] = [
    {
      id: 'contact',
      label: '1. Contact Info',
      shortLabel: 'Contact',
      icon: <Mail className="w-3.5 h-3.5" />,
      isComplete: isContactComplete,
      targetId: 'step-contact',
    },
    {
      id: 'shipping',
      label: '2. Shipping Address',
      shortLabel: 'Shipping',
      icon: <MapPin className="w-3.5 h-3.5" />,
      isComplete: isShippingComplete,
      targetId: 'step-shipping',
    },
    {
      id: 'delivery',
      label: '3. Delivery Speed',
      shortLabel: 'Delivery',
      icon: <Truck className="w-3.5 h-3.5" />,
      isComplete: isDeliveryComplete,
      targetId: 'step-delivery',
    },
    {
      id: 'payment',
      label: '4. Payment Method',
      shortLabel: 'Payment',
      icon: <CreditCard className="w-3.5 h-3.5" />,
      isComplete: isPaymentComplete,
      targetId: 'step-payment',
    },
  ];

  const completedCount = steps.filter(s => s.isComplete).length;
  const progressPercentage = Math.round((completedCount / steps.length) * 100);

  // Determine current active step
  const activeStepIndex = steps.findIndex(s => !s.isComplete);
  const currentStep = activeStepIndex === -1 ? steps[steps.length - 1] : steps[activeStepIndex];

  const handleScrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const yOffset = -90; // offset for sticky navbar + progress indicator
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full mb-6 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/90 p-3.5 sm:p-4 backdrop-blur-md shadow-xs transition-colors">
      {/* Top Row: Status Text & Percentage Counter */}
      <div className="flex items-center justify-between text-xs mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            Purchase Flow
          </span>
          <span className="text-zinc-400 dark:text-zinc-600">•</span>
          <span className="font-mono text-zinc-600 dark:text-zinc-400">
            {progressPercentage === 100 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready to Confirm</span>
              </span>
            ) : (
              <span>Step {activeStepIndex + 1} of 4: {currentStep.shortLabel}</span>
            )}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100 tabular-nums">
            {progressPercentage}% Complete
          </span>
        </div>
      </div>

      {/* Hairline Progress Bar Track */}
      <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-3.5 relative">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${Math.max(5, progressPercentage)}%` }}
        />
      </div>

      {/* 4 Step Nodes & Quick Jump Links */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2">
        {steps.map((step, idx) => {
          const isCurrent = idx === activeStepIndex;
          const isDone = step.isComplete;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => handleScrollToSection(step.targetId)}
              className={`group flex items-center justify-center sm:justify-start space-x-1.5 p-2 rounded-xl text-left transition-all ${
                isDone
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                  : isCurrent
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-xs'
                  : 'bg-transparent text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 border border-transparent'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>

              <div className="hidden sm:block truncate">
                <span className="text-[11px] font-medium block truncate">
                  {step.shortLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
