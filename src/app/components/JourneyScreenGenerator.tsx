import React from 'react';
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  CreditCard,
  User,
  Settings,
  ArrowRight,
  Info,
  Plus,
  ArrowLeft,
  X,
  Package,
  MessageSquare
} from 'lucide-react';
import { Journey, JourneyStep } from '@/app/data/mockJourneys';

interface JourneyScreenGeneratorProps {
  journey: Journey;
  step: JourneyStep;
}

export const JourneyScreenGenerator: React.FC<JourneyScreenGeneratorProps> = ({ journey, step }) => {
  const isMobile = journey.platform === 'Mobile';
  const accentColor = 'var(--accent-primary)';

  const stepIndex = journey.steps.findIndex(s => s.stepId === step.stepId);
  const isFirstStep = stepIndex === 0;

  const renderHeader = () => {
    if (isMobile) {
      return (
        <div className="flex items-center justify-between px-5 py-5 bg-white border-b border-zinc-100 shrink-0 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            {isFirstStep ? <Menu size={20} className="text-zinc-900" /> : <ArrowLeft size={20} className="text-zinc-900" />}
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-black rounded flex items-center justify-center text-white font-black text-[9px]">V</div>
              <span className="text-[12px] font-black tracking-tighter uppercase italic">verizon</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Search size={20} className="text-zinc-600" />
            <ShoppingCart size={20} className="text-zinc-600" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-zinc-100 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black rounded flex items-center justify-center text-white font-black text-[12px]">V</div>
            <span className="text-[16px] font-black tracking-tighter uppercase italic">verizon</span>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-[13px] font-bold text-zinc-500 uppercase tracking-widest">
            <span>Shop</span>
            <span>Why Verizon</span>
            <span>Support</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <input type="text" placeholder="Search" className="bg-zinc-50 border border-zinc-100 rounded-full px-4 py-2 text-[13px] outline-none w-48 focus:w-64 transition-all" />
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
          <div className="flex items-center gap-4">
            <ShoppingCart size={20} className="text-zinc-900" />
            <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200"><User size={18} /></div>
          </div>
        </div>
      </div>
    );
  };

  const renderLanding = () => {
    const d = step.description.toLowerCase();
    const isPromo = d.includes('promotion') || d.includes('value proposition') || d.includes('offer');
    const isDiscovery = d.includes('discovery') || d.includes('homepage') || d.includes('search');
    const isService = d.includes('service check') || d.includes('availability');

    if (isMobile) {
      return (
        <div className="flex flex-col flex-1 overflow-auto bg-white no-scrollbar">
          <div className="relative h-[240px] bg-zinc-900 flex items-center justify-center p-8 overflow-hidden shrink-0">
             <img src={`https://images.unsplash.com/photo-${isPromo ? '1750056393326-8feed2a1c34f' : (isDiscovery ? '1767449441925-737379bc2c4d' : '1550745165-9bc0b252726f')}?auto=format&fit=crop&q=80&w=800`} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Hero" />
             <div className="relative z-10 text-center flex flex-col gap-3">
                <span className="text-[10px] font-bold text-white bg-rose-600 w-fit mx-auto px-3 py-1 rounded-full uppercase tracking-widest">{isPromo ? 'Limited Offer' : (isService ? 'Service Check' : 'Explore')}</span>
                <h1 className="text-[28px] font-black text-white leading-tight tracking-tight">{step.stepName}</h1>
                <p className="text-[13px] text-zinc-200 font-medium px-4 line-clamp-2">{step.description}</p>
             </div>
          </div>
          <div className="p-6 flex flex-col gap-6">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 items-center">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-[var(--accent-primary)] shrink-0 shadow-sm">
                    {i === 1 ? <Zap size={20} /> : i === 2 ? <ShieldCheck size={20} /> : <Star size={20} />}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[15px] font-bold text-zinc-900">{isDiscovery ? 'Category ' + i : 'Benefit ' + i}</h3>
                    <span className="text-[11px] text-zinc-500 font-medium">Click to explore details and terms.</span>
                  </div>
               </div>
             ))}
             <button className="w-full py-4 bg-[var(--accent-primary)] text-white rounded-2xl font-black text-[15px] shadow-lg shadow-rose-900/20 mt-2">
                {isDiscovery ? 'Search Products' : (isService ? 'Check Availability' : 'Get Started')}
             </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1 overflow-auto bg-white no-scrollbar">
        <div className="relative h-[440px] bg-zinc-900 flex items-center px-16 overflow-hidden shrink-0">
           <img src={`https://images.unsplash.com/photo-${isPromo ? '1750056393326-8feed2a1c34f' : (isDiscovery ? '1767449441925-737379bc2c4d' : '1550745165-9bc0b252726f')}?auto=format&fit=crop&q=80&w=1200`} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Hero" />
           <div className="relative z-10 max-w-2xl flex flex-col gap-6">
              <span className="text-[12px] font-bold text-[var(--accent-primary)] bg-white/10 w-fit px-4 py-1 rounded-full uppercase tracking-[0.2em] backdrop-blur-sm">
                {isPromo ? 'Member Exclusive' : 'Official Portal'}
              </span>
              <h1 className="text-[64px] font-black text-white leading-[0.9] tracking-tighter">
                {step.stepName}
              </h1>
              <p className="text-[20px] text-zinc-300 font-medium leading-relaxed max-w-xl">
                {step.description}
              </p>
              <div className="flex items-center gap-4">
                <button className="px-12 py-5 bg-[var(--accent-primary)] text-white rounded-2xl font-black text-[16px] hover:scale-105 transition-transform shadow-2xl shadow-rose-900/40">
                  {isDiscovery ? 'Browse Catalog' : 'Initialize Flow'}
                </button>
                <button className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-[16px] backdrop-blur-md">
                  View Specifications
                </button>
              </div>
           </div>
        </div>
        <div className="p-16 grid grid-cols-3 gap-12 max-w-7xl mx-auto w-full">
           {[1, 2, 3].map(i => (
             <div key={i} className="flex flex-col gap-5 group">
                <div className="w-16 h-16 rounded-[28px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[var(--accent-primary)] group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300 shadow-sm">
                  {i === 1 ? <Zap size={32} strokeWidth={1.5} /> : i === 2 ? <ShieldCheck size={32} strokeWidth={1.5} /> : <Star size={32} strokeWidth={1.5} />}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[22px] font-black text-zinc-900 tracking-tight leading-none">{isDiscovery ? 'Explore Option ' + i : 'Advanced Power ' + i}</h3>
                  <p className="text-[15px] text-zinc-500 font-medium leading-relaxed">
                    Designed specifically for {journey.category.toLowerCase()} needs with enterprise-grade reliability.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[14px] font-black text-[var(--accent-primary)] group-hover:translate-x-2 transition-transform cursor-pointer">
                  See more details <ArrowRight size={16} />
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  };

  const renderConfig = () => {
    const d = step.description.toLowerCase();
    const isComparison = d.includes('comparison') || d.includes('evaluation');
    const isValuation = d.includes('valuation') || d.includes('condition');
    const isSpeed = d.includes('speed selection') || d.includes('bandwidth');

    if (isMobile) {
      return (
        <div className="flex flex-col flex-1 overflow-auto bg-zinc-50 no-scrollbar">
          <div className="bg-white p-6 border-b border-zinc-100 flex flex-col gap-1 shrink-0">
            <h2 className="text-[22px] font-black text-zinc-900 tracking-tight leading-none">{step.stepName}</h2>
            <p className="text-[12px] text-zinc-500 font-medium line-clamp-1">{step.description}</p>
          </div>
          <div className="p-5 flex flex-col gap-4">
             {(isValuation ? ['Like New', 'Good', 'Cracked'] : ['Base', 'Enhanced', 'Pro Max']).map((opt, i) => (
               <div key={opt} className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all ${i === 1 ? 'border-[var(--accent-primary)] bg-rose-50/20 shadow-lg shadow-rose-900/5' : 'border-white bg-white'}`}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[16px] font-black text-zinc-900">{opt}</span>
                    <span className="text-[12px] text-zinc-500 font-medium">{isValuation ? 'Evaluated Status' : (isSpeed ? 'Up to ' + (100*(i+1)) + ' Mbps' : 'Optimized Config')}</span>
                  </div>
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${i === 1 ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white' : 'border-zinc-200'}`}>
                    {i === 1 && <CheckCircle2 size={16} strokeWidth={3} />}
                  </div>
               </div>
             ))}
             
             <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center justify-between px-1">
                   <span className="text-[13px] font-black text-zinc-900 uppercase tracking-widest">Recommended Upgrades</span>
                   <span className="text-[11px] font-bold text-[var(--accent-primary)]">View All</span>
                </div>
                {['Hyper-Speed Bundle', 'Global Coverage Pack'].map((item, i) => (
                   <div key={item} className="p-5 bg-white rounded-2xl flex items-center gap-5 border border-zinc-100 shadow-sm group">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-all">
                        <Plus size={22} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[15px] font-bold text-zinc-900">{item}</span>
                        <span className="text-[11px] text-zinc-500 font-medium">Add for $14.99/mo</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
          <div className="mt-auto bg-zinc-950 p-6 rounded-t-[40px] flex flex-col gap-5 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
             <div className="flex justify-between items-baseline text-white px-2">
                <span className="text-[14px] font-bold text-zinc-500 uppercase tracking-widest">Current Total</span>
                <span className="text-[32px] font-black tracking-tighter">$94.99</span>
             </div>
             <button className="w-full py-5 bg-[var(--accent-primary)] text-white rounded-2xl font-black text-[16px] shadow-lg shadow-rose-900/20 active:scale-95 transition-all">
                Confirm & Continue
             </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1 overflow-auto bg-zinc-50/50 no-scrollbar">
        <div className="p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12 lg:gap-16 max-w-7xl mx-auto w-full">
           <div className="flex-1 flex flex-col gap-6 sm:gap-8 md:gap-10">
              <div className="flex flex-col gap-2 border-l-4 sm:border-l-6 md:border-l-8 border-[var(--accent-primary)] pl-4 sm:pl-6 md:pl-8">
                 <h2 className="text-[28px] sm:text-[32px] md:text-[38px] lg:text-[42px] font-black text-zinc-900 tracking-tighter leading-none">{step.stepName}</h2>
                 <p className="text-[14px] sm:text-[16px] md:text-[18px] text-zinc-500 font-medium max-w-lg leading-relaxed">{step.description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                 {(isValuation ? ['Premium Trade-in', 'Certified Recycled', 'Legacy Exchange', 'Value Boost'] : ['Performance', 'Ultra High', 'Enterprise', 'Quantum']).map((opt, i) => (
                    <div key={opt} className={`bg-white p-6 sm:p-8 md:p-10 rounded-[32px] sm:rounded-[38px] md:rounded-[44px] border-3 sm:border-4 transition-all cursor-pointer group flex flex-col gap-4 sm:gap-5 md:gap-6 ${i === 0 ? 'border-zinc-900 shadow-2xl scale-[1.02]' : 'border-transparent hover:border-zinc-200 shadow-sm'}`}>
                       <div className="flex justify-between items-start">
                          <div className={`w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${i === 0 ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-400 group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-all'}`}>
                             {i === 0 ? <CheckCircle2 size={28} className="sm:w-[30px] sm:h-[30px] md:w-[32px] md:h-[32px]" /> : <Plus size={28} className="sm:w-[30px] sm:h-[30px] md:w-[32px] md:h-[32px]" />}
                          </div>
                          <span className={`text-[16px] sm:text-[18px] md:text-[20px] font-black ${i === 0 ? 'text-zinc-900' : 'text-zinc-400'}`}>${49 + i*30}</span>
                       </div>
                       <div className="flex flex-col gap-1.5 sm:gap-2">
                          <span className="text-[18px] sm:text-[20px] md:text-[24px] font-black text-zinc-900 leading-none">{opt}</span>
                          <span className="text-[13px] sm:text-[14px] md:text-[15px] text-zinc-500 font-medium">Fully integrated {journey.category.toLowerCase()} solution with {isSpeed ? 'maximum bandwidth' : '24/7 dedicated support'}.</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="w-full lg:w-[440px] shrink-0">
              <div className="bg-zinc-900 rounded-[32px] sm:rounded-[40px] md:rounded-[50px] p-6 sm:p-8 md:p-10 text-white flex flex-col gap-6 sm:gap-8 md:gap-10 shadow-2xl lg:sticky lg:top-8 border border-white/5">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] sm:text-[11px] md:text-[12px] font-bold text-rose-500 uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] font-black">Live Configuration</span>
                    <h3 className="text-[24px] sm:text-[28px] md:text-[32px] font-black tracking-tighter">Selection Summary</h3>
                 </div>
                 
                 <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 border-y border-white/10 py-6 sm:py-7 md:py-8">
                    <div className="flex justify-between items-center font-bold">
                       <span className="text-zinc-400 text-[13px] sm:text-[14px] md:text-[15px]">Base Infrastructure</span>
                       <span className="text-[16px] sm:text-[17px] md:text-[18px]">$85.00</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                       <span className="text-zinc-400 text-[13px] sm:text-[14px] md:text-[15px]">Advanced Intelligence</span>
                       <span className="text-emerald-400 flex items-center gap-2"><Zap size={14} /> Included</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                       <span className="text-zinc-400 text-[13px] sm:text-[14px] md:text-[15px]">Corporate Discount</span>
                       <span className="text-rose-400 text-[16px] sm:text-[17px] md:text-[18px]">-$15.00</span>
                    </div>
                 </div>

                 <div className="flex flex-col gap-1">
                    <span className="text-[12px] sm:text-[13px] md:text-[14px] font-bold text-zinc-500 uppercase tracking-widest">Estimated/mo</span>
                    <span className="text-[48px] sm:text-[56px] md:text-[64px] font-black leading-none tracking-tighter">$70.00</span>
                 </div>

                 <button className="w-full py-4 sm:py-5 md:py-6 bg-[var(--accent-primary)] text-white rounded-2xl sm:rounded-3xl font-black text-[15px] sm:text-[16px] md:text-[18px] hover:bg-rose-700 hover:scale-[1.02] transition-all shadow-xl shadow-rose-950/40">
                    Process Selection
                 </button>
                 
                 <div className="flex items-center gap-2 sm:gap-3 justify-center opacity-40">
                    <ShieldCheck size={14} className="sm:w-[15px] sm:h-[15px] md:w-[16px] md:h-[16px]" />
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">Encrypted Checkout</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    const s = step.stepName.toLowerCase();
    const d = step.description.toLowerCase();
    
    // Much more granular sub-variants based on rich description
    const isMFA = s.includes('mfa') || d.includes('6-digit') || d.includes('security challenge');
    const isLogin = s.includes('login') || s.includes('entry') || d.includes('authentication interface');
    const isIdentity = s.includes('identity') || d.includes('credentials') || d.includes('verification');
    const isSetup = s.includes('setup') || s.includes('link') || d.includes('connection settings');

    if (isMobile) {
      return (
        <div className="flex flex-col flex-1 overflow-auto bg-white p-6 no-scrollbar">
          <div className="flex flex-col gap-8">
             <div className="flex flex-col gap-2">
                <div className="w-8 h-1 bg-black mb-2" />
                <h2 className="text-[26px] font-black text-zinc-900 tracking-tight leading-none">
                  {isMFA ? 'Enter Code' : (isLogin ? 'Sign In' : (isSetup ? 'Connect' : 'Information'))}
                </h2>
                <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">
                  {step.description}
                </p>
             </div>

             <div className="flex flex-col gap-5">
                {isMFA ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-2.5">
                       {[1,2,3,4,5,6].map(i => (
                         <div key={i} className={`flex-1 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-[20px] ${i === 1 ? 'border-black bg-white shadow-lg' : 'border-zinc-100 bg-zinc-50'}`}>
                           {i === 1 ? '•' : ''}
                         </div>
                       ))}
                    </div>
                    <div className="flex flex-col gap-2 items-center text-center">
                       <span className="text-[13px] font-bold text-zinc-400">Didn't receive a code?</span>
                       <button className="text-[13px] font-black text-[var(--accent-primary)] uppercase tracking-widest">Resend via SMS</button>
                    </div>
                  </div>
                ) : isLogin ? (
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Business ID / Email</label>
                        <input type="text" className="h-16 px-6 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none font-bold" placeholder="yourname@company.com" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Secure Password</label>
                        <input type="password" placeholder="••••••••" className="h-16 px-6 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none font-bold" />
                     </div>
                     <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border border-zinc-300 rounded" />
                           <span className="text-[12px] font-medium text-zinc-500">Remember me</span>
                        </div>
                        <span className="text-[12px] font-bold text-[var(--accent-primary)]">Forgot?</span>
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Full Name</label>
                        <input type="text" className="h-14 px-5 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none font-bold text-[14px]" placeholder="Abhinav Saxena" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Contact Email</label>
                        <input type="email" className="h-14 px-5 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none font-bold text-[14px]" placeholder="abhinav@verizon.com" />
                     </div>
                  </div>
                )}
             </div>

             <button className="w-full py-4.5 bg-black text-white rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10 active:scale-95 transition-all">
                {isMFA ? 'Verify Access' : (isLogin ? 'Secure Sign In' : 'Continue')} 
                <ArrowRight size={18} />
             </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1 overflow-auto bg-white p-20 no-scrollbar">
         <div className="max-w-3xl mx-auto w-full flex flex-col gap-12">
            <div className="flex flex-col gap-3 border-l-[6px] border-black pl-8">
               <h2 className="text-[48px] font-black text-zinc-900 tracking-tighter leading-none">
                 {isMFA ? 'Secure Verification' : (isLogin ? 'Account Access' : 'Profile Details')}
               </h2>
               <p className="text-[18px] text-zinc-500 font-medium max-w-lg leading-relaxed">{step.description}</p>
            </div>
            
            <div className="flex flex-col gap-10">
               {isMFA ? (
                 <div className="bg-zinc-50 p-12 rounded-[40px] border border-zinc-100 flex flex-col gap-10 items-center text-center">
                    <div className="w-16 h-16 bg-white border border-zinc-200 rounded-3xl flex items-center justify-center text-[var(--accent-primary)] shadow-sm">
                       <ShieldCheck size={32} />
                    </div>
                    <div className="flex flex-col gap-6 w-full max-w-md">
                       <div className="flex gap-4">
                          {[1,2,3,4,5,6].map(i => (
                            <div key={i} className={`flex-1 h-20 bg-white border-2 rounded-2xl flex items-center justify-center font-black text-[28px] ${i === 1 ? 'border-black' : 'border-zinc-200'}`}>
                               {i === 1 ? '•' : ''}
                            </div>
                          ))}
                       </div>
                       <p className="text-[14px] text-zinc-400 font-medium">Please enter the 6-digit code sent to abhinav.s***@verizon.com</p>
                    </div>
                 </div>
               ) : isLogin ? (
                 <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-3">
                       <label className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.2em]">Enterprise ID</label>
                       <input type="text" className="h-20 px-8 bg-zinc-50 border border-zinc-100 rounded-[28px] outline-none font-bold text-[18px] focus:bg-white focus:border-black transition-all" placeholder="name@company.com" />
                    </div>
                    <div className="flex flex-col gap-3">
                       <label className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.2em]">Password</label>
                       <input type="password" placeholder="••••••••••••" className="h-20 px-8 bg-zinc-50 border border-zinc-100 rounded-[28px] outline-none font-bold text-[18px] focus:bg-white focus:border-black transition-all" />
                    </div>
                    <div className="flex justify-between items-center py-2 px-2">
                       <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-zinc-200 rounded-md" />
                          <span className="text-[15px] font-bold text-zinc-500">Remember this device</span>
                       </div>
                       <button className="text-[15px] font-black text-[var(--accent-primary)] hover:underline">Trouble signing in?</button>
                    </div>
                 </div>
               ) : (
                 <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                       <label className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.2em]">Legal Name</label>
                       <input type="text" className="h-16 px-6 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none font-bold text-[16px]" defaultValue="Abhinav Saxena" />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.2em]">Official Title</label>
                       <input type="text" className="h-16 px-6 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none font-bold text-[16px]" defaultValue="CX Operations Manager" />
                    </div>
                    <div className="col-span-2 flex flex-col gap-2">
                       <label className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.2em]">Business Mailing Address</label>
                       <input type="text" className="h-16 px-6 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none font-bold text-[16px]" defaultValue="1095 Avenue of the Americas, New York, NY" />
                    </div>
                 </div>
               )}
            </div>

            <button className="w-full py-6 bg-black text-white rounded-[32px] font-black text-[18px] hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-900/10 flex items-center justify-center gap-4">
               {isMFA ? 'Complete Authentication' : (isLogin ? 'Authorize Access' : 'Confirm Information')} 
               <ArrowRight size={22} />
            </button>
         </div>
      </div>
    );
  };

  const renderReview = () => {
    const d = step.description.toLowerCase();
    const isOrderReview = d.includes('order') || d.includes('checkout') || d.includes('submission');
    const isPaymentReview = d.includes('billing') || d.includes('payment') || d.includes('financial');
    const isResolution = d.includes('resolution') || d.includes('support') || d.includes('agent');

    if (isMobile) {
      return (
        <div className="flex flex-col flex-1 overflow-auto bg-zinc-50 no-scrollbar">
          <div className="p-6 bg-white border-b border-zinc-100 flex flex-col gap-1">
             <h2 className="text-[20px] font-black text-zinc-900">{step.stepName}</h2>
             <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">Final Step Before Completion</p>
          </div>
          <div className="p-5 flex flex-col gap-4">
             <div className="bg-white p-6 rounded-[32px] border border-zinc-100 flex flex-col gap-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                   <span className="text-[13px] font-black text-zinc-900">{isPaymentReview ? 'Financial Summary' : 'Selection Details'}</span>
                   <button className="text-[11px] font-bold text-[var(--accent-primary)] uppercase">Modify</button>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[var(--accent-primary)]">
                      {isPaymentReview ? <CreditCard size={24} /> : (isResolution ? <MessageSquare size={24} /> : <Package size={24} />)}
                   </div>
                   <div className="flex flex-col leading-tight gap-1">
                      <span className="text-[15px] font-black text-zinc-900">{journey.journeyName}</span>
                      <p className="text-[12px] text-zinc-500 font-medium line-clamp-1">{step.description}</p>
                   </div>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-[32px] border border-zinc-100 flex flex-col gap-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                   <span className="text-[13px] font-black text-zinc-900">Security & Billing</span>
                </div>
                <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-3 font-bold text-[14px] text-zinc-700">
                      <ShieldCheck size={18} className="text-emerald-500" />
                      Encrypted Connection
                   </div>
                   <div className="flex items-center gap-3 font-bold text-[14px] text-zinc-700">
                      <CreditCard size={18} />
                      Visa Ending •••• 4242
                   </div>
                </div>
             </div>

             <div className="p-8 bg-zinc-950 rounded-[40px] text-white flex flex-col gap-6 mt-2 shadow-2xl">
                <div className="flex flex-col gap-3">
                   <div className="flex justify-between text-[14px] font-bold">
                      <span className="text-zinc-500">Subtotal</span>
                      <span>$89.99</span>
                   </div>
                   <div className="flex justify-between text-[14px] font-bold">
                      <span className="text-zinc-500">Taxes</span>
                      <span>$4.20</span>
                   </div>
                </div>
                <div className="flex justify-between text-[28px] font-black pt-5 border-t border-white/10 tracking-tighter">
                   <span>Total Due</span>
                   <span>$94.19</span>
                </div>
                <button className="w-full py-5 bg-[var(--accent-primary)] text-white rounded-2xl font-black text-[16px] mt-2 shadow-lg shadow-rose-950/40 active:scale-95 transition-all">
                   {isResolution ? 'Confirm Resolution' : 'Finalize Request'}
                </button>
             </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1 overflow-auto bg-zinc-50/50 p-20 no-scrollbar">
         <div className="max-w-6xl mx-auto w-full flex flex-col gap-12">
            <div className="flex flex-col gap-3 border-l-[10px] border-[var(--accent-primary)] pl-10">
               <h2 className="text-[56px] font-black text-zinc-900 tracking-tighter leading-none">{step.stepName}</h2>
               <p className="text-[20px] text-zinc-500 font-medium max-w-2xl leading-relaxed">{step.description}</p>
            </div>
            
            <div className="grid grid-cols-12 gap-12">
               <div className="col-span-8 flex flex-col gap-8">
                  <div className="bg-white p-12 rounded-[50px] border border-zinc-100 shadow-sm flex flex-col gap-8">
                     <h3 className="text-[24px] font-black text-zinc-900 border-b border-zinc-50 pb-6 flex justify-between items-center">
                        Selected Components
                        <button className="text-[13px] font-black text-[var(--accent-primary)] uppercase tracking-widest border-b-2 border-[var(--accent-primary)]">Change Selection</button>
                     </h3>
                     <div className="grid grid-cols-2 gap-8">
                        <div className="flex items-center gap-6 p-6 bg-zinc-50 rounded-[32px] border border-zinc-100">
                           <div className="w-16 h-16 rounded-[24px] bg-white border border-zinc-100 flex items-center justify-center text-[var(--accent-primary)] shadow-sm">
                              <Zap size={32} />
                           </div>
                           <div className="flex flex-col gap-1">
                              <span className="text-[18px] font-black text-zinc-900">Primary Product</span>
                              <span className="text-[14px] text-zinc-500 font-bold">{journey.journeyName}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-6 p-6 bg-zinc-50 rounded-[32px] border border-zinc-100">
                           <div className="w-16 h-16 rounded-[24px] bg-white border border-zinc-100 flex items-center justify-center text-[var(--accent-primary)] shadow-sm">
                              <ShieldCheck size={32} />
                           </div>
                           <div className="flex flex-col gap-1">
                              <span className="text-[18px] font-black text-zinc-900">Protection Tier</span>
                              <span className="text-[14px] text-zinc-500 font-bold">Verizon Mobile Protect</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white p-12 rounded-[50px] border border-zinc-100 shadow-sm flex flex-col gap-8">
                     <h3 className="text-[24px] font-black text-zinc-900 border-b border-zinc-50 pb-6 flex justify-between items-center">
                        Billing Information
                        <button className="text-[13px] font-black text-[var(--accent-primary)] uppercase tracking-widest border-b-2 border-[var(--accent-primary)]">Edit Payment</button>
                     </h3>
                     <div className="flex items-center gap-8 p-8 bg-zinc-900 rounded-[32px] text-white">
                        <div className="w-20 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                           <CreditCard size={32} />
                        </div>
                        <div className="flex-1 flex flex-col">
                           <span className="text-[20px] font-black">Visa Signature •••• 4242</span>
                           <span className="text-[15px] text-zinc-400 font-medium">Auto-pay enabled for maximum discounts</span>
                        </div>
                        <div className="text-emerald-400 font-black text-[14px] uppercase tracking-widest">Verified</div>
                     </div>
                  </div>
               </div>

               <div className="col-span-4 flex flex-col gap-8">
                  <div className="bg-white p-10 rounded-[50px] border-4 border-zinc-900 shadow-2xl flex flex-col gap-10 relative overflow-hidden h-fit">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -mr-16 -mt-16" />
                     <div className="flex flex-col gap-2">
                        <span className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.3em]">Total Overview</span>
                        <h3 className="text-[32px] font-black tracking-tighter">Confirm Terms</h3>
                     </div>
                     <div className="flex flex-col gap-5">
                        <div className="flex justify-between font-bold text-zinc-500 text-[18px]">
                           <span>Selection Total</span>
                           <span className="text-zinc-900">$109.99</span>
                        </div>
                        <div className="flex justify-between font-bold text-zinc-500 text-[18px]">
                           <span>Loyalty Savings</span>
                           <span className="text-emerald-600">-$20.00</span>
                        </div>
                        <div className="flex justify-between font-black text-zinc-900 text-[48px] pt-8 border-t-2 border-zinc-100 tracking-tighter leading-none">
                           <span>Total</span>
                           <span>$89.99</span>
                        </div>
                     </div>
                     <button className="w-full py-6 bg-zinc-900 text-white rounded-[28px] font-black text-[20px] hover:bg-black hover:scale-[1.03] transition-all shadow-xl shadow-zinc-900/20">
                        Complete Order
                     </button>
                     <p className="text-[12px] text-zinc-400 text-center font-medium leading-relaxed px-4">
                        By clicking complete, you agree to the Verizon terms of service and the {journey.category} disclosure.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  };

  const renderSuccess = () => {
    const d = step.description.toLowerCase();
    const isActivation = d.includes('activation') || d.includes('confirmed');
    const isResolution = d.includes('resolution') || d.includes('solved');

    if (isMobile) {
      return (
        <div className="flex flex-col flex-1 overflow-auto bg-white items-center justify-center p-10 text-center no-scrollbar">
           <div className="relative mb-10">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-[2.5] animate-pulse" />
              <div className="w-28 h-28 rounded-full bg-white border-8 border-emerald-500 flex items-center justify-center text-emerald-500 relative z-10 shadow-2xl">
                 <CheckCircle2 size={56} strokeWidth={2.5} />
              </div>
           </div>
           <h2 className="text-[32px] font-black text-zinc-900 leading-none mb-3 tracking-tighter">Request Confirmed</h2>
           <p className="text-[15px] text-zinc-500 font-medium mb-10 px-4 leading-relaxed">{step.description}</p>
           
           <div className="w-full bg-zinc-50 rounded-[32px] p-8 border border-zinc-100 mb-10 flex flex-col gap-6 text-left shadow-sm">
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Transaction Reference</span>
                 <span className="text-[18px] font-black text-zinc-900">VZW-TX-4910284</span>
              </div>
              <div className="h-[2px] bg-zinc-200/50" />
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Expected Completion</span>
                 <span className="text-[18px] font-black text-zinc-900">{isActivation ? 'Within 60 Minutes' : 'Real-time Sync'}</span>
              </div>
           </div>

           <div className="flex flex-col gap-3 w-full">
              <button className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black text-[16px] shadow-xl shadow-zinc-900/20 active:scale-95 transition-all">
                 Back to My Dashboard
              </button>
              <button className="w-full py-4 text-zinc-400 font-black text-[12px] uppercase tracking-[0.2em] hover:text-zinc-900 transition-colors">
                 Save Receipt to Device
              </button>
           </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1 overflow-auto bg-white items-center justify-center p-20 text-center no-scrollbar">
         <div className="max-w-2xl w-full flex flex-col items-center">
            <div className="relative mb-16">
               <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] rounded-full scale-[3]" />
               <div className="w-40 h-40 rounded-full bg-white border-[12px] border-emerald-500 flex items-center justify-center text-emerald-500 relative z-10 shadow-[0_32px_64px_-12px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 size={80} strokeWidth={2.5} />
               </div>
            </div>
            <h2 className="text-[72px] font-black text-zinc-900 tracking-tighter leading-none mb-6">Success.</h2>
            <p className="text-[24px] text-zinc-500 font-medium mb-16 max-w-xl leading-relaxed">
              {step.description}
            </p>
            
            <div className="w-full grid grid-cols-2 gap-8 mb-16">
               <div className="bg-zinc-50 p-10 rounded-[48px] border border-zinc-100 flex flex-col gap-2 text-left shadow-sm group hover:border-[var(--accent-primary)]/20 transition-all">
                  <span className="text-[13px] font-black text-zinc-400 uppercase tracking-[0.2em]">Unique Order ID</span>
                  <span className="text-[24px] font-black text-zinc-900 tracking-tight">VZW-REQ-491028472</span>
               </div>
               <div className="bg-zinc-50 p-10 rounded-[48px] border border-zinc-100 flex flex-col gap-2 text-left shadow-sm group hover:border-[var(--accent-primary)]/20 transition-all">
                  <span className="text-[13px] font-black text-zinc-400 uppercase tracking-[0.2em]">Estimated Fulfillment</span>
                  <span className="text-[24px] font-black text-zinc-900 tracking-tight">{isActivation ? 'Immediate Activation' : 'Next 24 Hours'}</span>
               </div>
            </div>

            <div className="flex gap-6 w-full">
               <button className="flex-1 py-7 bg-zinc-950 text-white rounded-[32px] font-black text-[20px] hover:scale-[1.03] transition-all shadow-2xl shadow-zinc-950/30 flex items-center justify-center gap-3">
                  Return to Account
                  <ArrowRight size={24} />
               </button>
               <button className="flex-1 py-7 bg-zinc-100 text-zinc-900 rounded-[32px] font-black text-[20px] hover:bg-zinc-200 transition-all">
                  View Full Status
               </button>
            </div>
         </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (step.screenTemplate) {
      case 'landing': return renderLanding();
      case 'config': return renderConfig();
      case 'form': return renderForm();
      case 'review': return renderReview();
      case 'success': return renderSuccess();
      default: return renderLanding();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white relative ${isMobile ? 'w-full' : 'w-full'}`}>
      {renderHeader()}
      {renderContent()}
    </div>
  );
};