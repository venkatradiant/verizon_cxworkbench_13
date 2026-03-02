import React from 'react';
import { 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  User, 
  ShieldCheck, 
  Zap, 
  Star,
  ArrowRight,
  Info,
  Clock,
  LayoutGrid,
  Shield,
  ShoppingBag,
  Package,
  CheckCircle
} from 'lucide-react';
import { clsx } from 'clsx';

interface VisualProps {
  journeyName: string;
  stepName: string;
  platform: 'Web' | 'Mobile' | 'Hybrid';
}

const DeviceFrame = ({ children, platform }: { children: React.ReactNode, platform: string }) => {
  if (platform === 'Mobile') {
    return (
      <div className="mx-auto w-[320px] h-[640px] bg-black rounded-[40px] p-3 shadow-2xl border-[6px] border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20" />
        <div className="w-full h-full bg-white rounded-[28px] overflow-hidden flex flex-col relative">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col">
      <div className="h-10 bg-zinc-100 border-b border-zinc-200 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        </div>
        <div className="mx-auto bg-white rounded px-4 py-0.5 text-[10px] text-zinc-400 font-medium w-1/2 text-center">
          verizon.com/shop/{children ? 'checkout' : ''}
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-zinc-50">
        {children}
      </div>
    </div>
  );
};

export const LandingVisual = ({ journeyName, platform }: VisualProps) => (
  <DeviceFrame platform={platform}>
    <nav className="p-4 flex justify-between items-center border-b border-zinc-100 bg-white">
      <div className="w-20 h-5 bg-black rounded-sm" />
      <Search size={18} className="text-zinc-400" />
    </nav>
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="bg-[var(--accent-primary)] text-white text-[10px] font-bold px-2 py-1 rounded w-fit uppercase tracking-wider">New Launch</div>
        <h1 className="text-2xl font-bold text-zinc-900 leading-tight">The next generation of {journeyName} is here.</h1>
        <p className="text-sm text-zinc-500 leading-relaxed">Experience faster speeds, better reliability, and exclusive rewards designed for you.</p>
      </div>
      <div className="aspect-video bg-zinc-100 rounded-xl flex items-center justify-center overflow-hidden relative">
         <img 
           src={`https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800`} 
           className="w-full h-full object-cover opacity-80" 
           alt="Tech"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <button className="w-full py-4 bg-black text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
        Get Started <ArrowRight size={18} />
      </button>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="p-4 bg-white rounded-xl border border-zinc-100 shadow-sm flex flex-col gap-2">
            <Zap size={20} className="text-amber-500" />
            <span className="text-[12px] font-bold text-zinc-900">Priority Hub</span>
            <span className="text-[10px] text-zinc-500">Available on all plans</span>
          </div>
        ))}
      </div>
    </div>
  </DeviceFrame>
);

export const ConfigVisual = ({ journeyName, platform }: VisualProps) => (
  <DeviceFrame platform={platform}>
    <header className="p-4 bg-white border-b border-zinc-100 flex items-center justify-between">
      <h2 className="text-[16px] font-bold text-zinc-900">Configure {journeyName}</h2>
      <div className="text-[12px] font-bold text-zinc-400">Step 2 of 5</div>
    </header>
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">Select your option</span>
        {[
          { name: 'Standard Edition', price: '$45/mo', features: ['All basic features', 'Email support'] },
          { name: 'Ultimate Pro', price: '$75/mo', features: ['Advanced analytics', '24/7 Priority support', 'Unlimited data'], recommended: true }
        ].map((opt, i) => (
          <div key={i} className={clsx(
            "p-5 rounded-2xl border-2 transition-all cursor-pointer relative",
            opt.recommended ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/5" : "border-zinc-100 bg-white"
          )}>
            {opt.recommended && <div className="absolute -top-3 right-4 bg-[var(--accent-primary)] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Recommended</div>}
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-zinc-900">{opt.name}</span>
                <span className="text-[12px] text-zinc-500">{opt.price}</span>
              </div>
              <div className={clsx("w-5 h-5 rounded-full border-2 flex items-center justify-center", opt.recommended ? "border-[var(--accent-primary)]" : "border-zinc-200")}>
                {opt.recommended && <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)]" />}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {opt.features.map((f, j) => (
                <div key={j} className="flex items-center gap-2 text-[11px] text-zinc-600">
                  <CheckCircle size={12} className="text-emerald-500" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-4 bg-black text-white rounded-xl font-bold shadow-lg">Continue to Details</button>
    </div>
  </DeviceFrame>
);

export const FormVisual = ({ journeyName, platform }: VisualProps) => (
  <DeviceFrame platform={platform}>
    <header className="p-4 bg-white border-b border-zinc-100 flex items-center gap-4">
      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
        <User size={16} />
      </div>
      <div className="flex flex-col leading-none">
        <h2 className="text-[14px] font-bold text-zinc-900">Personal Information</h2>
        <span className="text-[10px] text-zinc-400">Secure 256-bit encryption</span>
      </div>
    </header>
    <div className="p-6 flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase">First Name</label>
          <div className="h-12 bg-zinc-50 border border-zinc-200 rounded-xl px-4 flex items-center text-zinc-900 text-sm font-medium">Alex</div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase">Last Name</label>
          <div className="h-12 bg-zinc-50 border border-zinc-200 rounded-xl px-4 flex items-center text-zinc-400 text-sm italic">Enter last name</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold text-zinc-400 uppercase">Service Address</label>
        <div className="h-12 bg-zinc-50 border border-zinc-200 rounded-xl px-4 flex items-center gap-3">
          <Search size={16} className="text-zinc-400" />
          <span className="text-zinc-400 text-sm">Search your address...</span>
        </div>
      </div>
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
        <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-[11px] text-blue-700 leading-relaxed">
          We'll use this to check availability for <strong>{journeyName}</strong> in your specific area.
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded border border-zinc-300 bg-white" />
          <span className="text-[12px] text-zinc-600">I agree to the <span className="text-[var(--accent-primary)] underline">Terms of Service</span></span>
        </div>
        <button className="w-full py-4 bg-black text-white rounded-xl font-bold shadow-lg">Verify Address</button>
      </div>
    </div>
  </DeviceFrame>
);

export const ReviewVisual = ({ journeyName, platform }: VisualProps) => (
  <DeviceFrame platform={platform}>
    <header className="p-4 bg-white border-b border-zinc-100 flex items-center justify-between">
      <h2 className="text-[16px] font-bold text-zinc-900">Review & Checkout</h2>
      <ShoppingBag size={18} className="text-zinc-400" />
    </header>
    <div className="p-6 flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
          <span className="text-[12px] font-bold text-zinc-900 uppercase tracking-widest">Your Summary</span>
          <button className="text-[10px] font-bold text-[var(--accent-primary)] uppercase">Edit</button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                <Package size={20} className="text-zinc-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-zinc-900">{journeyName}</span>
                <span className="text-[11px] text-zinc-500">Professional Installation</span>
              </div>
            </div>
            <span className="text-[14px] font-bold text-zinc-900">$75.00</span>
          </div>
          <div className="h-[1px] bg-zinc-50" />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[13px] text-zinc-500">
              <span>Subtotal</span>
              <span>$75.00</span>
            </div>
            <div className="flex justify-between text-[13px] text-zinc-500">
              <span>Tax & Fees</span>
              <span>$4.20</span>
            </div>
            <div className="flex justify-between text-[15px] font-bold text-zinc-900 mt-2">
              <span>Total due today</span>
              <span>$79.20</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 p-4 border border-zinc-100 rounded-xl">
           <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center">
              <CreditCard size={20} className="text-zinc-400" />
           </div>
           <div className="flex flex-col flex-1">
              <span className="text-[13px] font-bold text-zinc-900">Visa ending in 4242</span>
              <span className="text-[11px] text-zinc-400">Expires 12/26</span>
           </div>
           <ChevronRight size={16} className="text-zinc-300" />
        </div>
      </div>

      <button className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200">Complete Purchase</button>
    </div>
  </DeviceFrame>
);

export const SuccessVisual = ({ journeyName, platform }: VisualProps) => (
  <DeviceFrame platform={platform}>
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-20" />
        <CheckCircle2 size={48} className="text-emerald-500 relative z-10" />
      </div>
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Success!</h1>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Your order for <strong>{journeyName}</strong> has been confirmed and is now being processed.
        </p>
      </div>

      <div className="w-full p-5 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col gap-4">
        <div className="flex justify-between items-center text-[12px]">
          <span className="text-zinc-400 font-bold uppercase tracking-widest">Order Number</span>
          <span className="text-zinc-900 font-bold">#VZW-89274-90</span>
        </div>
        <div className="flex justify-between items-center text-[12px]">
          <span className="text-zinc-400 font-bold uppercase tracking-widest">Status</span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold">Processing</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button className="w-full py-4 bg-black text-white rounded-xl font-bold shadow-lg">View Order Status</button>
        <button className="w-full py-3 text-[13px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors">Return to Homepage</button>
      </div>
    </div>
  </DeviceFrame>
);

export const VisualRenderer = ({ visualTemplateId, journeyName, stepName, platform }: VisualProps & { visualTemplateId?: string }) => {
  const props = { journeyName, stepName, platform };
  
  switch (visualTemplateId) {
    case 'LANDING':
      return <LandingVisual {...props} />;
    case 'CONFIG':
      return <ConfigVisual {...props} />;
    case 'FORM':
      return <FormVisual {...props} />;
    case 'REVIEW':
      return <ReviewVisual {...props} />;
    case 'SUCCESS':
      return <SuccessVisual {...props} />;
    default:
      return <LandingVisual {...props} />;
  }
};
